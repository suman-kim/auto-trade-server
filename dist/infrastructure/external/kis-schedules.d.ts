import { KisApiService } from "./kis-api.service";
import { EventEmitter } from "events";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/modules/users/users.service";
export declare class KisSchedules extends EventEmitter {
    private readonly config;
    private readonly kisApiService;
    private readonly userService;
    private readonly logger;
    private readonly mode;
    constructor(config: ConfigService, kisApiService: KisApiService, userService: UsersService);
    onModuleInit(): Promise<void>;
    private getOverseasStockPriceEvery3Seconds;
    private getOverseasStockHoldingEvery10Seconds;
}
