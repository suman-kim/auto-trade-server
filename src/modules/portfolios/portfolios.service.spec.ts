import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { Portfolio } from '../../domain/entities/portfolio.entity';
import { PortfolioHolding } from '../../domain/entities/portfolio-holding.entity';
import { Stock } from '../../domain/entities/stock.entity';
import { StocksService } from '../stocks/stocks.service';
import { 
  CreatePortfolioDto, 
  UpdatePortfolioDto, 
  AddHoldingDto, 
  UpdateHoldingDto
} from '../../application/dtos/portfolio.dto';

describe('PortfoliosService', () => {
  let service: PortfoliosService;
  let portfolioRepository: Repository<Portfolio>;
  let holdingRepository: Repository<PortfolioHolding>;
  let stockRepository: Repository<Stock>;
  let stocksService: StocksService;

  const mockPortfolioRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockHoldingRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockStockRepository = {
    findOne: jest.fn(),
  };

  const mockStocksService = {
    getCurrentPrice: jest.fn(),
  };

  const mockUser = {
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

  const mockPortfolio: Portfolio = {
    id: 1,
    name: '테스트 포트폴리오',
    description: '테스트용 포트폴리오',
    userId: 1,
    totalValue: 15000.0,
    createdAt: new Date(),
    updatedAt: new Date(),
    holdings: [],
    transactions: [],
    user: mockUser,
    get totalInvested() { return this.holdings?.reduce((total, holding) => total + holding.totalInvested, 0) || 0; },
    get totalReturn() { return this.totalInvested > 0 ? ((this.totalValue - this.totalInvested) / this.totalInvested) * 100 : 0; },
    isProfitable() { return this.totalValue > this.totalInvested; }
  };

  const mockStock: Stock = {
    id: 1,
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    name: 'Apple',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    exchange: 'NASDAQ',
    currency: 'USD',
    currentPrice: 150.0,
    previousClose: 148.0,
    high: 152.0,
    low: 147.0,
    volume: 50000000,
    marketCap: 3000000000000,
    peRatio: 28.5,
    dividendYield: 0.5,
    lastUpdated: new Date(),
    portfolioHoldings: [],
    transactions: [],
    tradingSignals: [],
    priceAlerts: [],
    get priceChange() { return this.currentPrice && this.previousClose ? ((this.currentPrice - this.previousClose) / this.previousClose) * 100 : 0; },
    get priceChangeDirection() { return this.currentPrice > this.previousClose ? 'up' : this.currentPrice < this.previousClose ? 'down' : 'unchanged'; },
    isActive() { return this.currentPrice !== null && this.currentPrice > 0; }
  };

  const mockHolding: PortfolioHolding = {
    id: 1,
    portfolioId: 1,
    stockId: 1,
    quantity: 100,
    averagePrice: 150.0,
    totalInvested: 15000.0,
    createdAt: new Date(),
    updatedAt: new Date(),
    portfolio: mockPortfolio,
    stock: mockStock,
    get currentValue() { return this.quantity * (this.stock?.currentPrice || 0); },
    get returnRate() { return this.totalInvested > 0 ? ((this.currentValue - this.totalInvested) / this.totalInvested) * 100 : 0; },
    get profitLoss() { return this.currentValue - this.totalInvested; },
    isProfitable() { return this.currentValue > this.totalInvested; }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfoliosService,
        {
          provide: getRepositoryToken(Portfolio),
          useValue: mockPortfolioRepository,
        },
        {
          provide: getRepositoryToken(PortfolioHolding),
          useValue: mockHoldingRepository,
        },
        {
          provide: getRepositoryToken(Stock),
          useValue: mockStockRepository,
        },
        {
          provide: StocksService,
          useValue: mockStocksService,
        },
      ],
    }).compile();

    service = module.get<PortfoliosService>(PortfoliosService);
    portfolioRepository = module.get<Repository<Portfolio>>(getRepositoryToken(Portfolio));
    holdingRepository = module.get<Repository<PortfolioHolding>>(getRepositoryToken(PortfolioHolding));
    stockRepository = module.get<Repository<Stock>>(getRepositoryToken(Stock));
    stocksService = module.get<StocksService>(StocksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserPortfolios', () => {
    it('should return user portfolios with summaries', async () => {
      // Arrange
      const userId = 1;
      const portfoliosWithHoldings = [
        { ...mockPortfolio, holdings: [mockHolding] }
      ];
      mockPortfolioRepository.find.mockResolvedValue(portfoliosWithHoldings);
      mockStocksService.getCurrentPrice.mockResolvedValue(160.0);

      // Act
      const result = await service.getUserPortfolios(userId);

      // Assert
      expect(mockPortfolioRepository.find).toHaveBeenCalledWith({
        where: { userId },
        relations: ['holdings', 'holdings.stock'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', mockPortfolio.id);
      expect(result[0]).toHaveProperty('name', mockPortfolio.name);
      expect(result[0]).toHaveProperty('totalValue');
      expect(result[0]).toHaveProperty('totalReturn');
    });

    it('should return empty array when user has no portfolios', async () => {
      // Arrange
      const userId = 1;
      mockPortfolioRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.getUserPortfolios(userId);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('createPortfolio', () => {
    it('should create a new portfolio successfully', async () => {
      // Arrange
      const userId = 1;
      const createPortfolioDto: CreatePortfolioDto = {
        name: '새 포트폴리오',
        description: '설명',
        riskLevel: 'moderate',
        targetReturn: 10.0,
      };
      
      const newPortfolio = { ...mockPortfolio, ...createPortfolioDto, userId, totalValue: 0 };
      mockPortfolioRepository.create.mockReturnValue(newPortfolio);
      mockPortfolioRepository.save.mockResolvedValue(newPortfolio);

      // Act
      const result = await service.createPortfolio(userId, createPortfolioDto);

      // Assert
      expect(mockPortfolioRepository.create).toHaveBeenCalledWith({
        ...createPortfolioDto,
        userId,
      });
      expect(mockPortfolioRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id', mockPortfolio.id);
      expect(result).toHaveProperty('name', createPortfolioDto.name);
      expect(result).toHaveProperty('totalValue', 0);
    });
  });

  describe('getPortfolio', () => {
    it('should return portfolio details successfully', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 1;
      const portfolioWithHoldings = { ...mockPortfolio, holdings: [mockHolding] };
      
      mockPortfolioRepository.findOne.mockResolvedValue(portfolioWithHoldings);
      mockStocksService.getCurrentPrice.mockResolvedValue(160.0);

      // Act
      const result = await service.getPortfolio(userId, portfolioId);

      // Assert
      expect(mockPortfolioRepository.findOne).toHaveBeenCalledWith({
        where: { id: portfolioId, userId },
        relations: ['holdings', 'holdings.stock'],
      });
      expect(result).toHaveProperty('id', mockPortfolio.id);
      expect(result).toHaveProperty('totalValue');
      expect(result).toHaveProperty('totalReturn');
    });

    it('should throw NotFoundException when portfolio not found', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 999;
      mockPortfolioRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getPortfolio(userId, portfolioId)).rejects.toThrow(
        new NotFoundException('포트폴리오를 찾을 수 없습니다.'),
      );
    });
  });

  describe('updatePortfolio', () => {
    it('should update portfolio successfully', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 1;
      const updatePortfolioDto: UpdatePortfolioDto = {
        name: '업데이트된 포트폴리오',
        description: '업데이트된 설명',
      };

      mockPortfolioRepository.findOne.mockResolvedValue(mockPortfolio);
      mockPortfolioRepository.save.mockResolvedValue({
        ...mockPortfolio,
        ...updatePortfolioDto,
      });

      // Mock getPortfolio 호출
      jest.spyOn(service, 'getPortfolio').mockResolvedValue({
        id: portfolioId,
        name: updatePortfolioDto.name || mockPortfolio.name,
        description: updatePortfolioDto.description,
        riskLevel: undefined,
        targetReturn: undefined,
        totalValue: 0,
        totalCost: 0,
        totalReturn: 0,
        totalReturnPercent: 0,
        holdingsCount: 0,
        createdAt: mockPortfolio.createdAt.toISOString(),
        updatedAt: mockPortfolio.updatedAt.toISOString(),
      });

      // Act
      const result = await service.updatePortfolio(userId, portfolioId, updatePortfolioDto);

      // Assert
      expect(mockPortfolioRepository.findOne).toHaveBeenCalledWith({
        where: { id: portfolioId, userId },
      });
      expect(mockPortfolioRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('name', updatePortfolioDto.name);
    });

    it('should throw NotFoundException when portfolio not found', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 999;
      const updatePortfolioDto: UpdatePortfolioDto = {};
      mockPortfolioRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updatePortfolio(userId, portfolioId, updatePortfolioDto),
      ).rejects.toThrow(new NotFoundException('포트폴리오를 찾을 수 없습니다.'));
    });
  });

  describe('deletePortfolio', () => {
    it('should delete portfolio successfully when no holdings', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 1;
      const portfolioWithoutHoldings = { ...mockPortfolio, holdings: [] };
      
      mockPortfolioRepository.findOne.mockResolvedValue(portfolioWithoutHoldings);
      mockPortfolioRepository.remove.mockResolvedValue(portfolioWithoutHoldings);

      // Act
      await service.deletePortfolio(userId, portfolioId);

      // Assert
      expect(mockPortfolioRepository.findOne).toHaveBeenCalledWith({
        where: { id: portfolioId, userId },
        relations: ['holdings'],
      });
      expect(mockPortfolioRepository.remove).toHaveBeenCalledWith(portfolioWithoutHoldings);
    });

    it('should throw BadRequestException when portfolio has holdings', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 1;
      const portfolioWithHoldings = { ...mockPortfolio, holdings: [mockHolding] };
      
      mockPortfolioRepository.findOne.mockResolvedValue(portfolioWithHoldings);

      // Act & Assert
      await expect(service.deletePortfolio(userId, portfolioId)).rejects.toThrow(
        new BadRequestException('보유량이 있는 포트폴리오는 삭제할 수 없습니다.'),
      );
    });

    it('should throw NotFoundException when portfolio not found', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 999;
      mockPortfolioRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.deletePortfolio(userId, portfolioId)).rejects.toThrow(
        new NotFoundException('포트폴리오를 찾을 수 없습니다.'),
      );
    });
  });

  describe('addHolding', () => {
    it('should add new holding successfully', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 1;
      const addHoldingDto: AddHoldingDto = {
        symbol: 'AAPL',
        quantity: 50,
        averagePrice: 150.0,
      };

      mockPortfolioRepository.findOne.mockResolvedValue(mockPortfolio);
      mockStockRepository.findOne.mockResolvedValue(mockStock);
      mockHoldingRepository.findOne.mockResolvedValue(null); // 기존 보유량 없음
      mockHoldingRepository.create.mockReturnValue(mockHolding);
      mockHoldingRepository.save.mockResolvedValue(mockHolding);
      mockStocksService.getCurrentPrice.mockResolvedValue(160.0);

      // Act
      const result = await service.addHolding(userId, portfolioId, addHoldingDto);

      // Assert
      expect(mockPortfolioRepository.findOne).toHaveBeenCalledWith({
        where: { id: portfolioId, userId },
      });
      expect(mockStockRepository.findOne).toHaveBeenCalledWith({
        where: { symbol: addHoldingDto.symbol },
      });
      expect(mockHoldingRepository.create).toHaveBeenCalledWith({
        portfolioId,
        stockId: mockStock.id,
        quantity: addHoldingDto.quantity,
        averagePrice: addHoldingDto.averagePrice,
        totalInvested: addHoldingDto.quantity * addHoldingDto.averagePrice,
      });
      expect(result).toHaveProperty('symbol', mockStock.symbol);
    });

    it('should update existing holding when adding to existing position', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 1;
      const addHoldingDto: AddHoldingDto = {
        symbol: 'AAPL',
        quantity: 50,
        averagePrice: 160.0,
      };

      const existingHolding = { ...mockHolding };
      mockPortfolioRepository.findOne.mockResolvedValue(mockPortfolio);
      mockStockRepository.findOne.mockResolvedValue(mockStock);
      mockHoldingRepository.findOne.mockResolvedValue(existingHolding);
      mockHoldingRepository.save.mockResolvedValue({
        ...existingHolding,
        quantity: 150, // 100 + 50
      });
      mockStocksService.getCurrentPrice.mockResolvedValue(165.0);

      // Act
      const result = await service.addHolding(userId, portfolioId, addHoldingDto);

      // Assert
      expect(mockHoldingRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('symbol', mockStock.symbol);
    });

    it('should throw NotFoundException when portfolio not found', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 999;
      const addHoldingDto: AddHoldingDto = {
        symbol: 'AAPL',
        quantity: 50,
        averagePrice: 150.0,
      };

      mockPortfolioRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.addHolding(userId, portfolioId, addHoldingDto),
      ).rejects.toThrow(new NotFoundException('포트폴리오를 찾을 수 없습니다.'));
    });

    it('should throw NotFoundException when stock not found', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 1;
      const addHoldingDto: AddHoldingDto = {
        symbol: 'INVALID',
        quantity: 50,
        averagePrice: 150.0,
      };

      mockPortfolioRepository.findOne.mockResolvedValue(mockPortfolio);
      mockStockRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.addHolding(userId, portfolioId, addHoldingDto),
      ).rejects.toThrow(new NotFoundException('주식을 찾을 수 없습니다.'));
    });
  });

  describe('updateHolding', () => {
    it('should update holding successfully', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 1;
      const holdingId = 1;
      const updateHoldingDto: UpdateHoldingDto = {
        quantity: 200,
        averagePrice: 155.0,
      };

      const holdingWithRelations = {
        ...mockHolding,
        portfolio: mockPortfolio,
        stock: mockStock,
      };

      mockHoldingRepository.findOne.mockResolvedValue(holdingWithRelations);
      mockHoldingRepository.save.mockResolvedValue({
        ...holdingWithRelations,
        ...updateHoldingDto,
        totalInvested: (updateHoldingDto.quantity || 0) * (updateHoldingDto.averagePrice || 0),
      });
      mockStocksService.getCurrentPrice.mockResolvedValue(160.0);

      // Act
      const result = await service.updateHolding(userId, portfolioId, holdingId, updateHoldingDto);

      // Assert
      expect(mockHoldingRepository.findOne).toHaveBeenCalledWith({
        where: { id: holdingId, portfolio: { id: portfolioId, userId } },
        relations: ['portfolio', 'stock'],
      });
      expect(mockHoldingRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('symbol', mockStock.symbol);
    });

    it('should throw NotFoundException when holding not found', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 1;
      const holdingId = 999;
      const updateHoldingDto: UpdateHoldingDto = {};

      mockHoldingRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updateHolding(userId, portfolioId, holdingId, updateHoldingDto),
      ).rejects.toThrow(new NotFoundException('보유량을 찾을 수 없습니다.'));
    });
  });

  describe('removeHolding', () => {
    it('should remove holding successfully', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 1;
      const holdingId = 1;

      const holdingWithPortfolio = {
        ...mockHolding,
        portfolio: mockPortfolio,
      };

      mockHoldingRepository.findOne.mockResolvedValue(holdingWithPortfolio);
      mockHoldingRepository.remove.mockResolvedValue(holdingWithPortfolio);

      // Act
      await service.removeHolding(userId, portfolioId, holdingId);

      // Assert
      expect(mockHoldingRepository.findOne).toHaveBeenCalledWith({
        where: { id: holdingId, portfolio: { id: portfolioId, userId } },
        relations: ['portfolio'],
      });
      expect(mockHoldingRepository.remove).toHaveBeenCalledWith(holdingWithPortfolio);
    });

    it('should throw NotFoundException when holding not found', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 1;
      const holdingId = 999;

      mockHoldingRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.removeHolding(userId, portfolioId, holdingId)).rejects.toThrow(
        new NotFoundException('보유량을 찾을 수 없습니다.'),
      );
    });
  });

  describe('getPortfolioHoldings', () => {
    it('should return portfolio holdings successfully', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 1;
      const holdings = [{ ...mockHolding, stock: mockStock }];

      mockHoldingRepository.find.mockResolvedValue(holdings);
      mockStocksService.getCurrentPrice.mockResolvedValue(160.0);

      // Act
      const result = await service.getPortfolioHoldings(userId, portfolioId);

      // Assert
      expect(mockHoldingRepository.find).toHaveBeenCalledWith({
        where: { portfolio: { id: portfolioId, userId } },
        relations: ['stock'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('symbol', mockStock.symbol);
    });
  });

  describe('getPortfolioPerformance', () => {
    it('should return portfolio performance successfully', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 1;
      const portfolioWithHoldings = { ...mockPortfolio, holdings: [mockHolding] };

      mockPortfolioRepository.findOne.mockResolvedValue(portfolioWithHoldings);
      mockStocksService.getCurrentPrice.mockResolvedValue(160.0);

      // Act
      const result = await service.getPortfolioPerformance(userId, portfolioId);

      // Assert
      expect(mockPortfolioRepository.findOne).toHaveBeenCalledWith({
        where: { id: portfolioId, userId },
        relations: ['holdings', 'holdings.stock'],
      });
      expect(result).toHaveProperty('portfolioId', mockPortfolio.id);
      expect(result).toHaveProperty('totalValue');
      expect(result).toHaveProperty('totalReturn');
      expect(result).toHaveProperty('sharpeRatio');
    });

    it('should throw NotFoundException when portfolio not found', async () => {
      // Arrange
      const userId = 1;
      const portfolioId = 999;

      mockPortfolioRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getPortfolioPerformance(userId, portfolioId)).rejects.toThrow(
        new NotFoundException('포트폴리오를 찾을 수 없습니다.'),
      );
    });
  });
});
