"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DatabaseSeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stock_entity_1 = require("../../entities/stock.entity");
const user_entity_1 = require("../../entities/user.entity");
const portfolio_entity_1 = require("../../entities/portfolio.entity");
const portfolio_holding_entity_1 = require("../../entities/portfolio-holding.entity");
const transaction_entity_1 = require("../../entities/transaction.entity");
const trading_strategy_entity_1 = require("../../entities/trading-strategy.entity");
const kis_constants_1 = require("../external/dto/kis-constants");
const trading_strategy_entity_2 = require("../../entities/trading-strategy.entity");
const trading_strategies_service_1 = require("../../modules/trading-strategies/trading-strategies.service");
let DatabaseSeedService = DatabaseSeedService_1 = class DatabaseSeedService {
    stockRepository;
    userRepository;
    portfolioRepository;
    portfolioHoldingRepository;
    transactionRepository;
    tradingStrategyRepository;
    tradingStrategiesService;
    logger = new common_1.Logger(DatabaseSeedService_1.name);
    constructor(stockRepository, userRepository, portfolioRepository, portfolioHoldingRepository, transactionRepository, tradingStrategyRepository, tradingStrategiesService) {
        this.stockRepository = stockRepository;
        this.userRepository = userRepository;
        this.portfolioRepository = portfolioRepository;
        this.portfolioHoldingRepository = portfolioHoldingRepository;
        this.transactionRepository = transactionRepository;
        this.tradingStrategyRepository = tradingStrategyRepository;
        this.tradingStrategiesService = tradingStrategiesService;
    }
    async onModuleInit() {
        this.logger.log('🌱 Starting database seeding...');
        const stockIds = await this.seedStocks();
        const userId = await this.seedUsers();
        const protfolioId = await this.seedPortfolios(userId);
        await this.seedPortfolioHoldings(protfolioId, stockIds);
        await this.seedTradingStrategies(userId);
        this.logger.log('✅ Database seeding completed!');
    }
    async seedUsers() {
        const isUser = await this.userRepository.findOne({ where: { email: 'zzsdsdsd@gmail.com' } });
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
                kisAccountNumber: "4314217701",
                kisDemoAccountNumber: "5015196301",
            },
        ]);
        const user = await this.userRepository.save(users);
        return user[0].id;
    }
    async seedPortfolios(userId) {
        const isPortfolio = await this.portfolioRepository.findOne({ where: { userId: userId } });
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
    async seedStocks() {
        const existingStocks = await this.stockRepository.find();
        if (existingStocks.length > 0) {
            console.log('Stocks already exist, skipping...');
            return existingStocks.map((stock) => stock.id);
        }
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
                kisNightCode: kis_constants_1.KISStockCode.TESLA_NIGHT_FREE,
                kisDayCode: kis_constants_1.KISStockCode.TESLA_DAY,
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
        const stockList = await this.stockRepository.save(stocks);
        return stockList.map((stock) => stock.id);
    }
    async seedPortfolioHoldings(protfolioId, stockIds) {
        const portfolioHoldings = [];
        const existingPortfolioHoldings = await this.portfolioHoldingRepository.find({ where: { portfolioId: protfolioId } });
        for (const stockId of stockIds) {
            if (existingPortfolioHoldings.some((portfolioHolding) => portfolioHolding.stockId === stockId)) {
                continue;
            }
            const portfolioHolding = this.portfolioHoldingRepository.create({
                portfolioId: protfolioId,
                stockId: stockId,
                quantity: 0,
                averagePrice: 0,
                totalInvested: 0,
            });
            portfolioHoldings.push(portfolioHolding);
        }
        const portfolioHoldingList = await this.portfolioHoldingRepository.save(portfolioHoldings);
    }
    async seedTradingStrategies(userId) {
        const existingTradingStrategies = await this.tradingStrategyRepository.find({ where: { userId: userId } });
        if (existingTradingStrategies.length > 0) {
            console.log('Trading strategies already exist, skipping...');
            return;
        }
        await this.tradingStrategiesService.createSimpleStrategy(userId, '기본 전략', trading_strategy_entity_2.StrategyType.MOVING_AVERAGE, '기본 전략');
    }
};
exports.DatabaseSeedService = DatabaseSeedService;
exports.DatabaseSeedService = DatabaseSeedService = DatabaseSeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stock_entity_1.Stock)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(portfolio_entity_1.Portfolio)),
    __param(3, (0, typeorm_1.InjectRepository)(portfolio_holding_entity_1.PortfolioHolding)),
    __param(4, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(5, (0, typeorm_1.InjectRepository)(trading_strategy_entity_1.TradingStrategy)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        trading_strategies_service_1.TradingStrategiesService])
], DatabaseSeedService);
//# sourceMappingURL=database-seed.service.js.map