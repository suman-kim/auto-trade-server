import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Stock } from '../../entities/stock.entity';
import { User } from '../../entities/user.entity';
import { Portfolio } from '../../entities/portfolio.entity';
import { PortfolioHolding } from '../../entities/portfolio-holding.entity';
import { Transaction } from '../../entities/transaction.entity';
import { TradingStrategy } from '../../entities/trading-strategy.entity';
import { TradingStrategiesService } from '../../modules/trading-strategies/trading-strategies.service';
export declare class DatabaseSeedService implements OnModuleInit {
    private stockRepository;
    private userRepository;
    private portfolioRepository;
    private portfolioHoldingRepository;
    private transactionRepository;
    private tradingStrategyRepository;
    private tradingStrategiesService;
    private readonly logger;
    constructor(stockRepository: Repository<Stock>, userRepository: Repository<User>, portfolioRepository: Repository<Portfolio>, portfolioHoldingRepository: Repository<PortfolioHolding>, transactionRepository: Repository<Transaction>, tradingStrategyRepository: Repository<TradingStrategy>, tradingStrategiesService: TradingStrategiesService);
    onModuleInit(): Promise<void>;
    private seedUsers;
    private seedPortfolios;
    private seedStocks;
    private seedPortfolioHoldings;
    private seedTradingStrategies;
}
