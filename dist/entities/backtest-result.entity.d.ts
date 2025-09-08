import { TradingStrategy } from './trading-strategy.entity';
export declare class BacktestResult {
    id: number;
    strategyId: number;
    name: string;
    startDate: Date;
    endDate: Date;
    initialCapital: number;
    finalCapital: number;
    totalReturn: number;
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    averageWin: number;
    averageLoss: number;
    profitFactor: number;
    createdAt: Date;
    strategy: TradingStrategy;
}
