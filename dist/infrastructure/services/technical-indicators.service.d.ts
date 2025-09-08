import { Repository } from 'typeorm';
import { Stock } from '../../entities/stock.entity';
import { TechnicalIndicatorsResult, TechnicalIndicatorsConfig } from '../../shared/types/trading-strategy.types';
export declare class TechnicalIndicatorsService {
    private stockRepository;
    private readonly logger;
    constructor(stockRepository: Repository<Stock>);
    calculateRSI(prices: number[], period?: number): number;
    calculateSMA(prices: number[], period: number): number;
    calculateEMA(prices: number[], period: number): number;
    calculateMACD(prices: number[], fastPeriod?: number, slowPeriod?: number, signalPeriod?: number): {
        macd: number;
        signal: number;
        histogram: number;
    };
    private calculateMACDHistory;
    calculateBollingerBands(prices: number[], period?: number, standardDeviations?: number): {
        upper: number;
        middle: number;
        lower: number;
    };
    calculateVolumeMA(volumes: number[], period: number): number;
    calculatePriceChangePercent(currentPrice: number, previousPrice: number): number;
    calculateVolumeChangePercent(currentVolume: number, previousVolume: number): number;
    getRecentPrices(stockId: number, days?: number): Promise<number[]>;
    getRecentVolumes(stockId: number, days?: number): Promise<number[]>;
    calculateAllIndicators(stockId: number, indicators: TechnicalIndicatorsConfig): Promise<TechnicalIndicatorsResult>;
}
