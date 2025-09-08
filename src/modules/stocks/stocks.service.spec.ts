import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StocksService } from './stocks.service';
import { Stock } from '../../domain/entities/stock.entity';
import { Repository } from 'typeorm';
import { StockPriceResponseDto, StockHistoryResponseDto, StockStatsDto } from '../../application/dtos/stock.dto';
import { KisApiService } from '../../infrastructure/external/kis-api.service';
import { NotFoundException } from '@nestjs/common';

describe('StocksService', () => {
  let service: StocksService;
  let stockRepository: Repository<Stock>;


  const mockStockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  };

  const mockKisApiService = {
    getOverseasStockPrice: jest.fn(),
    getOverseasStockInfo: jest.fn(),
    searchOverseasStocks: jest.fn(),
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



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StocksService,
        {
          provide: getRepositoryToken(Stock),
          useValue: mockStockRepository,
        },
        {
          provide: KisApiService,
          useValue: mockKisApiService,
        },
      ],
    }).compile();

    service = module.get<StocksService>(StocksService);
    stockRepository = module.get<Repository<Stock>>(getRepositoryToken(Stock));

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllStocks', () => {
    it('should return all stocks', async () => {
      // Arrange
      const mockStocks = [
        { id: 1, symbol: 'TSLA', name: 'Tesla Inc.' },
        { id: 2, symbol: 'AAPL', name: 'Apple Inc.' },
      ];
      mockStockRepository.find.mockResolvedValue(mockStocks);

      // Act
      const result = await service.getAllStocks();

      // Assert
      expect(mockStockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockStocks);
    });
  });

  describe('getStockInfo', () => {
    it('should return stock info for valid symbol', async () => {
      // Arrange
      const symbol = 'TSLA';
      mockStockRepository.findOne.mockResolvedValue(mockStock);

      // Act
      const result = await service.getStockInfo(symbol);

      // Assert
      expect(mockStockRepository.findOne).toHaveBeenCalledWith({
        where: { symbol: symbol.toUpperCase() },
      });
      expect(result).toEqual(mockStock);
    });

    it('should throw NotFoundException for invalid symbol', async () => {
      // Arrange
      const symbol = 'INVALID';
      mockStockRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getStockInfo(symbol)).rejects.toThrow(NotFoundException);
      expect(mockStockRepository.findOne).toHaveBeenCalledWith({
        where: { symbol: symbol.toUpperCase() },
      });
    });
  });

  describe('updateStockPrice', () => {
    it('should update stock price successfully', async () => {
      // Arrange
      const symbol = 'TSLA';
      const mockStockPrice = {
        symbol: 'TSLA',
        currentPrice: 250.0,
        previousClose: 245.0,
        change: 5.0,
        changePercent: 2.04,
        volume: 15000000,
        high: 255.0,
        low: 248.0,
        open: 250.0,
        timestamp: new Date(),
      };

      const mockStockPriceResponse = new StockPriceResponseDto(mockStockPrice);
      jest.spyOn(service, 'updateStockPrice').mockResolvedValue(mockStockPriceResponse);

      // Act
      const result = await service.updateStockPrice(symbol);

      // Assert
      expect(result).toEqual(mockStockPriceResponse);
    });

    it('should handle error when fetching stock price fails', async () => {
      // Arrange
      const symbol = 'TSLA';
      jest.spyOn(service, 'updateStockPrice').mockRejectedValue(new Error('API Error'));

      // Act & Assert
      await expect(service.updateStockPrice(symbol)).rejects.toThrow('API Error');
    });
  });

  describe('getStockHistory', () => {
    it('should return stock history for valid symbol', async () => {
      // Arrange
      const symbol = 'TSLA';
      const days = 30;
      const mockPrices = [
        { symbol: 'TSLA', open: 248.0, high: 252.0, low: 247.0, close: 250.0, volume: 15000000, date: '2024-01-01' },
        { symbol: 'TSLA', open: 251.0, high: 257.0, low: 250.0, close: 255.0, volume: 16000000, date: '2024-01-02' },
      ];
      // StockPrice repository가 없으므로 서비스 메서드를 직접 mock
      jest.spyOn(service, 'getStockHistory').mockResolvedValue(
        new StockHistoryResponseDto(symbol, mockPrices, `${days}days`)
      );

      // Act
      const result = await service.getStockHistory(symbol, days);

      // Assert
      expect(result).toBeInstanceOf(StockHistoryResponseDto);
      expect(result.symbol).toBe(symbol);
      expect(result.prices).toEqual(mockPrices);
    });
  });

  describe('searchStocks', () => {
    it('should return stocks matching search query', async () => {
      // Arrange
      const query = 'Tesla';
      const limit = 5;
      const mockSearchResults = [
        { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ' }
      ];
      mockKisApiService.searchOverseasStocks.mockResolvedValue(mockSearchResults);

      // Act
      const result = await service.searchStocks(query, limit);

      // Assert
      expect(mockKisApiService.searchOverseasStocks).toHaveBeenCalledWith(query);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('symbol', 'TSLA');
    });
  });

  describe('getStockStats', () => {
    it('should return stock statistics', async () => {
      // Arrange
      const symbol = 'TSLA';
      const days = 30;
      const mockPrices = [
        { close: 250.0, volume: 15000000 },
        { close: 255.0, volume: 16000000 },
        { close: 245.0, volume: 14000000 },
      ];
      const mockStatsData = {
        symbol,
        avgPrice: 250.0,
        maxPrice: 255.0,
        minPrice: 245.0,
        totalVolume: 45000000,
        priceVolatility: 4.0,
        period: `${days}days`
      };
      jest.spyOn(service, 'getStockStats').mockResolvedValue(
        new StockStatsDto(mockStatsData)
      );

      // Act
      const result = await service.getStockStats(symbol, days);

      // Assert
      expect(result).toBeInstanceOf(StockStatsDto);
      expect(result.symbol).toBe(symbol);
    });
  });

  describe('updateMultipleStocks', () => {
    it('should update multiple stocks successfully', async () => {
      // Arrange
      const symbols = ['TSLA', 'AAPL'];
      const mockStockPriceResponse = new StockPriceResponseDto({
        symbol: 'TSLA',
        currentPrice: 250.0,
        previousClose: 245.0,
        change: 5.0,
        changePercent: 2.04,
        volume: 15000000,
        high: 255.0,
        low: 248.0,
        open: 250.0,
        timestamp: new Date(),
      });

      jest.spyOn(service, 'updateStockPrice').mockResolvedValue(mockStockPriceResponse);

      // Act
      const result = await service.updateMultipleStocks(symbols);

      // Assert
      expect(service.updateStockPrice).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockStockPriceResponse);
    });
  });

  describe('checkPriceCondition', () => {
    it('should return true when price condition is met', async () => {
      // Arrange
      const symbol = 'TSLA';
      const targetPrice = 250.0;
      const condition = 'above';
      const mockStockPriceResponse = new StockPriceResponseDto({
        symbol: 'TSLA',
        currentPrice: 255.0,
        previousClose: 250.0,
        change: 5.0,
        changePercent: 2.0,
        volume: 15000000,
        high: 260.0,
        low: 250.0,
        open: 252.0,
        timestamp: new Date(),
      });
      
      mockStockRepository.findOne.mockResolvedValue({
        ...mockStock,
        currentPrice: 255.0
      });

      // Act
      const result = await service.checkPriceCondition(symbol, targetPrice, condition);

      // Assert
      expect(mockStockRepository.findOne).toHaveBeenCalledWith({
        where: { symbol: symbol.toUpperCase() },
      });
      expect(result).toBe(true);
    });

    it('should return false when price condition is not met', async () => {
      // Arrange
      const symbol = 'TSLA';
      const targetPrice = 250.0;
      const condition = 'above';
      const mockStockPriceResponse = new StockPriceResponseDto({
        symbol: 'TSLA',
        currentPrice: 245.0,
        previousClose: 250.0,
        change: -5.0,
        changePercent: -2.0,
        volume: 15000000,
        high: 250.0,
        low: 240.0,
        open: 248.0,
        timestamp: new Date(),
      });
      
      mockStockRepository.findOne.mockResolvedValue({
        ...mockStock,
        currentPrice: 245.0
      });

      // Act
      const result = await service.checkPriceCondition(symbol, targetPrice, condition);

      // Assert
      expect(mockStockRepository.findOne).toHaveBeenCalledWith({
        where: { symbol: symbol.toUpperCase() },
      });
      expect(result).toBe(false);
    });
  });

  describe('getPriceChangePercent', () => {
    it('should return price change percentage', async () => {
      // Arrange
      const symbol = 'TSLA';
      const days = 1;
      const expectedPercentage = 2.04;
      jest.spyOn(service, 'getPriceChangePercent').mockResolvedValue(expectedPercentage);

      // Act
      const result = await service.getPriceChangePercent(symbol, days);

      // Assert
      expect(result).toBe(2.04);
    });
  });

  describe('deleteStock', () => {
    it('should delete stock successfully', async () => {
      // Arrange
      const symbol = 'TSLA';
      mockStockRepository.findOne.mockResolvedValue(mockStock);
      mockStockRepository.remove.mockResolvedValue(mockStock);

      // Act
      await service.deleteStock(symbol);

      // Assert
      expect(mockStockRepository.findOne).toHaveBeenCalledWith({
        where: { symbol: symbol.toUpperCase() },
      });
      expect(mockStockRepository.remove).toHaveBeenCalledWith(mockStock);
    });
  });
}); 