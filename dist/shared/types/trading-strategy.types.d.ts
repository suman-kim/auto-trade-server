export interface RsiConfig {
    period: number;
    oversold: number;
    overbought: number;
}
export interface MovingAverageConfig {
    shortPeriod: number;
    longPeriod: number;
    type: 'sma' | 'ema';
}
export interface MacdConfig {
    fastPeriod: number;
    slowPeriod: number;
    signalPeriod: number;
}
export interface BollingerBandsConfig {
    period: number;
    standardDeviations: number;
}
export interface TechnicalIndicatorsConfig {
    rsi?: RsiConfig;
    movingAverage?: MovingAverageConfig;
    macd?: MacdConfig;
    bollingerBands?: BollingerBandsConfig;
    volumeMA?: {
        period: number;
    };
}
export interface PriceConditions {
    minPrice?: number;
    maxPrice?: number;
    priceChangePercent?: number;
}
export interface VolumeConditions {
    minVolume?: number;
    volumeChangePercent?: number;
}
export interface TradingHours {
    start: string;
    end: string;
}
export interface TimeConditions {
    tradingHours?: TradingHours;
    excludeWeekends?: boolean;
}
export interface TradingStrategyConditions {
    indicators?: TechnicalIndicatorsConfig;
    priceConditions?: PriceConditions;
    volumeConditions?: VolumeConditions;
    timeConditions?: TimeConditions;
}
export interface AutoTradingConfig {
    enabled: boolean;
    maxDailyTrades: number;
    maxPositionSize: number;
    riskPerTrade: number;
    minConfidence: number;
    stopLoss: number;
    takeProfit: number;
}
export declare enum SignalType {
    BUY = "BUY",
    SELL = "SELL",
    HOLD = "HOLD"
}
export declare enum StrategyStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PAUSED = "paused"
}
export declare enum StrategyType {
    MOMENTUM = "momentum",
    MEAN_REVERSION = "mean_reversion",
    BREAKOUT = "breakout",
    SCALPING = "scalping",
    SWING = "swing"
}
export interface TechnicalIndicatorsResult {
    rsi?: number;
    shortMA?: number;
    longMA?: number;
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
    volumeMA?: number;
}
export interface SignalGenerationResult {
    signalType: SignalType;
    confidence: number;
    reason?: string;
}
export interface OrderValidationResult {
    isValid: boolean;
    reason?: string;
    adjustedQuantity?: number;
}
