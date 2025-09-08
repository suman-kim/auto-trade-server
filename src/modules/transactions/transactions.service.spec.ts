import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { TransactionsService } from './transactions.service';
import { Transaction, TransactionType, TransactionStatus } from '../../domain/entities/transaction.entity';
import { User } from '../../domain/entities/user.entity';
import { Portfolio } from '../../domain/entities/portfolio.entity';
import { Stock } from '../../domain/entities/stock.entity';
import { 
  CreateTransactionDto, 
  UpdateTransactionDto, 
  TransactionFilterDto 
} from '../../application/dtos/transaction.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionRepository: Repository<Transaction>;
  let userRepository: Repository<User>;
  let portfolioRepository: Repository<Portfolio>;
  let stockRepository: Repository<Stock>;

  // 테스트 데이터 모킹
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  } as User;

  const mockPortfolio = {
    id: 1,
    userId: 1,
    name: 'Test Portfolio',
    description: 'Test portfolio description',
    totalValue: 10000,
    cashBalance: 5000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
    holdings: [],
    transactions: [],
    returns: [],
    totalInvested: 5000,
    totalReturn: 500,
    isProfitable: () => true,
  } as unknown as Portfolio;

  const mockStock = {
    id: 1,
    symbol: 'AAPL',
    name: 'Apple Inc.',
    companyName: 'Apple Inc.',
    currentPrice: 150.0,
    market: 'NASDAQ',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    exchange: 'NASDAQ',
    currency: 'USD',
    marketCap: 3000000000000,
    peRatio: 25.0,
    dividendYield: 0.5,
    volume: 50000000,
    averageVolume: 45000000,
    high52Week: 200.0,
    low52Week: 120.0,
    previousClose: 148.0,
    changePercent: 1.35,
    lastUpdated: new Date(),
    isActive: () => true,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactions: [],
    portfolioHoldings: [],
    tradingSignals: [],
    priceAlerts: [],
    high: 155.0,
    low: 145.0,
    priceChange: 2.0,
    priceChangeDirection: 'up',
  } as unknown as Stock;

  const mockTransaction = {
    id: 1,
    userId: 1,
    portfolioId: 1,
    stockId: 1,
    transactionType: TransactionType.BUY,
    quantity: 10,
    pricePerShare: 150.0,
    totalAmount: 1500.0,
    fees: 5.0,
    status: TransactionStatus.COMPLETED,
    transactionDate: new Date('2024-01-01'),
    notes: 'Test transaction',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
    portfolio: mockPortfolio,
    stock: mockStock,
    isBuy: () => true,
    isSell: () => false,
    profitLoss: 0,
    isCompleted: () => true,
    totalWithFees: () => 1505.0,
    isSuccessful: () => true,
  } as unknown as Transaction;

  // Repository 모킹
  const mockTransactionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockPortfolioRepository = {
    findOne: jest.fn(),
  };

  const mockStockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Portfolio),
          useValue: mockPortfolioRepository,
        },
        {
          provide: getRepositoryToken(Stock),
          useValue: mockStockRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionRepository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    portfolioRepository = module.get<Repository<Portfolio>>(getRepositoryToken(Portfolio));
    stockRepository = module.get<Repository<Stock>>(getRepositoryToken(Stock));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('서비스가 정의되어야 함', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    const createTransactionDto: CreateTransactionDto = {
      portfolioId: 1,
      stockSymbol: 'AAPL',
      transactionType: TransactionType.BUY,
      quantity: 10,
      pricePerShare: 150.0,
      fees: 5.0,
      notes: 'Test buy transaction',
    };

    it('새로운 거래를 성공적으로 생성해야 함', async () => {
      // Given
      mockPortfolioRepository.findOne.mockResolvedValue(mockPortfolio);
      mockStockRepository.findOne.mockResolvedValue(mockStock);
      mockTransactionRepository.create.mockReturnValue(mockTransaction);
      mockTransactionRepository.save.mockResolvedValue(mockTransaction);

      // When
      const result = await service.createTransaction(1, createTransactionDto);

      // Then
      expect(result).toHaveProperty('id');
      expect(result.stockSymbol).toBe('AAPL');
      expect(result.transactionType).toBe(TransactionType.BUY);
      expect(result.quantity).toBe(10);
      expect(result.pricePerShare).toBe(150.0);
      expect(mockPortfolioRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(mockTransactionRepository.save).toHaveBeenCalled();
    });

    it('존재하지 않는 포트폴리오에 대해 NotFoundException을 발생시켜야 함', async () => {
      // Given
      mockPortfolioRepository.findOne.mockResolvedValue(null);

      // When & Then
      await expect(service.createTransaction(1, createTransactionDto))
        .rejects.toThrow(NotFoundException);
      expect(mockPortfolioRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
    });

    it('존재하지 않는 주식의 경우 새로 생성해야 함', async () => {
      // Given
      mockPortfolioRepository.findOne.mockResolvedValue(mockPortfolio);
      mockStockRepository.findOne.mockResolvedValue(null);
      mockStockRepository.create.mockReturnValue(mockStock);
      mockStockRepository.save.mockResolvedValue(mockStock);
      mockTransactionRepository.create.mockReturnValue(mockTransaction);
      mockTransactionRepository.save.mockResolvedValue(mockTransaction);

      // When
      await service.createTransaction(1, createTransactionDto);

      // Then
      expect(mockStockRepository.create).toHaveBeenCalledWith({
        symbol: 'AAPL',
        name: 'AAPL',
        currentPrice: 150.0,
      });
      expect(mockStockRepository.save).toHaveBeenCalled();
    });

    it('총액과 수수료를 올바르게 계산해야 함', async () => {
      // Given
      mockPortfolioRepository.findOne.mockResolvedValue(mockPortfolio);
      mockStockRepository.findOne.mockResolvedValue(mockStock);
      
      const expectedTransaction = {
        ...mockTransaction,
        totalAmount: 1500.0, // 10 * 150.0
        fees: 5.0,
      };
      
      mockTransactionRepository.create.mockReturnValue(expectedTransaction);
      mockTransactionRepository.save.mockResolvedValue(expectedTransaction);

      // When
      const result = await service.createTransaction(1, createTransactionDto);

      // Then
      expect(result.totalAmount).toBe(1500.0);
      expect(result.totalWithFees).toBe(1505.0); // 1500 + 5
      expect(mockTransactionRepository.create).toHaveBeenCalledWith({
        userId: 1,
        portfolioId: 1,
        stockId: 1,
        transactionType: TransactionType.BUY,
        quantity: 10,
        pricePerShare: 150.0,
        totalAmount: 1500.0,
        fees: 5.0,
        notes: 'Test buy transaction',
        status: TransactionStatus.COMPLETED,
        transactionDate: expect.any(Date),
      });
    });
  });

  describe('getUserTransactions', () => {
    it('사용자의 모든 거래 내역을 조회해야 함', async () => {
      // Given
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockTransaction]),
      };
      
      mockTransactionRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      // When
      const result = await service.getUserTransactions(1);

      // Then
      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'transaction.userId = :userId', 
        { userId: 1 }
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'transaction.transactionDate', 
        'DESC'
      );
    });

    it('필터를 적용하여 거래 내역을 조회해야 함', async () => {
      // Given
      const filter: TransactionFilterDto = {
        transactionType: TransactionType.BUY,
        status: TransactionStatus.COMPLETED,
        stockSymbol: 'AAPL',
        portfolioId: 1,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockTransaction]),
      };
      
      mockTransactionRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      // When
      const result = await service.getUserTransactions(1, filter);

      // Then
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaction.transactionType = :transactionType',
        { transactionType: TransactionType.BUY }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaction.status = :status',
        { status: TransactionStatus.COMPLETED }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'stock.symbol ILIKE :stockSymbol',
        { stockSymbol: '%AAPL%' }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaction.portfolioId = :portfolioId',
        { portfolioId: 1 }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaction.transactionDate BETWEEN :startDate AND :endDate',
        { startDate: filter.startDate, endDate: filter.endDate }
      );
    });
  });

  describe('getTransaction', () => {
    it('특정 거래를 성공적으로 조회해야 함', async () => {
      // Given
      mockTransactionRepository.findOne.mockResolvedValue(mockTransaction);

      // When
      const result = await service.getTransaction(1, 1);

      // Then
      expect(result.id).toBe(1);
      expect(result.userId).toBe(1);
      expect(mockTransactionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
        relations: ['stock'],
      });
    });

    it('존재하지 않는 거래에 대해 NotFoundException을 발생시켜야 함', async () => {
      // Given
      mockTransactionRepository.findOne.mockResolvedValue(null);

      // When & Then
      await expect(service.getTransaction(1, 999))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTransaction', () => {
    const updateTransactionDto: UpdateTransactionDto = {
      fees: 15.0,
      notes: 'Updated transaction',
    };

    it('대기 중인 거래를 성공적으로 수정해야 함', async () => {
      // Given
      const pendingTransaction = {
        ...mockTransaction,
        status: TransactionStatus.PENDING,
      };
      
      mockTransactionRepository.findOne.mockResolvedValue(pendingTransaction);
      mockTransactionRepository.save.mockResolvedValue({
        ...pendingTransaction,
        ...updateTransactionDto,
      });

      // When
      const result = await service.updateTransaction(1, 1, updateTransactionDto);

      // Then
      expect(result.fees).toBe(15.0);
      expect(mockTransactionRepository.save).toHaveBeenCalled();
    });

    it('존재하지 않는 거래에 대해 NotFoundException을 발생시켜야 함', async () => {
      // Given
      mockTransactionRepository.findOne.mockResolvedValue(null);

      // When & Then
      await expect(service.updateTransaction(1, 999, updateTransactionDto))
        .rejects.toThrow(NotFoundException);
    });

    it('완료된 거래 수정 시 BadRequestException을 발생시켜야 함', async () => {
      // Given
      mockTransactionRepository.findOne.mockResolvedValue(mockTransaction);

      // When & Then
      await expect(service.updateTransaction(1, 1, updateTransactionDto))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteTransaction', () => {
    it('대기 중인 거래를 성공적으로 삭제해야 함', async () => {
      // Given
      const pendingTransaction = {
        ...mockTransaction,
        status: TransactionStatus.PENDING,
      };
      
      mockTransactionRepository.findOne.mockResolvedValue(pendingTransaction);
      mockTransactionRepository.remove.mockResolvedValue(pendingTransaction);

      // When
      await service.deleteTransaction(1, 1);

      // Then
      expect(mockTransactionRepository.remove).toHaveBeenCalledWith(pendingTransaction);
    });

    it('존재하지 않는 거래에 대해 NotFoundException을 발생시켜야 함', async () => {
      // Given
      mockTransactionRepository.findOne.mockResolvedValue(null);

      // When & Then
      await expect(service.deleteTransaction(1, 999))
        .rejects.toThrow(NotFoundException);
    });

    it('완료된 거래 삭제 시 BadRequestException을 발생시켜야 함', async () => {
      // Given
      mockTransactionRepository.findOne.mockResolvedValue(mockTransaction);

      // When & Then
      await expect(service.deleteTransaction(1, 1))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('getTransactionStats', () => {
    it('거래 통계를 성공적으로 계산해야 함', async () => {
      // Given
      const transactions = [
        { ...mockTransaction, transactionType: TransactionType.BUY, quantity: 10, totalAmount: 1500, fees: 5 },
        { ...mockTransaction, id: 2, transactionType: TransactionType.SELL, quantity: 5, totalAmount: 800, fees: 3 },
      ] as Transaction[];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(transactions),
      };
      
      mockTransactionRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      // When
      const result = await service.getTransactionStats(1);

      // Then
      expect(result.totalTransactions).toBe(2);
      expect(result.totalBuyTransactions).toBe(1);
      expect(result.totalSellTransactions).toBe(1);
      expect(result.totalVolume).toBe(15);
      expect(result.totalAmount).toBe(2300);
      expect(result.totalFees).toBe(8);
      expect(result.averageTransactionAmount).toBe(1150);
      expect(result.mostTradedStock).toBe('AAPL');
      expect(result.mostTradedStockVolume).toBe(15);
    });

    it('거래가 없을 때 기본값을 반환해야 함', async () => {
      // Given
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      
      mockTransactionRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      // When
      const result = await service.getTransactionStats(1);

      // Then
      expect(result.totalTransactions).toBe(0);
      expect(result.totalBuyTransactions).toBe(0);
      expect(result.totalSellTransactions).toBe(0);
      expect(result.totalVolume).toBe(0);
      expect(result.totalAmount).toBe(0);
      expect(result.totalFees).toBe(0);
      expect(result.averageTransactionAmount).toBe(0);
      expect(result.mostTradedStock).toBe('');
      expect(result.mostTradedStockVolume).toBe(0);
    });
  });

  describe('analyzeTransactions', () => {
    it('거래 분석을 성공적으로 수행해야 함', async () => {
      // Given
      const buyTransaction = {
        ...mockTransaction,
        transactionType: TransactionType.BUY,
        pricePerShare: 100,
        transactionDate: new Date('2024-01-01'),
      };
      
      const sellTransaction = {
        ...mockTransaction,
        id: 2,
        transactionType: TransactionType.SELL,
        pricePerShare: 120,
        transactionDate: new Date('2024-01-10'),
      };

      mockTransactionRepository.find.mockResolvedValue([buyTransaction, sellTransaction]);

      // When
      const result = await service.analyzeTransactions(1, '30d');

      // Then
      expect(result.period).toBe('30d');
      expect(result.totalTrades).toBe(1);
      expect(result.winningTrades).toBe(1);
      expect(result.losingTrades).toBe(0);
      expect(result.winRate).toBe(100);
      expect(result.totalProfit).toBe(200); // (120 - 100) * 10
      expect(result.averageHoldingPeriod).toBe(9); // 9일
    });

    it('손실 거래를 올바르게 분석해야 함', async () => {
      // Given
      const buyTransaction = {
        ...mockTransaction,
        transactionType: TransactionType.BUY,
        pricePerShare: 120,
        transactionDate: new Date('2024-01-01'),
      };
      
      const sellTransaction = {
        ...mockTransaction,
        id: 2,
        transactionType: TransactionType.SELL,
        pricePerShare: 100,
        transactionDate: new Date('2024-01-05'),
      };

      mockTransactionRepository.find.mockResolvedValue([buyTransaction, sellTransaction]);

      // When
      const result = await service.analyzeTransactions(1, '7d');

      // Then
      expect(result.totalTrades).toBe(1);
      expect(result.winningTrades).toBe(0);
      expect(result.losingTrades).toBe(1);
      expect(result.winRate).toBe(0);
      expect(result.totalLoss).toBe(200); // |100 - 120| * 10
      expect(result.netProfit).toBe(-200);
    });

    it('기간별 설정을 올바르게 처리해야 함', async () => {
      // Given
      mockTransactionRepository.find.mockResolvedValue([]);

      // When
      await service.analyzeTransactions(1, '7d');
      await service.analyzeTransactions(1, '90d');
      await service.analyzeTransactions(1, '1y');

      // Then
      expect(mockTransactionRepository.find).toHaveBeenCalledTimes(3);
      // 각각의 기간에 대해 Between이 올바르게 호출되는지 확인
      expect(mockTransactionRepository.find).toHaveBeenCalledWith({
        where: {
          userId: 1,
          transactionDate: expect.any(Object), // Between 객체
          status: TransactionStatus.COMPLETED,
        },
        relations: ['stock'],
        order: { transactionDate: 'ASC' },
      });
    });
  });

  describe('pairBuySellTransactions', () => {
    it('매수/매도 쌍을 올바르게 생성해야 함', async () => {
      // Given - private 메서드 테스트를 위해 analyzeTransactions를 통해 간접적으로 테스트
      const buyTransaction = {
        ...mockTransaction,
        transactionType: TransactionType.BUY,
        pricePerShare: 100,
        transactionDate: new Date('2024-01-01'),
      };
      
      const sellTransaction = {
        ...mockTransaction,
        id: 2,
        transactionType: TransactionType.SELL,
        pricePerShare: 120,
        transactionDate: new Date('2024-01-10'),
      };

      mockTransactionRepository.find.mockResolvedValue([buyTransaction, sellTransaction]);

      // When
      const result = await service.analyzeTransactions(1, '30d');

      // Then
      expect(result.totalTrades).toBe(1);
      expect(result.totalProfit).toBe(200);
    });
  });

  describe('mapToResponseDto', () => {
    it('거래 엔티티를 응답 DTO로 올바르게 변환해야 함', async () => {
      // Given
      mockPortfolioRepository.findOne.mockResolvedValue(mockPortfolio);
      mockStockRepository.findOne.mockResolvedValue(mockStock);
      mockTransactionRepository.create.mockReturnValue(mockTransaction);
      mockTransactionRepository.save.mockResolvedValue(mockTransaction);

      const createTransactionDto: CreateTransactionDto = {
        portfolioId: 1,
        stockSymbol: 'AAPL',
        transactionType: TransactionType.BUY,
        quantity: 10,
        pricePerShare: 150.0,
        fees: 5.0,
        notes: 'Test transaction',
      };

      // When
      const result = await service.createTransaction(1, createTransactionDto);

      // Then
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('portfolioId');
      expect(result).toHaveProperty('stockSymbol');
      expect(result).toHaveProperty('stockName');
      expect(result).toHaveProperty('transactionType');
      expect(result).toHaveProperty('quantity');
      expect(result).toHaveProperty('pricePerShare');
      expect(result).toHaveProperty('totalAmount');
      expect(result).toHaveProperty('fees');
      expect(result).toHaveProperty('totalWithFees');
      expect(result).toHaveProperty('transactionDate');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('notes');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      
      expect(result.totalWithFees).toBe(result.totalAmount + result.fees);
    });
  });
});
