import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { StocksModule } from './modules/stocks/stocks.module';
import { PortfoliosModule } from './modules/portfolios/portfolios.module';
import { TradingStrategiesModule } from './modules/trading-strategies/trading-strategies.module';
import { WebSocketModule } from './modules/websocket/websocket.module';

import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { SecurityMiddleware } from './shared/middleware/security.middleware';
import { ConfigModule } from '@nestjs/config';
import { DatabaseSeedModule } from './infrastructure/config/database-seed.module';
import { ScheduleModule } from '@nestjs/schedule';
import { KisModule } from './infrastructure/external/kis.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    StocksModule,
    PortfoliosModule,
    TradingStrategiesModule,
    WebSocketModule,
    MonitoringModule,
    DatabaseSeedModule,
    KisModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SecurityMiddleware)
      .forRoutes('*');
  }
}
