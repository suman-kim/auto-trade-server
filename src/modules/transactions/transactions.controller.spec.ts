import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { 
  CreateTransactionDto, 
  UpdateTransactionDto, 
  TransactionFilterDto,
  TransactionResponseDto,
  TransactionStatsDto,
  TransactionAnalysisDto,
} from '../../application/dtos/transaction.dto';
import { TransactionType, TransactionStatus } from '../../domain/entities/transaction.entity';
import { User } from '../../domain/entities/user.entity';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  // 테스트 데이터 모킹
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  } as User;

  const mockTransactionResponse: TransactionResponseDto = {
    id: 1,
    userId: 1,
    portfolioId: 1,
    stockSymbol: 'AAPL',
    stockName: 'Apple Inc.',
    transactionType: TransactionType.BUY,
    quantity: 10,
    pricePerShare: 150.0,
    totalAmount: 1500.0,
    fees: 5.0,
    totalWithFees: 1505.0,
    transactionDate: new Date('2024-01-01'),
    status: TransactionStatus.COMPLETED,
    notes: 'Test transaction',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTransactionStats: TransactionStatsDto = {
    totalTransactions: 10,
    totalBuyTransactions: 6,
    totalSellTransactions: 4,
    totalVolume: 100,
    totalAmount: 15000,
    totalFees: 50,
    averageTransactionAmount: 1500,
    mostTradedStock: 'AAPL',
    mostTradedStockVolume: 50,
  };

  const mockTransactionAnalysis: TransactionAnalysisDto = {
    period: '30d',
    totalTrades: 5,
    winningTrades: 3,
    losingTrades: 2,
    winRate: 60,
    averageProfit: 200,
    averageLoss: 100,
    totalProfit: 600,
    totalLoss: 200,
    netProfit: 400,
    profitFactor: 3.0,
    largestWin: 300,
    largestLoss: 150,
    averageHoldingPeriod: 7,
  };

  // Service 모킹
  const mockTransactionsService = {
    createTransaction: jest.fn(),
    getUserTransactions: jest.fn(),
    getTransaction: jest.fn(),
    updateTransaction: jest.fn(),
    deleteTransaction: jest.fn(),
    getTransactionStats: jest.fn(),
    analyzeTransactions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('컨트롤러가 정의되어야 함', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /transactions', () => {
    it('새로운 거래를 성공적으로 생성해야 함', async () => {
      // Given
      const createTransactionDto: CreateTransactionDto = {
        portfolioId: 1,
        stockSymbol: 'AAPL',
        transactionType: TransactionType.BUY,
        quantity: 10,
        pricePerShare: 150.0,
        fees: 5.0,
        notes: 'Test buy transaction',
      };

      mockTransactionsService.createTransaction.mockResolvedValue(mockTransactionResponse);

      // When
      const result = await controller.createTransaction(mockUser, createTransactionDto);

      // Then
      expect(result).toBe(mockTransactionResponse);
      expect(service.createTransaction).toHaveBeenCalledWith(1, createTransactionDto);
    });

    it('서비스 에러를 그대로 전파해야 함', async () => {
      // Given
      const createTransactionDto: CreateTransactionDto = {
        portfolioId: 999,
        stockSymbol: 'INVALID',
        transactionType: TransactionType.BUY,
        quantity: 10,
        pricePerShare: 150.0,
      };

      const serviceError = new Error('포트폴리오를 찾을 수 없습니다.');
      mockTransactionsService.createTransaction.mockRejectedValue(serviceError);

      // When & Then
      await expect(controller.createTransaction(mockUser, createTransactionDto))
        .rejects.toThrow(serviceError);
    });
  });

  describe('GET /transactions', () => {
    it('사용자의 모든 거래 내역을 조회해야 함', async () => {
      // Given
      const expectedTransactions = [mockTransactionResponse];
      mockTransactionsService.getUserTransactions.mockResolvedValue(expectedTransactions);

      // When
      const result = await controller.getUserTransactions(mockUser, {} as TransactionFilterDto);

      // Then
      expect(result).toBe(expectedTransactions);
      expect(service.getUserTransactions).toHaveBeenCalledWith(1, {});
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

      const expectedTransactions = [mockTransactionResponse];
      mockTransactionsService.getUserTransactions.mockResolvedValue(expectedTransactions);

      // When
      const result = await controller.getUserTransactions(mockUser, filter);

      // Then
      expect(result).toBe(expectedTransactions);
      expect(service.getUserTransactions).toHaveBeenCalledWith(1, filter);
    });
  });

  describe('GET /transactions/:id', () => {
    it('특정 거래를 성공적으로 조회해야 함', async () => {
      // Given
      const transactionId = 1;
      mockTransactionsService.getTransaction.mockResolvedValue(mockTransactionResponse);

      // When
      const result = await controller.getTransaction(mockUser, transactionId);

      // Then
      expect(result).toBe(mockTransactionResponse);
      expect(service.getTransaction).toHaveBeenCalledWith(1, transactionId);
    });

    it('존재하지 않는 거래 조회 시 서비스 에러를 전파해야 함', async () => {
      // Given
      const transactionId = 999;
      const serviceError = new Error('거래 내역을 찾을 수 없습니다.');
      mockTransactionsService.getTransaction.mockRejectedValue(serviceError);

      // When & Then
      await expect(controller.getTransaction(mockUser, transactionId))
        .rejects.toThrow(serviceError);
    });
  });

  describe('PUT /transactions/:id', () => {
    it('거래를 성공적으로 수정해야 함', async () => {
      // Given
      const transactionId = 1;
      const updateTransactionDto: UpdateTransactionDto = {
        fees: 10.0,
        notes: 'Updated transaction',
      };

      const updatedTransaction = {
        ...mockTransactionResponse,
        ...updateTransactionDto,
      };

      mockTransactionsService.updateTransaction.mockResolvedValue(updatedTransaction);

      // When
      const result = await controller.updateTransaction(mockUser, transactionId, updateTransactionDto);

      // Then
      expect(result).toBe(updatedTransaction);
      expect(service.updateTransaction).toHaveBeenCalledWith(1, transactionId, updateTransactionDto);
    });

    it('완료된 거래 수정 시 서비스 에러를 전파해야 함', async () => {
      // Given
      const transactionId = 1;
      const updateTransactionDto: UpdateTransactionDto = {
        fees: 15.0,
      };

      const serviceError = new Error('완료된 거래는 수정할 수 없습니다.');
      mockTransactionsService.updateTransaction.mockRejectedValue(serviceError);

      // When & Then
      await expect(controller.updateTransaction(mockUser, transactionId, updateTransactionDto))
        .rejects.toThrow(serviceError);
    });
  });

  describe('DELETE /transactions/:id', () => {
    it('거래를 성공적으로 삭제해야 함', async () => {
      // Given
      const transactionId = 1;
      mockTransactionsService.deleteTransaction.mockResolvedValue(undefined);

      // When
      await controller.deleteTransaction(mockUser, transactionId);

      // Then
      expect(service.deleteTransaction).toHaveBeenCalledWith(1, transactionId);
    });

    it('완료된 거래 삭제 시 서비스 에러를 전파해야 함', async () => {
      // Given
      const transactionId = 1;
      const serviceError = new Error('완료된 거래는 삭제할 수 없습니다.');
      mockTransactionsService.deleteTransaction.mockRejectedValue(serviceError);

      // When & Then
      await expect(controller.deleteTransaction(mockUser, transactionId))
        .rejects.toThrow(serviceError);
    });
  });

  describe('GET /transactions/stats', () => {
    it('거래 통계를 성공적으로 조회해야 함', async () => {
      // Given
      mockTransactionsService.getTransactionStats.mockResolvedValue(mockTransactionStats);

      // When
      const result = await controller.getTransactionStats(mockUser, {} as TransactionFilterDto);

      // Then
      expect(result).toBe(mockTransactionStats);
      expect(service.getTransactionStats).toHaveBeenCalledWith(1, {});
    });

    it('필터를 적용하여 거래 통계를 조회해야 함', async () => {
      // Given
      const filter: TransactionFilterDto = {
        transactionType: TransactionType.BUY,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      mockTransactionsService.getTransactionStats.mockResolvedValue(mockTransactionStats);

      // When
      const result = await controller.getTransactionStats(mockUser, filter);

      // Then
      expect(result).toBe(mockTransactionStats);
      expect(service.getTransactionStats).toHaveBeenCalledWith(1, filter);
    });
  });

  describe('GET /transactions/analysis', () => {
    it('거래 분석을 성공적으로 조회해야 함 (기본 기간)', async () => {
      // Given
      mockTransactionsService.analyzeTransactions.mockResolvedValue(mockTransactionAnalysis);

      // When
      const result = await controller.analyzeTransactions(mockUser);

      // Then
      expect(result).toBe(mockTransactionAnalysis);
      expect(service.analyzeTransactions).toHaveBeenCalledWith(1, '30d');
    });

    it('특정 기간으로 거래 분석을 조회해야 함', async () => {
      // Given
      const period = '7d';
      const analysisResult = {
        ...mockTransactionAnalysis,
        period,
      };

      mockTransactionsService.analyzeTransactions.mockResolvedValue(analysisResult);

      // When
      const result = await controller.analyzeTransactions(mockUser, period);

      // Then
      expect(result).toBe(analysisResult);
      expect(service.analyzeTransactions).toHaveBeenCalledWith(1, period);
    });

    it('유효하지 않은 기간에 대해서도 서비스에 전달해야 함', async () => {
      // Given
      const invalidPeriod = 'invalid';
      mockTransactionsService.analyzeTransactions.mockResolvedValue(mockTransactionAnalysis);

      // When
      const result = await controller.analyzeTransactions(mockUser, invalidPeriod);

      // Then
      expect(result).toBe(mockTransactionAnalysis);
      expect(service.analyzeTransactions).toHaveBeenCalledWith(1, invalidPeriod);
    });
  });

  describe('에러 처리', () => {
    it('서비스 레이어의 에러를 그대로 전파해야 함', async () => {
      // Given
      const serviceError = new Error('데이터베이스 연결 오류');
      mockTransactionsService.getUserTransactions.mockRejectedValue(serviceError);

      // When & Then
      await expect(controller.getUserTransactions(mockUser, {} as TransactionFilterDto))
        .rejects.toThrow(serviceError);
    });
  });

  describe('파라미터 검증', () => {
    it('유효한 파라미터를 올바르게 전달해야 함', async () => {
      // Given
      const transactionId = 123;
      mockTransactionsService.getTransaction.mockResolvedValue(mockTransactionResponse);

      // When
      await controller.getTransaction(mockUser, transactionId);

      // Then
      expect(service.getTransaction).toHaveBeenCalledWith(1, transactionId);
    });
  });
});
