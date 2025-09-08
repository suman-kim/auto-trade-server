import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { KisApiService } from '../../infrastructure/external/kis-api.service';
import { Stock } from '../../entities/stock.entity';

/**
 * 주식 모듈
 * 주식 데이터 관리 및 외부 API 연동 기능을 제공합니다.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Stock]),
  ],
  controllers: [StocksController],
  providers: [
    StocksService,
  ],
  exports: [
    StocksService,
  ],
})
export class StocksModule {} 