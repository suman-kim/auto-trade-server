import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from '../../entities/transaction.entity';
import { User } from '../../entities/user.entity';
import { Portfolio } from '../../entities/portfolio.entity';
import { Stock } from '../../entities/stock.entity';

/**
 * 거래 내역 모듈
 * 거래 내역 관리 및 분석 기능을 제공합니다.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, Portfolio, Stock]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {} 