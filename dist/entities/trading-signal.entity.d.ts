import { TradingStrategy } from './trading-strategy.entity';
import { Stock } from './stock.entity';
import { SignalType } from '../shared/types/trading-strategy.types';
export declare class TradingSignal {
    id: number;
    strategyId: number;
    stockId: number;
    signalType: SignalType;
    confidence: number;
    price: number;
    volume: number;
    indicators: any;
    executed: boolean;
    executedAt: Date | null;
    createdAt: Date;
    strategy: TradingStrategy;
    stock: Stock;
}
