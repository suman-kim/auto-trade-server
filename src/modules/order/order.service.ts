import { Injectable, Logger } from "@nestjs/common";
import { KisApiService } from "../../infrastructure/external/kis-api.service";
import { Stock } from "../../entities/stock.entity";
import { TradingStrategy } from "../../entities/trading-strategy.entity";
import { TradingSignal } from "../../entities/trading-signal.entity";

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);

    constructor(private readonly kisApiService: KisApiService) {}

    async executeOrder(strategy:TradingStrategy, stock:Stock, signal:TradingSignal): Promise<any> {
        try{


        }
        catch(err){
            this.logger.error("Order Service 오류!!",err);
        }
    }
}
