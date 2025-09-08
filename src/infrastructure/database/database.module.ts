import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Stock, Portfolio, PortfolioHolding, Transaction, TradingStrategy, TradingSignal, BacktestResult, Notification, PriceAlert } from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'suman',
      password: '',
      database: process.env.NODE_ENV === 'live' ? 'auto_trade_db' : 'auto_trade_mock_db',
      entities: [User, 
        Stock, 
        Portfolio, 
        PortfolioHolding, 
        Transaction, 
        TradingStrategy, 
        TradingSignal, 
        BacktestResult, 
        Notification, 
        PriceAlert,
        ],
      synchronize: true, // 개발 환경에서만 true
      logging: true,
    }),
  ],
})
export class DatabaseModule {} 