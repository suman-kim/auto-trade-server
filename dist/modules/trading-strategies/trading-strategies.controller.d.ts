import { TradingStrategiesService } from './trading-strategies.service';
import { UpdateTradingStrategyDto } from '../../dtos/trading-strategy.dto';
import { StrategyType } from '../../entities/trading-strategy.entity';
export declare class TradingStrategiesController {
    private readonly tradingStrategiesService;
    constructor(tradingStrategiesService: TradingStrategiesService);
    createSimpleStrategy(userId: number, simpleStrategyDto: {
        name: string;
        strategyType?: StrategyType;
        description?: string;
    }): Promise<import("../../entities/trading-strategy.entity").TradingStrategy>;
    getUserStrategies(userId: number): Promise<import("../../entities/trading-strategy.entity").TradingStrategy[]>;
    getStrategy(userId: number, strategyId: number): Promise<import("../../entities/trading-strategy.entity").TradingStrategy>;
    updateStrategy(userId: number, strategyId: number, updateStrategyDto: UpdateTradingStrategyDto): Promise<import("../../entities/trading-strategy.entity").TradingStrategy>;
    deleteStrategy(userId: number, strategyId: number): Promise<{
        message: string;
    }>;
    toggleStrategy(userId: number, strategyId: number): Promise<import("../../entities/trading-strategy.entity").TradingStrategy>;
    getStrategySignals(userId: number, strategyId: number): Promise<import("../../entities").TradingSignal[]>;
}
