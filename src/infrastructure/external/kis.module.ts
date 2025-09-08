import { Module } from "@nestjs/common";
import { KisApiService } from "./kis-api.service";
import { KisWebSocketService } from "./kis-websocket.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Stock } from "../../entities/stock.entity";
import { KisSchedules } from "./kis-schedules";
import { UsersModule } from "src/modules/users/users.module";
@Module({
    imports:[
        TypeOrmModule.forFeature([Stock]),
        UsersModule,
    ],
    providers: [KisApiService,KisWebSocketService, KisSchedules],
    exports: [KisApiService,KisWebSocketService,KisSchedules],
})
export class KisModule {}