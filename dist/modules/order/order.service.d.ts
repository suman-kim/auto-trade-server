import { KisApiService } from "../../infrastructure/external/kis-api.service";
import { Stock } from "../../entities/stock.entity";
import { TradingStrategy } from "../../entities/trading-strategy.entity";
import { TradingSignal } from "../../entities/trading-signal.entity";
export declare class OrderService {
    private readonly kisApiService;
    private readonly logger;
    constructor(kisApiService: KisApiService);
    executeOrder(strategy: TradingStrategy, stock: Stock, signal: TradingSignal): Promise<any>;
}
