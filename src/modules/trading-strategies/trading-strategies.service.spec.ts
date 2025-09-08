import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TradingStrategiesService } from './trading-strategies.service';
import { TradingStrategy, StrategyStatus, SignalType, StrategyType } from '../../domain/entities/trading-strategy.entity';
import { TradingSignal } from '../../domain/entities/trading-signal.entity';
import { BacktestResult } from '../../domain/entities/backtest-result.entity';
import { Stock } from '../../domain/entities/stock.entity';
import { User } from '../../domain/entities/user.entity';
import { 
  CreateTradingStrategyDto, 
  UpdateTradingStrategyDto, 
  BacktestRequestDto
} from '../../application/dtos/trading-strategy.dto';

describe('TradingStrategiesService', () => {
  let service: TradingStrategiesService;
  let tradingStrategyRepository: Repository<TradingStrategy>;
  let tradingSignalRepository: Repository<TradingSignal>;
  let backtestResultRepository: Repository<BacktestResult>;
  let stockRepository: Repository<Stock>;
  let userRepository: Repository<User>;

  const mockTradingStrategyRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockTradingSignalRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockBacktestResultRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockStockRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    passwordHash: 'hashedPassword',
    firstName: '홍',
    lastName: '길동',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    notifications: [],
    portfolios: [],
    transactions: [],
    tradingStrategies: [],
    notificationSettings: [],
    priceAlerts: [],
    get fullName() { return `${this.firstName} ${this.lastName}`.trim(); },
    isUserActive() { return this.isActive; }
  };

  const mockStock: Stock = {
    id: 1,
    symbol: 'TSLA',
    companyName: 'Tesla Inc.',
    name: 'Tesla',
    sector: 'Technology',
    industry: 'Electric Vehicles',
    exchange: 'NASDAQ',
    currency: 'USD',
    currentPrice: 250.0,
    previousClose: 245.0,
    high: 255.0,
    low: 240.0,
    volume: 15000000,
    marketCap: 800000000000,
    peRatio: 25.5,
    dividendYield: 0.0,
    lastUpdated: new Date(),
    portfolioHoldings: [],
    transactions: [],
    tradingSignals: [],
    priceAlerts: [],
    get priceChange() { return this.currentPrice && this.previousClose ? ((this.currentPrice - this.previousClose) / this.previousClose) * 100 : 0; },
    get priceChangeDirection() { return this.currentPrice > this.previousClose ? 'up' : this.currentPrice < this.previousClose ? 'down' : 'unchanged'; },
    isActive() { return this.currentPrice !== null && this.currentPrice > 0; }
  };

  const mockTradingStrategy: TradingStrategy = {
    id: 1,
    name: '테스트 전략',
    description: '테스트용 거래 전략',
    type: StrategyType.CUSTOM,
    userId: 1,
    status: StrategyStatus.INACTIVE,
    conditions: {
      indicators: {
        rsi: { period: 14, oversold: 30, overbought: 70 },
        movingAverage: { shortPeriod: 5, longPeriod: 20, type: 'sma' }
      },
      priceConditions: { minPrice: 200, maxPrice: 300 }
    },
    autoTrading: {
      enabled: false,
      maxPositionSize: 1000,
      stopLoss: 5.0,
      takeProfit: 10.0,
      maxDailyTrades: 10,
      riskPerTrade: 2.0
    },
    lastExecutedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
    signals: [],
    backtestResults: [],
  };

  const mockTradingSignal: TradingSignal = {
    id: 1,
    strategyId: 1,
    stockId: 1,
    signalType: SignalType.BUY,
    price: 250.0,
    volume: 15000000,
    confidence: 75.0,
    executed: false,
    indicators: {},
    executedAt: null,
    createdAt: new Date(),
    strategy: mockTradingStrategy,
    stock: mockStock,
  };

  const mockBacktestResult: BacktestResult = {
    id: 1,
    strategyId: 1,
    name: '백테스트 결과',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    initialCapital: 10000,
    finalCapital: 11000,
    totalReturn: 10.0,
    annualizedReturn: 12.0,
    maxDrawdown: -5.0,
    sharpeRatio: 1.2,
    totalTrades: 10,
    winningTrades: 6,
    losingTrades: 4,
    winRate: 60.0,
    averageWin: 3.0,
    averageLoss: -2.0,
    profitFactor: 1.5,
    createdAt: new Date(),
    strategy: mockTradingStrategy,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradingStrategiesService,
        {
          provide: getRepositoryToken(TradingStrategy),
          useValue: mockTradingStrategyRepository,
        },
        {
          provide: getRepositoryToken(TradingSignal),
          useValue: mockTradingSignalRepository,
        },
        {
          provide: getRepositoryToken(BacktestResult),
          useValue: mockBacktestResultRepository,
        },
        {
          provide: getRepositoryToken(Stock),
          useValue: mockStockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<TradingStrategiesService>(TradingStrategiesService);
    tradingStrategyRepository = module.get<Repository<TradingStrategy>>(getRepositoryToken(TradingStrategy));
    tradingSignalRepository = module.get<Repository<TradingSignal>>(getRepositoryToken(TradingSignal));
    backtestResultRepository = module.get<Repository<BacktestResult>>(getRepositoryToken(BacktestResult));
    stockRepository = module.get<Repository<Stock>>(getRepositoryToken(Stock));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createStrategy', () => {
    it('should create a new trading strategy successfully', async () => {
      // Arrange
      const userId = 1;
      const createStrategyDto: CreateTradingStrategyDto = {
        name: '새 전략',
        description: '새로운 거래 전략',
        type: StrategyType.CUSTOM,
        conditions: mockTradingStrategy.conditions,
        autoTrading: mockTradingStrategy.autoTrading,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockTradingStrategyRepository.create.mockReturnValue(mockTradingStrategy);
      mockTradingStrategyRepository.save.mockResolvedValue(mockTradingStrategy);

      // Act
      const result = await service.createStrategy(userId, createStrategyDto);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockTradingStrategyRepository.create).toHaveBeenCalledWith({
        ...createStrategyDto,
        userId,
        status: StrategyStatus.INACTIVE,
      });
      expect(mockTradingStrategyRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockTradingStrategy);
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      const userId = 999;
      const createStrategyDto: CreateTradingStrategyDto = {
        name: '새 전략',
        description: '새로운 거래 전략',
        type: StrategyType.CUSTOM,
        conditions: {},
        autoTrading: { 
          enabled: false, 
          maxPositionSize: 1000,
          stopLoss: 5.0,
          takeProfit: 10.0,
          maxDailyTrades: 10,
          riskPerTrade: 2.0
        },
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.createStrategy(userId, createStrategyDto)).rejects.toThrow(
        new NotFoundException('사용자를 찾을 수 없습니다.'),
      );
    });
  });

  describe('getUserStrategies', () => {
    it('should return user strategies successfully', async () => {
      // Arrange
      const userId = 1;
      const strategies = [mockTradingStrategy];
      mockTradingStrategyRepository.find.mockResolvedValue(strategies);

      // Act
      const result = await service.getUserStrategies(userId);

      // Assert
      expect(mockTradingStrategyRepository.find).toHaveBeenCalledWith({
        where: { userId },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(strategies);
    });
  });

  describe('getStrategy', () => {
    it('should return strategy successfully', async () => {
      // Arrange
      const userId = 1;
      const strategyId = 1;
      mockTradingStrategyRepository.findOne.mockResolvedValue(mockTradingStrategy);

      // Act
      const result = await service.getStrategy(userId, strategyId);

      // Assert
      expect(mockTradingStrategyRepository.findOne).toHaveBeenCalledWith({
        where: { id: strategyId, userId },
        relations: ['user'],
      });
      expect(result).toEqual(mockTradingStrategy);
    });

    it('should throw NotFoundException when strategy not found', async () => {
      // Arrange
      const userId = 1;
      const strategyId = 999;
      mockTradingStrategyRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getStrategy(userId, strategyId)).rejects.toThrow(
        new NotFoundException('거래 전략을 찾을 수 없습니다.'),
      );
    });
  });

  describe('updateStrategy', () => {
    it('should update strategy successfully', async () => {
      // Arrange
      const userId = 1;
      const strategyId = 1;
      const updateStrategyDto: UpdateTradingStrategyDto = {
        name: '업데이트된 전략',
        description: '업데이트된 설명',
      };

      jest.spyOn(service, 'getStrategy').mockResolvedValue(mockTradingStrategy);
      mockTradingStrategyRepository.save.mockResolvedValue({
        ...mockTradingStrategy,
        ...updateStrategyDto,
      });

      // Act
      const result = await service.updateStrategy(userId, strategyId, updateStrategyDto);

      // Assert
      expect(service.getStrategy).toHaveBeenCalledWith(userId, strategyId);
      expect(mockTradingStrategyRepository.save).toHaveBeenCalled();
      expect(result.name).toBe(updateStrategyDto.name);
    });
  });

  describe('deleteStrategy', () => {
    it('should delete strategy successfully', async () => {
      // Arrange
      const userId = 1;
      const strategyId = 1;

      jest.spyOn(service, 'getStrategy').mockResolvedValue(mockTradingStrategy);
      mockTradingStrategyRepository.remove.mockResolvedValue(mockTradingStrategy);

      // Act
      await service.deleteStrategy(userId, strategyId);

      // Assert
      expect(service.getStrategy).toHaveBeenCalledWith(userId, strategyId);
      expect(mockTradingStrategyRepository.remove).toHaveBeenCalledWith(mockTradingStrategy);
    });
  });

  describe('toggleStrategy', () => {
    it('should activate inactive strategy', async () => {
      // Arrange
      const userId = 1;
      const strategyId = 1;
      const inactiveStrategy = { ...mockTradingStrategy, status: StrategyStatus.INACTIVE };
      const activeStrategy = { ...mockTradingStrategy, status: StrategyStatus.ACTIVE };

      jest.spyOn(service, 'getStrategy')
        .mockResolvedValueOnce(inactiveStrategy)
        .mockResolvedValueOnce(activeStrategy);
      
      mockTradingStrategyRepository.update.mockResolvedValue({ affected: 1 });

      // Act
      const result = await service.toggleStrategy(userId, strategyId);

      // Assert
      expect(mockTradingStrategyRepository.update).toHaveBeenCalledWith(
        { id: strategyId, userId },
        { status: StrategyStatus.ACTIVE },
      );
      expect(result.status).toBe(StrategyStatus.ACTIVE);
    });

    it('should deactivate active strategy', async () => {
      // Arrange
      const userId = 1;
      const strategyId = 1;
      const activeStrategy = { ...mockTradingStrategy, status: StrategyStatus.ACTIVE };
      const inactiveStrategy = { ...mockTradingStrategy, status: StrategyStatus.INACTIVE };

      jest.spyOn(service, 'getStrategy')
        .mockResolvedValueOnce(activeStrategy)
        .mockResolvedValueOnce(inactiveStrategy);
      
      mockTradingStrategyRepository.update.mockResolvedValue({ affected: 1 });

      // Act
      const result = await service.toggleStrategy(userId, strategyId);

      // Assert
      expect(mockTradingStrategyRepository.update).toHaveBeenCalledWith(
        { id: strategyId, userId },
        { status: StrategyStatus.INACTIVE },
      );
      expect(result.status).toBe(StrategyStatus.INACTIVE);
    });
  });

  describe('generateSignals', () => {
    it('should generate buy signal when conditions are met', async () => {
      // Arrange
      const strategyId = 1;
      mockTradingStrategyRepository.findOne.mockResolvedValue(mockTradingStrategy);
      mockStockRepository.findOne.mockResolvedValue(mockStock);
      mockTradingSignalRepository.create.mockReturnValue(mockTradingSignal);
      mockTradingSignalRepository.save.mockResolvedValue(mockTradingSignal);
      
      // Mock helper methods to return true for buy condition
      jest.spyOn(service as any, 'checkBuyCondition').mockReturnValue(true);
      jest.spyOn(service as any, 'checkSellCondition').mockReturnValue(false);
      jest.spyOn(service as any, 'calculateSignalStrength').mockReturnValue(75.0);

      // Act
      const result = await service.generateSignals(strategyId);

      // Assert
      expect(mockTradingStrategyRepository.findOne).toHaveBeenCalledWith({
        where: { id: strategyId },
        relations: ['user'],
      });
      expect(mockStockRepository.findOne).toHaveBeenCalledWith({
        where: { symbol: 'TSLA' },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockTradingSignal);
    });

    it('should throw NotFoundException when strategy not found', async () => {
      // Arrange
      const strategyId = 999;
      mockTradingStrategyRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.generateSignals(strategyId)).rejects.toThrow(
        new NotFoundException('거래 전략을 찾을 수 없습니다.'),
      );
    });

    it('should throw NotFoundException when stock not found', async () => {
      // Arrange
      const strategyId = 1;
      mockTradingStrategyRepository.findOne.mockResolvedValue(mockTradingStrategy);
      mockStockRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.generateSignals(strategyId)).rejects.toThrow(
        new NotFoundException('주식 데이터를 찾을 수 없습니다.'),
      );
    });
  });

  describe('backtestStrategy', () => {
    it('should perform backtest successfully', async () => {
      // Arrange
      const userId = 1;
      const strategyId = 1;
      const backtestDto: BacktestRequestDto = {
        name: '백테스트',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        initialCapital: 10000,
      };

      jest.spyOn(service, 'getStrategy').mockResolvedValue(mockTradingStrategy);
      mockBacktestResultRepository.create.mockReturnValue(mockBacktestResult);
      mockBacktestResultRepository.save.mockResolvedValue(mockBacktestResult);

      // Act
      const result = await service.backtestStrategy(userId, strategyId, backtestDto);

      // Assert
      expect(service.getStrategy).toHaveBeenCalledWith(userId, strategyId);
      expect(mockBacktestResultRepository.create).toHaveBeenCalled();
      expect(mockBacktestResultRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockBacktestResult);
    });
  });

  describe('getBacktestResults', () => {
    it('should return backtest results for user', async () => {
      // Arrange
      const userId = 1;
      const results = [mockBacktestResult];
      mockBacktestResultRepository.find.mockResolvedValue(results);

      // Act
      const result = await service.getBacktestResults(userId);

      // Assert
      expect(mockBacktestResultRepository.find).toHaveBeenCalledWith({
        where: { strategy: { userId } },
        relations: ['strategy'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(results);
    });

    it('should return backtest results for specific strategy', async () => {
      // Arrange
      const userId = 1;
      const strategyId = 1;
      const results = [mockBacktestResult];
      mockBacktestResultRepository.find.mockResolvedValue(results);

      // Act
      const result = await service.getBacktestResults(userId, strategyId);

      // Assert
      expect(mockBacktestResultRepository.find).toHaveBeenCalledWith({
        where: { strategy: { userId }, strategyId },
        relations: ['strategy'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(results);
    });
  });

  describe('executeAutoTrading', () => {
    it('should throw BadRequestException when strategy not found or inactive', async () => {
      // Arrange
      const strategyId = 1;
      mockTradingStrategyRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.executeAutoTrading(strategyId)).rejects.toThrow(
        new BadRequestException('활성화된 거래 전략을 찾을 수 없습니다.'),
      );
    });

    it('should execute auto trading when strategy is active', async () => {
      // Arrange
      const strategyId = 1;
      const activeStrategy = { ...mockTradingStrategy, status: StrategyStatus.ACTIVE };
      
      mockTradingStrategyRepository.findOne.mockResolvedValue(activeStrategy);
      jest.spyOn(service, 'generateSignals').mockResolvedValue([]);

      // Act
      await service.executeAutoTrading(strategyId);

      // Assert
      expect(mockTradingStrategyRepository.findOne).toHaveBeenCalledWith({
        where: { id: strategyId, status: StrategyStatus.ACTIVE },
      });
      expect(service.generateSignals).toHaveBeenCalledWith(strategyId);
    });
  });

  describe('getStrategySignals', () => {
    it('should return strategy signals successfully', async () => {
      // Arrange
      const userId = 1;
      const strategyId = 1;
      const signals = [mockTradingSignal];

      jest.spyOn(service, 'getStrategy').mockResolvedValue(mockTradingStrategy);
      mockTradingSignalRepository.find.mockResolvedValue(signals);

      // Act
      const result = await service.getStrategySignals(userId, strategyId);

      // Assert
      expect(service.getStrategy).toHaveBeenCalledWith(userId, strategyId);
      expect(mockTradingSignalRepository.find).toHaveBeenCalledWith({
        where: { strategyId },
        order: { createdAt: 'DESC' },
        take: 100,
      });
      expect(result).toEqual(signals);
    });
  });
});
