import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderService } from "./order.service";
import { KisModule } from "../../infrastructure/external/kis.module";
@Module({
    imports: [TypeOrmModule.forFeature([]),
    KisModule,
    ],
    providers: [OrderService],
    exports: [OrderService],
})
export class OrderModule {}