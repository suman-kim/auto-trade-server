import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from '../../entities/stock.entity';
import { TechnicalIndicatorsResult, TechnicalIndicatorsConfig } from '../../shared/types/trading-strategy.types';

/**
 * 기술적 지표 계산 서비스
 * 주식 데이터를 기반으로 다양한 기술적 지표를 계산합니다.
 */
@Injectable()
export class TechnicalIndicatorsService {
  private readonly logger = new Logger(TechnicalIndicatorsService.name);

  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  /**
   * RSI (Relative Strength Index) 계산
   * @param prices 가격 배열 (최신 가격이 마지막)
   * @param period RSI 계산 기간 (기본값: 14)
   * @returns RSI 값 (0-100)
   */
  calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) {
      return 50; // 데이터가 부족한 경우 중립값 반환
    }

    const gains: number[] = [];
    const losses: number[] = [];

    // 가격 변화 계산
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }

    // 평균 이득과 손실 계산
    const avgGain = this.calculateEMA(gains, period);
    const avgLoss = this.calculateEMA(losses, period);

    if (avgLoss === 0) {
      return 100;
    }

    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return Math.round(rsi * 100) / 100; // 소수점 2자리까지 반올림
  }

  /**
   * 단순 이동평균 (SMA) 계산
   * @param prices 가격 배열
   * @param period 이동평균 기간
   * @returns 이동평균 값
   */
  calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) {
      return prices[prices.length - 1] || 0;
    }

    const sum = prices.slice(-period).reduce((acc, price) => acc + price, 0);
    return Math.round((sum / period) * 100) / 100;
  }

  /**
   * 지수 이동평균 (EMA) 계산
   * @param prices 가격 배열
   * @param period 이동평균 기간
   * @returns 지수 이동평균 값
   */
  calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) {
      return prices[prices.length - 1] || 0;
    }

    const multiplier = 2 / (period + 1);
    let ema = prices[0];

    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }

    return Math.round(ema * 100) / 100;
  }

  /**
   * MACD (Moving Average Convergence Divergence) 계산
   * @param prices 가격 배열
   * @param fastPeriod 빠른 이동평균 기간 (기본값: 12)
   * @param slowPeriod 느린 이동평균 기간 (기본값: 26)
   * @param signalPeriod 신호선 기간 (기본값: 9)
   * @returns MACD 객체
   */
  calculateMACD(
    prices: number[], 
    fastPeriod: number = 12, 
    slowPeriod: number = 26, 
    signalPeriod: number = 9
  ): { macd: number; signal: number; histogram: number } {
    if (prices.length < slowPeriod) {
      return { macd: 0, signal: 0, histogram: 0 };
    }

    const fastEMA = this.calculateEMA(prices, fastPeriod);
    const slowEMA = this.calculateEMA(prices, slowPeriod);
    const macd = fastEMA - slowEMA;

    // MACD 히스토리를 사용하여 신호선 계산
    const macdHistory = this.calculateMACDHistory(prices, fastPeriod, slowPeriod);
    const signal = this.calculateEMA(macdHistory, signalPeriod);
    const histogram = macd - signal;

    return {
      macd: Math.round(macd * 100) / 100,
      signal: Math.round(signal * 100) / 100,
      histogram: Math.round(histogram * 100) / 100,
    };
  }

  /**
   * MACD 히스토리 계산
   */
  private calculateMACDHistory(prices: number[], fastPeriod: number, slowPeriod: number): number[] {
    const macdHistory: number[] = [];
    
    for (let i = slowPeriod - 1; i < prices.length; i++) {
      const periodPrices = prices.slice(0, i + 1);
      const fastEMA = this.calculateEMA(periodPrices, fastPeriod);
      const slowEMA = this.calculateEMA(periodPrices, slowPeriod);
      macdHistory.push(fastEMA - slowEMA);
    }

    return macdHistory;
  }

  /**
   * 볼린저 밴드 계산
   * @param prices 가격 배열
   * @param period 이동평균 기간 (기본값: 20)
   * @param standardDeviations 표준편차 배수 (기본값: 2)
   * @returns 볼린저 밴드 객체
   */
  calculateBollingerBands(
    prices: number[], 
    period: number = 20, 
    standardDeviations: number = 2
  ): { upper: number; middle: number; lower: number } {
    if (prices.length < period) {
      const currentPrice = prices[prices.length - 1] || 0;
      return { upper: currentPrice, middle: currentPrice, lower: currentPrice };
    }

    const periodPrices = prices.slice(-period);
    const middle = this.calculateSMA(periodPrices, period);
    
    // 표준편차 계산
    const variance = periodPrices.reduce((acc, price) => {
      return acc + Math.pow(price - middle, 2);
    }, 0) / period;
    
    const standardDeviation = Math.sqrt(variance);
    const upper = middle + (standardDeviation * standardDeviations);
    const lower = middle - (standardDeviation * standardDeviations);

    return {
      upper: Math.round(upper * 100) / 100,
      middle: Math.round(middle * 100) / 100,
      lower: Math.round(lower * 100) / 100,
    };
  }

  /**
   * 거래량 이동평균 계산
   * @param volumes 거래량 배열
   * @param period 이동평균 기간
   * @returns 거래량 이동평균
   */
  calculateVolumeMA(volumes: number[], period: number): number {
    if (volumes.length < period) {
      return volumes[volumes.length - 1] || 0;
    }

    const sum = volumes.slice(-period).reduce((acc, volume) => acc + volume, 0);
    return Math.round(sum / period);
  }

  /**
   * 가격 변화율 계산
   * @param currentPrice 현재 가격
   * @param previousPrice 이전 가격
   * @returns 변화율 (%)
   */
  calculatePriceChangePercent(currentPrice: number, previousPrice: number): number {
    if (previousPrice === 0) return 0;
    return Math.round(((currentPrice - previousPrice) / previousPrice) * 100 * 100) / 100;
  }

  /**
   * 거래량 변화율 계산
   * @param currentVolume 현재 거래량
   * @param previousVolume 이전 거래량
   * @returns 변화율 (%)
   */
  calculateVolumeChangePercent(currentVolume: number, previousVolume: number): number {
    if (previousVolume === 0) return 0;
    return Math.round(((currentVolume - previousVolume) / previousVolume) * 100 * 100) / 100;
  }

  /**
   * 주식의 최근 가격 데이터 조회
   * @param stockId 주식 ID
   * @param days 조회할 일수
   * @returns 가격 배열
   */
  async getRecentPrices(stockId: number, days: number = 30): Promise<number[]> {
    // 실제 구현에서는 주식 가격 히스토리 테이블에서 조회
    // 현재는 간단한 구현으로 대체
    const stock = await this.stockRepository.findOne({ where: { id: stockId } });
    if (!stock) return [];

    // 실제로는 히스토리 데이터를 조회해야 함
    // 현재는 현재 가격을 반복하여 배열 생성
    return Array(days).fill(stock.currentPrice);
  }

  /**
   * 주식의 최근 거래량 데이터 조회
   * @param stockId 주식 ID
   * @param days 조회할 일수
   * @returns 거래량 배열
   */
  async getRecentVolumes(stockId: number, days: number = 30): Promise<number[]> {
    // 실제 구현에서는 주식 거래량 히스토리 테이블에서 조회
    const stock = await this.stockRepository.findOne({ where: { id: stockId } });
    if (!stock) return [];

    // 실제로는 히스토리 데이터를 조회해야 함
    return Array(days).fill(stock.volume || 0);
  }

  /**
   * 종합 기술적 지표 계산
   * @param stockId 주식 ID
   * @param indicators 계산할 지표 설정
   * @returns 계산된 지표들
   */
  async calculateAllIndicators(stockId: number, indicators: TechnicalIndicatorsConfig): Promise<TechnicalIndicatorsResult> {
    const result: TechnicalIndicatorsResult = {};

    try {
      // RSI 계산
      if (indicators.rsi) {
        const prices = await this.getRecentPrices(stockId, indicators.rsi.period + 10);
        result.rsi = this.calculateRSI(prices, indicators.rsi.period);
      }

      // 이동평균 계산
      if (indicators.movingAverage) {
        this.logger.debug(`이동평균 계산: ${JSON.stringify(indicators.movingAverage)}`);
        const prices = await this.getRecentPrices(stockId, indicators.movingAverage.longPeriod + 10);
        if (indicators.movingAverage.type === 'sma') {
          result.shortMA = this.calculateSMA(prices, indicators.movingAverage.shortPeriod);
          result.longMA = this.calculateSMA(prices, indicators.movingAverage.longPeriod);
        } else {
          result.shortMA = this.calculateEMA(prices, indicators.movingAverage.shortPeriod);
          result.longMA = this.calculateEMA(prices, indicators.movingAverage.longPeriod);
        }
      }

      // MACD 계산
      if (indicators.macd) {
        const prices = await this.getRecentPrices(stockId, indicators.macd.slowPeriod + 20);
        result.macd = this.calculateMACD(
          prices, 
          indicators.macd.fastPeriod, 
          indicators.macd.slowPeriod, 
          indicators.macd.signalPeriod
        );
      }

      // 볼린저 밴드 계산
      if (indicators.bollingerBands) {
        const prices = await this.getRecentPrices(stockId, indicators.bollingerBands.period + 10);
        result.bollingerBands = this.calculateBollingerBands(
          prices, 
          indicators.bollingerBands.period, 
          indicators.bollingerBands.standardDeviations
        );
      }

      // 거래량 이동평균
      if (indicators.volumeMA) {
        const volumes = await this.getRecentVolumes(stockId, indicators.volumeMA.period + 10);
        result.volumeMA = this.calculateVolumeMA(volumes, indicators.volumeMA.period);
      }

    } catch (error) {
      this.logger.error(`지표 계산 중 오류 발생: ${error.message}`);
    }

    return result;
  }
} 