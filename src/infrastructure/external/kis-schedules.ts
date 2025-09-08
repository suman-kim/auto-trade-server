import { Injectable } from "@nestjs/common";
import { KisApiService } from "./kis-api.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Logger } from "@nestjs/common";
import { EventEmitter } from "events";
import { EventEmitterType } from "../../shared/types/common-type";
import { ConfigService } from "@nestjs/config";
import { OverseasStockCurrentPriceResponse,OverseasStockHoldingResponse } from "./dto/response/response.dto";
import { UsersService } from "src/modules/users/users.service";
import { User } from "src/entities/user.entity";
@Injectable()
export class KisSchedules extends EventEmitter {
    private readonly logger = new Logger(KisSchedules.name);
    private readonly mode: 'live' | 'demo';

    constructor(
        private readonly config: ConfigService,
        private readonly kisApiService: KisApiService,
        private readonly userService: UsersService,
    ) {
        super();
        this.mode     = (this.config.get<'live'|'demo'>('KIS_MODE') ?? 'demo');
    }


    // 서버 시작시 한 번 실행
    async onModuleInit(): Promise<void> {
        // await this.getOverseasStockPriceEvery3Seconds();
        await this.getOverseasStockHoldingEvery10Seconds();
    }

    //모의 버전에서 웹소켓으로 주가를 가져오지못하기 때문에 스케줄러로 주가를 가져옴
    //CronExpression.EVERY_10_SECONDS
    //@Cron("*/3 * * * * *")
    private async getOverseasStockPriceEvery3Seconds():Promise<void> {
        if(this.mode === 'live'){
            return;
        }
        const data:OverseasStockCurrentPriceResponse|null = await this.kisApiService.getOverseasStockPrice('TSLA');
        if(data){
            this.emit(EventEmitterType.TRADE, data);
        }
    }


    @Cron("*/10 * * * * *")
    private async getOverseasStockHoldingEvery10Seconds():Promise<void> {
        
        const userList:User[] = await this.userService.findAll();

        for(const user of userList){
            const accountNumber = this.mode === 'live' ? user.kisAccountNumber : user.kisDemoAccountNumber;
            const data:OverseasStockHoldingResponse|null = await this.kisApiService.getOverseasStockHolding(accountNumber);
            if(data){
                this.emit(EventEmitterType.BALANCE,{userId:user.id,data});
            }
        }
    }


}