import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from '../../entities/stock.entity';
import { User } from '../../entities/user.entity';
import { Portfolio } from '../../entities/portfolio.entity';
import { PortfolioHolding } from '../../entities/portfolio-holding.entity';
import { Transaction } from '../../entities/transaction.entity';
import { TradingStrategy } from '../../entities/trading-strategy.entity';
import { KISStockCode } from '../external/dto/kis-constants';
import { StrategyType } from '../../entities/trading-strategy.entity';
import { TradingStrategiesService } from '../../modules/trading-strategies/trading-strategies.service';
@Injectable()
export class DatabaseSeedService implements OnModuleInit {

  private readonly logger = new Logger(DatabaseSeedService.name);
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
    @InjectRepository(PortfolioHolding)
    private portfolioHoldingRepository: Repository<PortfolioHolding>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TradingStrategy)
    private tradingStrategyRepository: Repository<TradingStrategy>,
    private tradingStrategiesService: TradingStrategiesService,
  ) {}

  async onModuleInit() {
    this.logger.log('🌱 Starting database seeding...');
    //주식 등록
    const stockIds:number[] = await this.seedStocks();

    //사용자 등록
    const userId:number = await this.seedUsers();
    //포트폴리오 등록
    const protfolioId:number = await this.seedPortfolios(userId);

    //포트폴리오 주식 등록
    await this.seedPortfolioHoldings(protfolioId, stockIds);

    //전략 생성
    await this.seedTradingStrategies(userId);


    this.logger.log('✅ Database seeding completed!');
  }

  /**
   * 기본 사용자 등록
   * @returns 사용자 ID
   */
  private async seedUsers():Promise<number> {
    const isUser:User|null = await this.userRepository.findOne({where:{email:'zzsdsdsd@gmail.com'}});
    if (isUser) {
      console.log('Users already exist, skipping...');
      return isUser.id;
    }

    const users = this.userRepository.create([
      {
        id: 1,
        email: 'zzsdsdsd@gmail.com',
        passwordHash: '1234',
        firstName: '수만',
        lastName: '김',
        isActive: true,
        kisAccountNumber: process.env.KIS_ACCOUNT_NUMBER,
        kisDemoAccountNumber: process.env.KIS_MOCK_ACCOUNT_NUMBER,
      },
    ]);
    const user:User[]|null = await this.userRepository.save(users);
    return user[0].id;
  }

  /**
   * 기본 포트폴리오 등록
   * @param userId 사용자 ID
   * @returns 포트폴리오 ID
   */
  private async seedPortfolios(userId:number) {
    const isPortfolio:Portfolio|null = await this.portfolioRepository.findOne({where:{userId:userId}});
    if (isPortfolio) {
      console.log('Portfolios already exist, skipping...');
      return isPortfolio.id;
    }
    const portfolios = this.portfolioRepository.create([
      {
        id: 1,
        name: '기본 포트폴리오',
        description: '기본 포트폴리오',
        userId: userId,
      },
    ]);

    await this.portfolioRepository.save(portfolios);
    console.log(`✅ Created ${portfolios.length} portfolios`);
    return portfolios[0].id;
  }


  /**
   * 기본 주식 등록 (현재 테슬라만 등록)
   * @returns 
   */
  private async seedStocks():Promise<number[]> {
    const existingStocks = await this.stockRepository.find();
    if (existingStocks.length > 0) {
      console.log('Stocks already exist, skipping...');
      return existingStocks.map((stock) => stock.id);
    }

    // KIS 주요 종목 데이터
    const stocks = this.stockRepository.create([
        {
          id: 1,
          symbol: 'TSLA',
          companyName: 'Tesla Inc.',
          name: '테슬라',
          sector: '자동차',
          industry: '자동차',
          exchange: 'NAS',
          currency: 'USD',
          kisNightCode: KISStockCode.TESLA_NIGHT_FREE,
          kisDayCode: KISStockCode.TESLA_DAY,
          currentPrice: 0,
          previousClose: 0,
          high: 0,
          low: 0,
          volume: 0,
          marketCap: 0,
          peRatio: 0,
          dividendYield: 0,
          lastUpdated: new Date(),
        },
      ]);
    
      const stockList:Stock[]|null = await this.stockRepository.save(stocks);
      return stockList.map((stock) => stock.id);
  }

  /**
   * 포트폴리오 주식 등록
   */
  private async seedPortfolioHoldings(protfolioId:number, stockIds:number[]):Promise<void> {
    const portfolioHoldings:PortfolioHolding[] = [];

    const existingPortfolioHoldings = await this.portfolioHoldingRepository.find({where:{portfolioId:protfolioId}});
    for(const stockId of stockIds) {
      if(existingPortfolioHoldings.some((portfolioHolding) => portfolioHolding.stockId === stockId)) {
        continue;
      }

      const portfolioHolding = this.portfolioHoldingRepository.create({
        portfolioId: protfolioId,
        stockId: stockId,
        quantity:0,
        averagePrice: 0,
        totalInvested: 0,
      });

      portfolioHoldings.push(portfolioHolding);
    }
    const portfolioHoldingList:PortfolioHolding[]|null = await this.portfolioHoldingRepository.save(portfolioHoldings);
  }


  /**
   * 전략 생성
   */
  private async seedTradingStrategies(userId:number):Promise<void> {
    
    const existingTradingStrategies = await this.tradingStrategyRepository.find({where:{userId:userId}});
    if (existingTradingStrategies.length > 0) {
      console.log('Trading strategies already exist, skipping...');
      return;
    }

    await this.tradingStrategiesService.createSimpleStrategy(userId, '기본 전략', StrategyType.MOVING_AVERAGE, '기본 전략');
  }



}