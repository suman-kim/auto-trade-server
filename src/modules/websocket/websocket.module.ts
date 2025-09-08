import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradingWebSocketGateway } from './websocket.gateway';
import { KisWebSocketService } from '../../infrastructure/external/kis-websocket.service';
import { RealtimeEngineService } from './realtime-engine.service';
import { JwtModule } from '@nestjs/jwt';
import { KisApiService } from '../../infrastructure/external/kis-api.service';
import { KisModule } from '../../infrastructure/external/kis.module';
import { TechnicalIndicatorsService } from '../../infrastructure/services/technical-indicators.service';
import { TradingStrategiesModule } from '../trading-strategies/trading-strategies.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { StocksModule } from '../stocks/stocks.module';
import { PortfoliosModule } from '../portfolios/portfolios.module';
import { Portfolio } from '../../entities/portfolio.entity';
import { PortfolioHolding } from '../../entities/portfolio-holding.entity';
import { Stock } from '../../entities/stock.entity';
import { Transaction } from '../../entities/transaction.entity';
import { OrderModule } from '../order/order.module';
import { UsersModule } from '../users/users.module';
/**
 * WebSocket 모듈
 * 실시간 통신을 위한 WebSocket Gateway와 관련 서비스들을 관리
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio, PortfolioHolding, Stock, Transaction]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    KisModule,
    TradingStrategiesModule,
    TransactionsModule,
    StocksModule,
    PortfoliosModule,
    OrderModule,
    UsersModule
  ],
  controllers: [],
  providers: [
    TradingWebSocketGateway,
    RealtimeEngineService,
    TechnicalIndicatorsService,
  ],
  exports: [
    TradingWebSocketGateway,
    RealtimeEngineService,
  ],
})
export class WebSocketModule {} 