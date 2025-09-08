import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';
import { PortfolioReturnsService } from './portfolio-returns.service';
import { Portfolio } from '../../entities/portfolio.entity';
import { PortfolioHolding } from '../../entities/portfolio-holding.entity';
import { Stock } from '../../entities/stock.entity';
import { StocksModule } from '../stocks/stocks.module';

/**
 * 포트폴리오 모듈
 * 사용자별 포트폴리오 관리 기능을 제공합니다.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio, PortfolioHolding, Stock]),
    StocksModule,
  ],
  controllers: [PortfoliosController],
  providers: [PortfoliosService, PortfolioReturnsService],
  exports: [PortfoliosService, PortfolioReturnsService],
})
export class PortfoliosModule {} 