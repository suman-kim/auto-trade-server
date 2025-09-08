import { Module } from "@nestjs/common";
import { DatabaseSeedService } from "./database-seed.service";
import { StocksModule } from "../../modules/stocks/stocks.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Stock } from "../../entities/stock.entity";
import { User} from "../../entities/user.entity";
import { Portfolio } from "../../entities/portfolio.entity";
import { PortfolioHolding } from "../../entities/portfolio-holding.entity";
import { Transaction } from "../../entities/transaction.entity";
import { TradingStrategy } from "../../entities/trading-strategy.entity";
import { UsersModule } from "../../modules/users/users.module";
import { PortfoliosModule } from "../../modules/portfolios/portfolios.module";
import { TransactionsModule } from "../../modules/transactions/transactions.module";
import { TradingStrategiesModule } from "../../modules/trading-strategies/trading-strategies.module";
@Module({
    imports:[
        TypeOrmModule.forFeature([Stock, User, Portfolio, PortfolioHolding, Transaction, TradingStrategy]),
        StocksModule,
        UsersModule,
        PortfoliosModule,
        TransactionsModule,
        TradingStrategiesModule,
    ],
  providers: [DatabaseSeedService]
})
export class DatabaseSeedModule {}