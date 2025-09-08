import { User } from './user.entity';
import { TradingSignal } from './trading-signal.entity';
import { BacktestResult } from './backtest-result.entity';
import { TradingStrategyConditions, AutoTradingConfig } from '../shared/types/trading-strategy.types';
export declare enum StrategyType {
    MOVING_AVERAGE = "moving_average",
    RSI = "rsi",
    MACD = "macd",
    BOLLINGER_BANDS = "bollinger_bands",
    CUSTOM = "custom"
}
export declare enum StrategyStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PAUSED = "paused"
}
export declare class TradingStrategy {
    id: number;
    userId: number;
    name: string;
    description: string;
    type: StrategyType;
    status: StrategyStatus;
    conditions: TradingStrategyConditions;
    autoTrading: AutoTradingConfig;
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
    lastExecutedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    signals: TradingSignal[];
    backtestResults: BacktestResult[];
}
