import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Stock } from '../../entities/stock.entity';
import { StockPriceDto, StockInfoDto, StockPriceResponseDto, StockHistoryResponseDto, StockStatsDto } from '../../dtos/stock.dto';

/**
 * 주식 데이터 서비스
 * 주식 데이터 수집, 저장, 조회 기능을 제공합니다.
 */
@Injectable()
export class StocksService {
  private readonly logger = new Logger(StocksService.name);

  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  /**
   * 실시간 주식 가격을s 조회하고 데이터베이스에 저장합니다.
   */
  async updateStockPrice(symbol: string): Promise<StockPriceResponseDto> {
    try {
      // 한국투자증권 API에서 실시간 가격 조회 (해외 주식으로 처리)
      //const priceData = await this.kisApiService.getOverseasStockPrice(symbol);

      const priceData:any ={ 

      };

      
      // 데이터베이스에서 기존 주식 정보 조회
      let stock = await this.stockRepository.findOne({
        where: { symbol: symbol.toUpperCase() },
      });

      if (!stock) {
        // 새로운 주식 정보 생성
        //const stockInfo = await this.kisApiService.getOverseasStockInfo(symbol);

        const stockInfo: StockInfoDto = {
          symbol,
          name: '',
          sector: '',
          industry: '',
          exchange: '',
          currency: '',
          marketCap: 0,
          peRatio: 0,
          dividendYield: 0,
        };

        stock = this.stockRepository.create({
          symbol: stockInfo.symbol,
          companyName: stockInfo.name,
          name: stockInfo.name,
          sector: stockInfo.sector,
          industry: stockInfo.industry,
          exchange: stockInfo.exchange,
          currency: stockInfo.currency,
          currentPrice: priceData.price,
          previousClose: priceData.prevClose,
          high: priceData.high,
          low: priceData.low,
          volume: priceData.volume,
          marketCap: stockInfo.marketCap,
          peRatio: stockInfo.peRatio,
          dividendYield: stockInfo.dividendYield,
        });
      } else {
        // 기존 주식 정보 업데이트
        stock.previousClose = stock.currentPrice;
        stock.currentPrice = priceData.price;
        stock.high = priceData.high;
        stock.low = priceData.low;
        stock.volume = priceData.volume;
        stock.lastUpdated = new Date();
      }

      // 데이터베이스에 저장
      await this.stockRepository.save(stock);

      // 응답 DTO 생성
      return new StockPriceResponseDto({
        symbol: stock.symbol,
        currentPrice: stock.currentPrice,
        previousClose: stock.previousClose,
        change: priceData.change,
        changePercent: priceData.changePercent,
        volume: stock.volume,
        marketCap: stock.marketCap,
        high: stock.high,
        low: stock.low,
        open: priceData.open,
        timestamp: stock.lastUpdated,
      });
    } catch (error) {
      this.logger.error(`주식 가격 업데이트 실패 (${symbol}):`, error.message);
      throw error;
    }
  }

  /**
   * 주식 정보를 조회합니다.
   */
  async getStockInfo(symbol: string): Promise<Stock> {
    const stock:Stock|null = await this.stockRepository.findOne({
      where: { symbol: symbol.toUpperCase() },
    });

    if (!stock) {
      throw new NotFoundException(`주식 정보를 찾을 수 없습니다: ${symbol}`);
    }

    return stock;
  }

  /**
   * 모든 주식 정보를 조회합니다.
   */
  async getAllStocks(): Promise<Stock[]> {
    return await this.stockRepository.find({
      order: { symbol: 'ASC' },
    });
  }

  /**
   * 주식 히스토리 데이터를 조회합니다.
   */
  async getStockHistory(symbol: string, days: number = 30): Promise<StockHistoryResponseDto> {
    // 한국투자증권 API에서 히스토리 데이터 조회
    //const prices = await this.kisApiService.getOverseasStockHistory(symbol, days);
    const prices: Array<StockPriceDto> = [];

    // StockPriceDto 형식으로 변환
    const stockPrices = prices.map(price => ({
      symbol,
      date: price.date,
      open: price.open,
      high: price.high,
      low: price.low,
      close: price.close,
      volume: price.volume,
    }));
    
    return new StockHistoryResponseDto(symbol, stockPrices, `${days}일`);
  }

  /**
   * 주식 검색을 수행합니다.
   */
  async searchStocks(query: string, limit: number = 10): Promise<StockInfoDto[]> {
    //const searchResults = await this.kisApiService.searchOverseasStocks(query);
    const searchResults: Array<StockInfoDto> = [];
    return searchResults.map(result => ({
      symbol: result.symbol,
      name: result.name,
      sector: 'Unknown',
      industry: 'Unknown',
      exchange: result.exchange,
      currency: result.currency,
      marketCap: 0,
      peRatio: 0,
      dividendYield: 0,
    }));
  }

  /**
   * 주식 통계를 계산합니다.
   */
  async getStockStats(symbol: string, days: number = 30): Promise<StockStatsDto> {
    //const prices = await this.kisApiService.getOverseasStockHistory(symbol, days);
    const prices: Array<StockPriceDto> = [];
    
    if (prices.length === 0) {
      throw new NotFoundException(`주식 데이터를 찾을 수 없습니다: ${symbol}`);
    }

    const closePrices = prices.map(p => p.close);
    const volumes = prices.map(p => p.volume);

    const avgPrice = closePrices.reduce((sum, price) => sum + price, 0) / closePrices.length;
    const maxPrice = Math.max(...closePrices);
    const minPrice = Math.min(...closePrices);
    const totalVolume = volumes.reduce((sum, volume) => sum + volume, 0);

    // 변동성 계산 (표준편차)
    const variance = closePrices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / closePrices.length;
    const priceVolatility = Math.sqrt(variance);

    return new StockStatsDto({
      symbol,
      avgPrice,
      maxPrice,
      minPrice,
      totalVolume,
      priceVolatility,
      period: `${days}일`,
    });
  }

  /**
   * 여러 주식의 가격을 일괄 업데이트합니다.
   */
  async updateMultipleStocks(symbols: string[]): Promise<StockPriceResponseDto[]> {
    const results: StockPriceResponseDto[] = [];
    
    for (const symbol of symbols) {
      try {
        const result = await this.updateStockPrice(symbol);
        results.push(result);
      } catch (error) {
        this.logger.error(`주식 업데이트 실패 (${symbol}):`, error.message);
        // 개별 실패는 로그만 남기고 계속 진행
      }
    }

    return results;
  }

  /**
   * 주식 정보를 데이터베이스에 저장합니다.
   */
  async saveStockInfo(stockInfo: StockInfoDto): Promise<Stock> {
    let stock = await this.stockRepository.findOne({
      where: { symbol: stockInfo.symbol },
    });

    if (!stock) {
      stock = this.stockRepository.create({
        symbol: stockInfo.symbol,
        companyName: stockInfo.name,
        name: stockInfo.name,
        sector: stockInfo.sector,
        industry: stockInfo.industry,
        exchange: stockInfo.exchange,
        currency: stockInfo.currency,
        marketCap: stockInfo.marketCap,
        peRatio: stockInfo.peRatio,
        dividendYield: stockInfo.dividendYield,
      });
    } else {
      // 기존 정보 업데이트
      Object.assign(stock, stockInfo);
    }

    return await this.stockRepository.save(stock);
  }

  /**
   * 주식 정보를 삭제합니다.
   */
  async deleteStock(symbol: string): Promise<void> {
    const stock = await this.getStockInfo(symbol);
    await this.stockRepository.remove(stock);
  }

  /**
   * 주식 가격이 특정 조건을 만족하는지 확인합니다.
   */
  async checkPriceCondition(symbol: string, targetPrice: number, condition: 'above' | 'below'): Promise<boolean> {
    const stock = await this.getStockInfo(symbol);
    
    if (condition === 'above') {
      return stock.currentPrice >= targetPrice;
    } else {
      return stock.currentPrice <= targetPrice;
    }
  }

  /**
   * 주식 가격 변화율을 계산합니다.
   */
  async getPriceChangePercent(symbol: string, days: number = 1): Promise<number> {
    //const prices = await this.kisApiService.getOverseasStockHistory(symbol, days + 1);
    const prices: Array<StockPriceDto> = [];
    
    if (prices.length < 2) {
      throw new NotFoundException(`충분한 히스토리 데이터가 없습니다: ${symbol}`);
    }

    const currentPrice = prices[0].close;
    const previousPrice = prices[1].close;
    
    return ((currentPrice - previousPrice) / previousPrice) * 100;
  }


  /**
   * 주식의 현재 가격을 조회합니다.
   */
  async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const stock = await this.stockRepository.findOne({
        where: { symbol: symbol.toUpperCase() },
      });

      if (!stock || !stock.currentPrice) {
        // 데모 모드에서는 기본 가격 반환
        return 100.0;
      }

      return stock.currentPrice;
    } catch (error) {
      this.logger.error(`현재 가격 조회 실패 (${symbol}):`, error.message);
      // 에러 시 기본 가격 반환
      return 100.0;
    }
  }


  /**
   * 주식 가격 정보를 업데이트합니다.
   * 실시간 엔진에서 사용됩니다.
   * @param symbol 종목 코드
   * @param currentPrice 현재가
   * @param highPrice 고가
   * @param lowPrice 저가
   * @param volume 거래량
   */
  async updateStockPriceInfo(symbol: string, currentPrice: number, highPrice: number|null, lowPrice: number|null, volume: number): Promise<Stock | null> {
    try {
      let stock = await this.getStockInfo(symbol);
      
      if (!stock) {
        // 주식이 없으면 새로 생성
        stock = this.stockRepository.create({
          symbol,
          name: symbol, // 기본값으로 심볼 사용
          currentPrice,
          high: highPrice || currentPrice,
          low: lowPrice || currentPrice,
          volume: volume || 0,
        });
      } 
      else {
        // 기존 주식 정보 업데이트
        stock.currentPrice = currentPrice;
        if (highPrice !== null) stock.high = highPrice;
        if (lowPrice !== null) stock.low = lowPrice;
        if (volume !== null) stock.volume = volume;
      }

      return await this.stockRepository.save(stock);
    } 
    catch (error) {
      this.logger.error(`주식 가격 정보 업데이트 실패 (${symbol}):`, error);
      return null;
    }
  }
} 