import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradingStrategiesController } from './trading-strategies.controller';
import { TradingStrategiesService } from './trading-strategies.service';
import { TradingStrategy } from '../../entities/trading-strategy.entity';
import { TradingSignal } from '../../entities/trading-signal.entity';
import { BacktestResult } from '../../entities/backtest-result.entity';
import { Stock } from '../../entities/stock.entity';
import { User } from '../../entities/user.entity';
import { KisApiService } from '../../infrastructure/external/kis-api.service';
import { TechnicalIndicatorsService } from '../../infrastructure/services/technical-indicators.service';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TradingStrategy,
      TradingSignal,
      BacktestResult,
      Stock,
      User,
    ])
  ],
  controllers: [TradingStrategiesController],
  providers: [TradingStrategiesService,KisApiService,TechnicalIndicatorsService],
  exports: [TradingStrategiesService],
})
export class TradingStrategiesModule {} 