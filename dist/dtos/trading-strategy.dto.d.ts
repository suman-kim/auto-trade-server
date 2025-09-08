import { StrategyType, StrategyStatus, SignalType } from '../shared/types/trading-strategy.types';
export declare class RsiConditionDto {
    period: number;
    oversold: number;
    overbought: number;
}
export declare class MovingAverageConditionDto {
    shortPeriod: number;
    longPeriod: number;
    type: 'sma' | 'ema';
}
export declare class MacdConditionDto {
    fastPeriod: number;
    slowPeriod: number;
    signalPeriod: number;
}
export declare class BollingerBandsConditionDto {
    period: number;
    standardDeviations: number;
}
export declare class IndicatorConditionsDto {
    rsi?: RsiConditionDto;
    movingAverage?: MovingAverageConditionDto;
    macd?: MacdConditionDto;
    bollingerBands?: BollingerBandsConditionDto;
}
export declare class TradingHoursDto {
    start: string;
    end: string;
}
export declare class PriceConditionsDto {
    minPrice?: number;
    maxPrice?: number;
    priceChangePercent?: number;
}
export declare class VolumeConditionsDto {
    minVolume?: number;
    volumeChangePercent?: number;
}
export declare class TimeConditionsDto {
    tradingHours?: TradingHoursDto;
    excludeWeekends?: boolean;
}
export declare class AutoTradingDto {
    enabled: boolean;
    maxPositionSize: number;
    stopLoss: number;
    takeProfit: number;
    maxDailyTrades: number;
    riskPerTrade: number;
}
export declare class TradingConditionsDto {
    indicators?: IndicatorConditionsDto;
    priceConditions?: PriceConditionsDto;
    volumeConditions?: VolumeConditionsDto;
    timeConditions?: TimeConditionsDto;
}
export declare class CreateTradingStrategyDto {
    name: string;
    description?: string;
    type: StrategyType;
    conditions: TradingConditionsDto;
    autoTrading: AutoTradingDto;
}
export declare class UpdateTradingStrategyDto {
    name?: string;
    description?: string;
    type?: StrategyType;
    conditions?: TradingConditionsDto;
    autoTrading?: AutoTradingDto;
    status?: StrategyStatus;
}
export declare class UpdateStrategyStatusDto {
    status: StrategyStatus;
}
export declare class BacktestRequestDto {
    name: string;
    startDate: string;
    endDate: string;
    initialCapital: number;
    stockSymbols?: string[];
}
export declare class TradingSignalDto {
    id: number;
    signalType: SignalType;
    stockSymbol: string;
    price: number;
    volume: number;
    indicators?: {
        rsi?: number;
        movingAverage?: {
            short: number;
            long: number;
        };
        macd?: {
            macd: number;
            signal: number;
            histogram: number;
        };
        bollingerBands?: {
            upper: number;
            middle: number;
            lower: number;
        };
    };
    reason?: string;
    confidence?: number;
    executed: boolean;
    createdAt: string;
}
export declare class BacktestResultDto {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    totalReturn: number;
    annualizedReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
    winRate: number;
    totalTrades: number;
    profitableTrades: number;
    averageWin: number;
    averageLoss: number;
    profitFactor: number;
    initialCapital: number;
    finalCapital: number;
    monthlyReturns?: {
        [key: string]: number;
    };
    createdAt: string;
}
export declare class StrategyPerformanceDto {
    id: number;
    name: string;
    type: StrategyType;
    status: StrategyStatus;
    backtestSummary?: {
        totalReturn: number;
        annualizedReturn: number;
        maxDrawdown: number;
        sharpeRatio: number;
        winRate: number;
        totalTrades: number;
        profitableTrades: number;
        averageWin: number;
        averageLoss: number;
        profitFactor: number;
    };
    totalSignals: number;
    executedSignals: number;
    lastExecutedAt?: string;
    createdAt: string;
}
