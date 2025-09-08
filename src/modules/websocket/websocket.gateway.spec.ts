import { Test, TestingModule } from '@nestjs/testing';
import { TradingWebSocketGateway } from './websocket.gateway';
import { JwtService } from '@nestjs/jwt';
import { KisWebSocketService } from '../../infrastructure/external/kis-websocket.service';
import { RealtimeDataService } from './realtime-engine.service';
import { Server, Socket } from 'socket.io';

describe('TradingWebSocketGateway', () => {
  let gateway: TradingWebSocketGateway;
  let jwtService: jest.Mocked<JwtService>;
  let kisWebSocketService: jest.Mocked<KisWebSocketService>;
  let realtimeDataService: jest.Mocked<RealtimeDataService>;

  const mockServer = {
    emit: jest.fn(),
    to: jest.fn().mockReturnThis(),
  } as any;

  const mockSocket = {
    id: 'test-socket-id',
    handshake: {
      auth: { token: 'test-jwt-token' },
      headers: { authorization: 'Bearer test-jwt-token' }
    },
    data: {},
    emit: jest.fn(),
    join: jest.fn(),
    leave: jest.fn(),
    disconnect: jest.fn(),
    on: jest.fn(),
  } as any;

  const mockJwtPayload = {
    sub: 'test-user-id',
    email: 'test@example.com',
    iat: Date.now(),
    exp: Date.now() + 3600000,
  };

  const mockNotificationService = {
    verify: jest.fn(),
    decode: jest.fn(),
  };

  const mockKisWebSocketService = {
    isWebSocketConnected: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    subscribeToStock: jest.fn(),
    unsubscribeFromStock: jest.fn(),
    sendOrder: jest.fn(),
    getConnectionStatus: jest.fn(),
  };

  const mockRealtimeDataService = {
    getStockData: jest.fn(),
    getPortfolioData: jest.fn(),
    getTradingSignals: jest.fn(),
    subscribeToUpdates: jest.fn(),
    unsubscribeFromUpdates: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradingWebSocketGateway,
        {
          provide: JwtService,
          useValue: mockNotificationService,
        },
        {
          provide: KisWebSocketService,
          useValue: mockKisWebSocketService,
        },
        {
          provide: RealtimeDataService,
          useValue: mockRealtimeDataService,
        },
      ],
    }).compile();

    gateway = module.get<TradingWebSocketGateway>(TradingWebSocketGateway);
    jwtService = module.get(JwtService);
    kisWebSocketService = module.get(KisWebSocketService);
    realtimeDataService = module.get(RealtimeDataService);

    // WebSocket 서버 설정
    gateway.server = mockServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('afterInit', () => {
    it('should initialize gateway and setup KIS WebSocket listeners', () => {
      const setupSpy = jest.spyOn(gateway as any, 'setupKisWebSocketListeners');
      
      gateway.afterInit(mockServer);

      expect(setupSpy).toHaveBeenCalled();
    });
  });

  describe('handleConnection', () => {
    it('should handle successful client connection with JWT token', async () => {
      jwtService.verify.mockReturnValue(mockJwtPayload);
      kisWebSocketService.isWebSocketConnected.mockReturnValue(true);

      await gateway.handleConnection(mockSocket);

      expect(jwtService.verify).toHaveBeenCalledWith('test-jwt-token');
      expect(mockSocket.data.userId).toBe('test-user-id');
      expect(mockSocket.emit).toHaveBeenCalledWith('connected', {
        message: 'WebSocket 연결 성공',
        userId: 'test-user-id',
        timestamp: expect.any(String),
      });
      expect(mockSocket.emit).toHaveBeenCalledWith('kisConnectionStatus', {
        connected: true,
        timestamp: expect.any(String),
      });
    });

    it('should handle connection with token in headers', async () => {
      const socketWithHeaderToken = {
        ...mockSocket,
        handshake: {
          auth: {},
          headers: { authorization: 'Bearer header-jwt-token' }
        }
      };

      jwtService.verify.mockReturnValue(mockJwtPayload);
      kisWebSocketService.isWebSocketConnected.mockReturnValue(true);

      await gateway.handleConnection(socketWithHeaderToken);

      expect(jwtService.verify).toHaveBeenCalledWith('header-jwt-token');
    });

    it('should disconnect client when no token provided', async () => {
      const socketWithoutToken = {
        ...mockSocket,
        handshake: {
          auth: {},
          headers: {}
        }
      };

      await gateway.handleConnection(socketWithoutToken);

      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should disconnect client when JWT verification fails', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await gateway.handleConnection(mockSocket);

      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should store client information correctly', async () => {
      jwtService.verify.mockReturnValue(mockJwtPayload);
      kisWebSocketService.isWebSocketConnected.mockReturnValue(true);

      await gateway.handleConnection(mockSocket);

      expect(gateway['connectedClients'].get('test-user-id')).toBe(mockSocket);
      expect(gateway['clientSubscriptions'].get('test-user-id')).toBeDefined();
    });
  });

  describe('handleDisconnect', () => {
    it('should handle client disconnection correctly', () => {
      // 먼저 클라이언트를 연결 상태로 설정
      gateway['connectedClients'].set('test-user-id', mockSocket);
      gateway['clientSubscriptions'].set('test-user-id', new Set(['stock-tsla']));

      mockSocket.data.userId = 'test-user-id';

      gateway.handleDisconnect(mockSocket);

      expect(gateway['connectedClients'].has('test-user-id')).toBe(false);
      expect(gateway['clientSubscriptions'].has('test-user-id')).toBe(false);
    });

    it('should handle disconnection without userId', () => {
      mockSocket.data.userId = undefined;

      expect(() => gateway.handleDisconnect(mockSocket)).not.toThrow();
    });
  });

  describe('subscribeToStock', () => {
    it('should subscribe client to stock updates', async () => {
      const mockData = { symbol: 'TSLA', price: 250.0 };
      mockSocket.data.userId = 'test-user-id';
      
      realtimeDataService.getStockData.mockResolvedValue(mockData);
      kisWebSocketService.subscribeToStock.mockResolvedValue(true);

      await gateway.subscribeToStock(mockSocket, { symbol: 'TSLA' });

      expect(realtimeDataService.getStockData).toHaveBeenCalledWith('TSLA');
      expect(kisWebSocketService.subscribeToStock).toHaveBeenCalledWith('TSLA');
      expect(mockSocket.emit).toHaveBeenCalledWith('stockData', mockData);
      expect(mockSocket.join).toHaveBeenCalledWith('stock-tsla');
    });

    it('should handle subscription errors', async () => {
      mockSocket.data.userId = 'test-user-id';
      
      realtimeDataService.getStockData.mockRejectedValue(new Error('Stock data error'));

      await gateway.subscribeToStock(mockSocket, { symbol: 'TSLA' });

      expect(mockSocket.emit).toHaveBeenCalledWith('error', {
        message: '주식 구독 실패',
        error: 'Stock data error'
      });
    });
  });

  describe('unsubscribeFromStock', () => {
    it('should unsubscribe client from stock updates', async () => {
      mockSocket.data.userId = 'test-user-id';
      
      kisWebSocketService.unsubscribeFromStock.mockResolvedValue(true);

      await gateway.unsubscribeFromStock(mockSocket, { symbol: 'TSLA' });

      expect(kisWebSocketService.unsubscribeFromStock).toHaveBeenCalledWith('TSLA');
      expect(mockSocket.leave).toHaveBeenCalledWith('stock-tsla');
      expect(mockSocket.emit).toHaveBeenCalledWith('unsubscribed', {
        message: '주식 구독 해제 완료',
        symbol: 'TSLA'
      });
    });

    it('should handle unsubscription errors', async () => {
      mockSocket.data.userId = 'test-user-id';
      
      kisWebSocketService.unsubscribeFromStock.mockRejectedValue(new Error('Unsubscribe error'));

      await gateway.unsubscribeFromStock(mockSocket, { symbol: 'TSLA' });

      expect(mockSocket.emit).toHaveBeenCalledWith('error', {
        message: '주식 구독 해제 실패',
        error: 'Unsubscribe error'
      });
    });
  });

  describe('getPortfolioData', () => {
    it('should return portfolio data for client', async () => {
      const mockPortfolio = {
        totalValue: 10000,
        holdings: [
          { symbol: 'TSLA', quantity: 10, value: 5000 }
        ]
      };

      mockSocket.data.userId = 'test-user-id';
      realtimeDataService.getPortfolioData.mockResolvedValue(mockPortfolio);

      await gateway.getPortfolioData(mockSocket);

      expect(realtimeDataService.getPortfolioData).toHaveBeenCalledWith('test-user-id');
      expect(mockSocket.emit).toHaveBeenCalledWith('portfolioData', mockPortfolio);
    });

    it('should handle portfolio data retrieval errors', async () => {
      mockSocket.data.userId = 'test-user-id';
      realtimeDataService.getPortfolioData.mockRejectedValue(new Error('Portfolio error'));

      await gateway.getPortfolioData(mockSocket);

      expect(mockSocket.emit).toHaveBeenCalledWith('error', {
        message: '포트폴리오 데이터 조회 실패',
        error: 'Portfolio error'
      });
    });
  });

  describe('getTradingSignals', () => {
    it('should return trading signals for client', async () => {
      const mockSignals = [
        { id: 1, symbol: 'TSLA', type: 'BUY', confidence: 0.8 }
      ];

      mockSocket.data.userId = 'test-user-id';
      realtimeDataService.getTradingSignals.mockResolvedValue(mockSignals);

      await gateway.getTradingSignals(mockSocket);

      expect(realtimeDataService.getTradingSignals).toHaveBeenCalledWith('test-user-id');
      expect(mockSocket.emit).toHaveBeenCalledWith('tradingSignals', mockSignals);
    });

    it('should handle trading signals retrieval errors', async () => {
      mockSocket.data.userId = 'test-user-id';
      realtimeDataService.getTradingSignals.mockRejectedValue(new Error('Signals error'));

      await gateway.getTradingSignals(mockSocket);

      expect(mockSocket.emit).toHaveBeenCalledWith('error', {
        message: '거래 신호 조회 실패',
        error: 'Signals error'
      });
    });
  });

  describe('sendOrder', () => {
    it('should send order through KIS WebSocket service', async () => {
      const mockOrder = {
        symbol: 'TSLA',
        type: 'BUY',
        quantity: 10,
        price: 250.0
      };

      const mockOrderResult = {
        orderId: 'order-123',
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      mockSocket.data.userId = 'test-user-id';
      kisWebSocketService.sendOrder.mockResolvedValue(mockOrderResult);

      await gateway.sendOrder(mockSocket, mockOrder);

      expect(kisWebSocketService.sendOrder).toHaveBeenCalledWith(mockOrder);
      expect(mockSocket.emit).toHaveBeenCalledWith('orderResult', mockOrderResult);
    });

    it('should handle order sending errors', async () => {
      const mockOrder = {
        symbol: 'TSLA',
        type: 'BUY',
        quantity: 10,
        price: 250.0
      };

      mockSocket.data.userId = 'test-user-id';
      kisWebSocketService.sendOrder.mockRejectedValue(new Error('Order error'));

      await gateway.sendOrder(mockSocket, mockOrder);

      expect(mockSocket.emit).toHaveBeenCalledWith('error', {
        message: '주문 전송 실패',
        error: 'Order error'
      });
    });
  });

  describe('getConnectionStatus', () => {
    it('should return KIS WebSocket connection status', async () => {
      const mockStatus = {
        connected: true,
        lastConnected: new Date().toISOString(),
        reconnectAttempts: 0
      };

      mockSocket.data.userId = 'test-user-id';
      kisWebSocketService.getConnectionStatus.mockReturnValue(mockStatus);

      await gateway.getConnectionStatus(mockSocket);

      expect(kisWebSocketService.getConnectionStatus).toHaveBeenCalled();
      expect(mockSocket.emit).toHaveBeenCalledWith('connectionStatus', mockStatus);
    });
  });

  describe('broadcastToSubscribers', () => {
    it('should broadcast message to all subscribers of a room', () => {
      const room = 'stock-tsla';
      const event = 'priceUpdate';
      const data = { symbol: 'TSLA', price: 250.0 };

      gateway.broadcastToSubscribers(room, event, data);

      expect(mockServer.to).toHaveBeenCalledWith(room);
      expect(mockServer.emit).toHaveBeenCalledWith(event, data);
    });
  });

  describe('getConnectedClientsCount', () => {
    it('should return correct count of connected clients', () => {
      gateway['connectedClients'].set('user1', mockSocket);
      gateway['connectedClients'].set('user2', mockSocket);

      const count = gateway.getConnectedClientsCount();

      expect(count).toBe(2);
    });
  });

  describe('getClientSubscriptions', () => {
    it('should return client subscriptions', () => {
      const userId = 'test-user-id';
      const subscriptions = new Set(['stock-tsla', 'stock-aapl']);
      
      gateway['clientSubscriptions'].set(userId, subscriptions);

      const result = gateway.getClientSubscriptions(userId);

      expect(result).toEqual(subscriptions);
    });

    it('should return empty set for non-existent user', () => {
      const result = gateway.getClientSubscriptions('non-existent-user');

      expect(result).toEqual(new Set());
    });
  });
});

