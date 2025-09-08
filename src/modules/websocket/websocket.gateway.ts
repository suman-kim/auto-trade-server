import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
//import { KisWebSocketService } from '../../infrastructure/external/kis-websocket.service';
import { EventEmitterType } from '../../shared/types/common-type';

/**
 * WebSocket Gateway
 * Next.js 프론트엔드와의 실시간 통신을 담당
 */
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/trading',
})
export class TradingWebSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebSocketGateway.name);
  private connectedClients = new Map<string, Socket>();
  private clientSubscriptions = new Map<string, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    //private readonly kisWebSocketService: KisWebSocketService,
  ) {}

  /**
   * Gateway 초기화
   */
  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway 초기화 완료');
    
    // 한국투자증권 WebSocket 이벤트 리스너 설정
    //this.setupKisWebSocketListeners();
  }

  /**
   * 클라이언트 연결 처리
   */
  async handleConnection(client: Socket) {
    try {
      // JWT 토큰 검증
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        this.logger.warn('토큰이 없는 클라이언트 연결 시도');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // 클라이언트 정보 저장
      this.connectedClients.set(userId, client);
      this.clientSubscriptions.set(userId, new Set());

      // 클라이언트에 사용자 ID 할당
      client.data.userId = userId;

      this.logger.log(`클라이언트 연결: ${userId} (${client.id})`);

      // 연결 성공 메시지 전송
      client.emit('connected', {
        message: 'WebSocket 연결 성공',
        userId,
        timestamp: new Date().toISOString(),
      });

      // 한국투자증권 WebSocket 연결 상태 전송
      // client.emit('kisConnectionStatus', {
      //   connected: this.kisWebSocketService.isWebSocketConnected(),
      //   timestamp: new Date().toISOString(),
      // });

    } catch (error) {
      this.logger.error('클라이언트 연결 처리 오류:', error);
      client.disconnect();
    }
  }

  /**
   * 클라이언트 연결 해제 처리
   */
  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    
    if (userId) {
      this.connectedClients.delete(userId);
      this.clientSubscriptions.delete(userId);
      this.logger.log(`클라이언트 연결 해제: ${userId} (${client.id})`);
    }
  }

  /**
   * 한국투자증권 WebSocket 이벤트 리스너 설정
   */
  // private setupKisWebSocketListeners(): void {
  //   // 연결 상태 변경 이벤트
  //   this.kisWebSocketService.on(EventEmitterType.CONNECT, () => {
  //     this.broadcastToAll(EventEmitterType.CONNECT, {
  //       connected: true,
  //       timestamp: new Date().toISOString(),
  //     });
  //   });

  //   this.kisWebSocketService.on(EventEmitterType.DISCONNECT, () => {
  //     this.broadcastToAll(EventEmitterType.DISCONNECT, {
  //       connected: false,
  //       timestamp: new Date().toISOString(),
  //     });
  //   });

  //   // 실시간 주식 데이터 이벤트
  //   this.kisWebSocketService.on(EventEmitterType.TRADE, (data) => {
  //     this.broadcastToSubscribers(EventEmitterType.TRADE, data);
  //   });

  //   this.kisWebSocketService.on(EventEmitterType.ORDERBOOK, (data) => {
  //     this.broadcastToSubscribers(EventEmitterType.ORDERBOOK, data);
     
  //   });

  //   this.kisWebSocketService.on(EventEmitterType.ORDER_EXECUTION, (data) => {
  //     this.broadcastToSubscribers(EventEmitterType.ORDER_EXECUTION, data);

  //   });

  //   this.kisWebSocketService.on(EventEmitterType.BALANCE, (data) => {
  //     this.broadcastToSubscribers(EventEmitterType.BALANCE, data);
  //   });

  //   // 에러 이벤트
  //   this.kisWebSocketService.on(EventEmitterType.ERROR, (error) => {
  //     this.logger.error('한국투자증권 WebSocket 에러:', error);
  //     this.broadcastToAll(EventEmitterType.ERROR, {
  //       message: '한국투자증권 연결 오류',
  //       timestamp: new Date().toISOString(),
  //     });
  //   });
  // }

  /**
   * 실시간 주식 데이터 구독
   */
  @SubscribeMessage('subscribeTrade')
  handleSubscribeTrade(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { symbol: string },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    const subscriptions = this.clientSubscriptions.get(userId) || new Set();
    subscriptions.add(`trade:${data.symbol}`);
    this.clientSubscriptions.set(userId, subscriptions);

    this.logger.log(`사용자 ${userId}가 ${data.symbol} 체결 데이터 구독`);
    
    client.emit('subscribed', {
      channel: 'trade',
      symbol: data.symbol,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 실시간 호가 데이터 구독
   */
  @SubscribeMessage('subscribeOrderBook')
  handleSubscribeOrderBook(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { symbol: string },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    const subscriptions = this.clientSubscriptions.get(userId) || new Set();
    subscriptions.add(`orderbook:${data.symbol}`);
    this.clientSubscriptions.set(userId, subscriptions);

    this.logger.log(`사용자 ${userId}가 ${data.symbol} 호가 데이터 구독`);
    
    client.emit('subscribed', {
      channel: 'orderbook',
      symbol: data.symbol,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 실시간 주문 체결 데이터 구독
   */
  @SubscribeMessage('subscribeOrderExecution')
  handleSubscribeOrderExecution(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (!userId) return;

    const subscriptions = this.clientSubscriptions.get(userId) || new Set();
    subscriptions.add('orderExecution');
    this.clientSubscriptions.set(userId, subscriptions);

    this.logger.log(`사용자 ${userId}가 주문 체결 데이터 구독`);
    
    client.emit('subscribed', {
      channel: 'orderExecution',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 실시간 잔고 데이터 구독
   */
  @SubscribeMessage('subscribeBalance')
  handleSubscribeBalance(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (!userId) return;

    const subscriptions = this.clientSubscriptions.get(userId) || new Set();
    subscriptions.add('balance');
    this.clientSubscriptions.set(userId, subscriptions);

    this.logger.log(`사용자 ${userId}가 잔고 데이터 구독`);
    
    client.emit('subscribed', {
      channel: 'balance',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 구독 해제
   */
  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channel: string; symbol?: string },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    const subscriptions = this.clientSubscriptions.get(userId);
    if (subscriptions) {
      const subscriptionKey = data.symbol ? `${data.channel}:${data.symbol}` : data.channel;
      subscriptions.delete(subscriptionKey);
      
      this.logger.log(`사용자 ${userId}가 ${subscriptionKey} 구독 해제`);
      
      client.emit('unsubscribed', {
        channel: data.channel,
        symbol: data.symbol,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * 주문 전송
   */
  @SubscribeMessage('sendOrder')
  handleSendOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody() order: any,
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    try {
      // const success = this.kisWebSocketService.sendOrder({
      //   ...order,
      //   userId,
      //   timestamp: new Date().toISOString(),
      // });

      // if (success) {
      //   client.emit('orderSent', {
      //     orderId: order.orderId,
      //     message: '주문이 성공적으로 전송되었습니다.',
      //     timestamp: new Date().toISOString(),
      //   });
      // } else {
      //   client.emit('orderError', {
      //     message: '주문 전송에 실패했습니다.',
      //     timestamp: new Date().toISOString(),
      //   });
      // }
    } catch (error) {
      this.logger.error('주문 전송 오류:', error);
      client.emit('orderError', {
        message: '주문 전송 중 오류가 발생했습니다.',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * 주문 취소
   */
  @SubscribeMessage('cancelOrder')
  handleCancelOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    try {
      //const success = this.kisWebSocketService.cancelOrder(data.orderId);

      // if (success) {
      //   client.emit('orderCancelled', {
      //     orderId: data.orderId,
      //     message: '주문이 성공적으로 취소되었습니다.',
      //     timestamp: new Date().toISOString(),
      //   });
      // } else {
      //   client.emit('orderError', {
      //     message: '주문 취소에 실패했습니다.',
      //     timestamp: new Date().toISOString(),
      //   });
      // }
    } catch (error) {
      this.logger.error('주문 취소 오류:', error);
      client.emit('orderError', {
        message: '주문 취소 중 오류가 발생했습니다.',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * 핑/퐁 메시지 처리
   */
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', {
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 구독자들에게 메시지 브로드캐스트
   */
  private broadcastToSubscribers(event: string, data: any): void {
    const subscriptionKey = this.getSubscriptionKey(event, data);
    
    this.clientSubscriptions.forEach((subscriptions, userId) => {
      if (subscriptions.has(subscriptionKey)) {
        const client = this.connectedClients.get(userId);
        if (client) {
          client.emit(event, data);
        }
      }
    });
  }

  /**
   * 모든 클라이언트에게 메시지 브로드캐스트
   */
  private broadcastToAll(event: string, data: any): void {
    this.server.emit(event, data);
  }

  /**
   * 구독 키 생성
   */
  private getSubscriptionKey(event: string, data: any): string {
    switch (event) {
      case 'trade':
      case 'orderbook':
        return `${event}:${data.symbol}`;
      case 'orderExecution':
      case 'balance':
        return event;
      default:
        return event;
    }
  }

  /**
   * 특정 사용자에게 메시지 전송
   */
  sendToUser(userId: string, event: string, data: any): void {
    const client = this.connectedClients.get(userId);
    if (client) {
      client.emit(event, data);
      this.logger.debug(`사용자 ${userId}에게 ${event} 이벤트 전송`);
    } else {
      this.logger.debug(`사용자 ${userId}가 연결되어 있지 않음`);
    }
  }

  /**
   * 알림 전송
   */
  sendNotification(userId: string, notification: any): void {
    this.sendToUser(userId, 'notification', {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      createdAt: notification.createdAt,
      isRead: notification.isRead,
    });
  }

  /**
   * 실시간 알림 브로드캐스트
   */
  broadcastNotification(userIds: string[], notification: any): void {
    userIds.forEach(userId => {
      this.sendNotification(userId, notification);
    });
  }

  /**
   * 연결된 클라이언트 수 반환
   */
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  /**
   * 사용자 구독 정보 반환
   */
  getUserSubscriptions(userId: string): string[] {
    const subscriptions = this.clientSubscriptions.get(userId);
    return subscriptions ? Array.from(subscriptions) : [];
  }
} 