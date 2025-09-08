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
var PortfoliosService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfoliosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const portfolio_entity_1 = require("../../entities/portfolio.entity");
const portfolio_holding_entity_1 = require("../../entities/portfolio-holding.entity");
const stock_entity_1 = require("../../entities/stock.entity");
const stocks_service_1 = require("../stocks/stocks.service");
let PortfoliosService = PortfoliosService_1 = class PortfoliosService {
    portfolioRepository;
    holdingRepository;
    stockRepository;
    stocksService;
    logger = new common_1.Logger(PortfoliosService_1.name);
    constructor(portfolioRepository, holdingRepository, stockRepository, stocksService) {
        this.portfolioRepository = portfolioRepository;
        this.holdingRepository = holdingRepository;
        this.stockRepository = stockRepository;
        this.stocksService = stocksService;
    }
    async getUserPortfolios(userId) {
        const portfolios = await this.portfolioRepository.find({
            where: { userId },
            relations: ['holdings'],
            order: { createdAt: 'DESC' },
        });
        return portfolios;
    }
    async createPortfolio(userId, createPortfolioDto) {
        const portfolio = this.portfolioRepository.create({
            ...createPortfolioDto,
            userId,
        });
        const savedPortfolio = await this.portfolioRepository.save(portfolio);
    }
    async getPortfolio(userId, portfolioId) {
        const portfolio = await this.portfolioRepository.findOne({
            where: { id: portfolioId, userId },
            relations: ['holdings', 'holdings.stock'],
        });
        if (!portfolio) {
            throw new common_1.NotFoundException('포트폴리오를 찾을 수 없습니다.');
        }
        const summary = await this.calculatePortfolioSummary(portfolio);
        return {
            id: portfolio.id,
            name: portfolio.name,
            description: portfolio.description,
            riskLevel: undefined,
            targetReturn: undefined,
            totalValue: summary.totalValue,
            totalCost: summary.totalCost,
            totalReturn: summary.totalReturn,
            totalReturnPercent: summary.totalReturnPercent,
            holdingsCount: summary.holdingsCount,
            createdAt: portfolio.createdAt.toISOString(),
            updatedAt: portfolio.updatedAt.toISOString(),
        };
    }
    async updatePortfolio(userId, portfolioId, updatePortfolioDto) {
        const portfolio = await this.portfolioRepository.findOne({
            where: { id: portfolioId, userId },
        });
        if (!portfolio) {
            throw new common_1.NotFoundException('포트폴리오를 찾을 수 없습니다.');
        }
        Object.assign(portfolio, updatePortfolioDto);
        await this.portfolioRepository.save(portfolio);
        return await this.getPortfolio(userId, portfolioId);
    }
    async updatePortfolioFromKis(userId, portfolioId, data) {
        try {
            const portfolio = await this.portfolioRepository.findOne({
                where: { id: portfolioId, userId },
            });
            if (!portfolio) {
                throw new common_1.NotFoundException('포트폴리오를 찾을 수 없습니다.');
            }
            portfolio.foreignPurchaseAmount1 = parseFloat(data.output2.frcr_pchs_amt1);
            portfolio.totalEvaluationProfitAmount = parseFloat(data.output2.tot_evlu_pfls_amt);
            portfolio.totalProfitRate = parseFloat(data.output2.tot_pftrt);
            portfolio.foreignPurchaseAmountSum1 = parseFloat(data.output2.frcr_buy_amt_smtl1);
            portfolio.foreignPurchaseAmountSum2 = parseFloat(data.output2.frcr_buy_amt_smtl2);
            await this.portfolioRepository.save(portfolio);
        }
        catch (error) {
            this.logger.error('포트폴리오 한국투자증권 API로 업데이트 실패:', error);
            throw new common_1.BadRequestException('포트폴리오 한국투자증권 API로 업데이트 실패');
        }
    }
    async deletePortfolio(userId, portfolioId) {
        const portfolio = await this.portfolioRepository.findOne({
            where: { id: portfolioId, userId },
            relations: ['holdings'],
        });
        if (!portfolio) {
            throw new common_1.NotFoundException('포트폴리오를 찾을 수 없습니다.');
        }
        if (portfolio.holdings.length > 0) {
            throw new common_1.BadRequestException('보유량이 있는 포트폴리오는 삭제할 수 없습니다.');
        }
        await this.portfolioRepository.remove(portfolio);
    }
    async updateHolding(userId, portfolioId, data) {
        try {
            const stock = await this.stocksService.getStockInfo(data.ovrs_pdno);
            if (!stock) {
                throw new common_1.NotFoundException('주식을 찾을 수 없습니다.');
            }
            const holding = await this.holdingRepository.findOne({
                where: { stockId: stock.id, portfolioId: portfolioId },
            });
            if (!holding) {
                throw new common_1.NotFoundException('보유량을 찾을 수 없습니다.');
            }
            holding.quantity = parseFloat(data.ovrs_cblc_qty);
            holding.averagePrice = parseFloat(data.pchs_avg_pric);
            await this.holdingRepository.save(holding);
        }
        catch (err) {
            this.logger.error('포트폴리오 보유량 업데이트 실패:', err);
            throw new common_1.BadRequestException('포트폴리오 보유량 업데이트 실패');
        }
    }
    async removeHolding(userId, portfolioId, holdingId) {
        const holding = await this.holdingRepository.findOne({
            where: { id: holdingId, portfolio: { id: portfolioId, userId } },
            relations: ['portfolio'],
        });
        if (!holding) {
            throw new common_1.NotFoundException('보유량을 찾을 수 없습니다.');
        }
        await this.holdingRepository.remove(holding);
    }
    async getPortfolioHoldings(userId, portfolioId) {
        const holdings = await this.holdingRepository.find({
            where: { portfolio: { id: portfolioId, userId } },
            relations: ['stock'],
            order: { createdAt: 'DESC' },
        });
        return await Promise.all(holdings.map(holding => this.mapHoldingToResponse(holding)));
    }
    async getPortfolioPerformance(userId, portfolioId) {
        const portfolio = await this.portfolioRepository.findOne({
            where: { id: portfolioId, userId },
            relations: ['holdings', 'holdings.stock'],
        });
        if (!portfolio) {
            throw new common_1.NotFoundException('포트폴리오를 찾을 수 없습니다.');
        }
        const summary = await this.calculatePortfolioSummary(portfolio);
        const performance = {
            portfolioId: portfolio.id,
            portfolioName: portfolio.name,
            totalValue: summary.totalValue,
            totalCost: summary.totalCost,
            totalReturn: summary.totalReturn,
            totalReturnPercent: summary.totalReturnPercent,
            dailyReturn: 0,
            dailyReturnPercent: 0,
            weeklyReturn: 0,
            weeklyReturnPercent: 0,
            monthlyReturn: 0,
            monthlyReturnPercent: 0,
            yearlyReturn: 0,
            yearlyReturnPercent: 0,
            sharpeRatio: 0,
            maxDrawdown: 0,
            volatility: 0,
            lastUpdated: portfolio.updatedAt.toISOString(),
        };
        return performance;
    }
    async calculatePortfolioSummary(portfolio) {
        let totalValue = 0;
        let totalCost = 0;
        let holdingsCount = 0;
        for (const holding of portfolio.holdings) {
            const currentPrice = await this.stocksService.getCurrentPrice(holding.stock.symbol);
            const marketValue = holding.quantity * currentPrice;
            const cost = holding.quantity * holding.averagePrice;
            totalValue += marketValue;
            totalCost += cost;
            holdingsCount++;
        }
        const totalReturn = totalValue - totalCost;
        const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;
        return {
            totalValue,
            totalCost,
            totalReturn,
            totalReturnPercent,
            holdingsCount,
        };
    }
    async mapHoldingToResponse(holding) {
        const currentPrice = await this.stocksService.getCurrentPrice(holding.stock.symbol);
        const marketValue = holding.quantity * currentPrice;
        const totalCost = holding.quantity * holding.averagePrice;
        const unrealizedGain = marketValue - totalCost;
        const unrealizedGainPercent = totalCost > 0 ? (unrealizedGain / totalCost) * 100 : 0;
        return {
            id: holding.id,
            symbol: holding.stock.symbol,
            companyName: holding.stock.companyName,
            quantity: holding.quantity,
            averagePrice: holding.averagePrice,
            currentPrice,
            marketValue,
            totalCost,
            unrealizedGain,
            unrealizedGainPercent,
            purchaseDate: holding.createdAt.toISOString(),
            notes: '',
            createdAt: holding.createdAt.toISOString(),
            updatedAt: holding.updatedAt.toISOString(),
        };
    }
    async getUserDefaultPortfolio(userId) {
        try {
            return await this.portfolioRepository.findOne({
                where: { userId },
                order: { createdAt: 'ASC' },
            });
        }
        catch (error) {
            this.logger.error(`사용자 기본 포트폴리오 조회 실패 (${userId}):`, error);
            return null;
        }
    }
    async getAllPortfolios() {
        try {
            return await this.portfolioRepository.find();
        }
        catch (error) {
            this.logger.error('모든 포트폴리오 조회 실패:', error);
            return [];
        }
    }
};
exports.PortfoliosService = PortfoliosService;
exports.PortfoliosService = PortfoliosService = PortfoliosService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(portfolio_entity_1.Portfolio)),
    __param(1, (0, typeorm_1.InjectRepository)(portfolio_holding_entity_1.PortfolioHolding)),
    __param(2, (0, typeorm_1.InjectRepository)(stock_entity_1.Stock)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        stocks_service_1.StocksService])
], PortfoliosService);
//# sourceMappingURL=portfolios.service.js.map