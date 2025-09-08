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
var PortfolioReturnsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioReturnsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const portfolio_entity_1 = require("../../entities/portfolio.entity");
const portfolio_holding_entity_1 = require("../../entities/portfolio-holding.entity");
const stock_entity_1 = require("../../entities/stock.entity");
const stocks_service_1 = require("../stocks/stocks.service");
let PortfolioReturnsService = PortfolioReturnsService_1 = class PortfolioReturnsService {
    portfolioRepository;
    holdingRepository;
    stockRepository;
    stocksService;
    logger = new common_1.Logger(PortfolioReturnsService_1.name);
    constructor(portfolioRepository, holdingRepository, stockRepository, stocksService) {
        this.portfolioRepository = portfolioRepository;
        this.holdingRepository = holdingRepository;
        this.stockRepository = stockRepository;
        this.stocksService = stocksService;
    }
    async calculatePortfolioReturns(portfolioId) {
        const portfolio = await this.portfolioRepository.findOne({
            where: { id: portfolioId },
            relations: ['holdings', 'holdings.stock'],
        });
        if (!portfolio) {
            throw new Error('포트폴리오를 찾을 수 없습니다.');
        }
        let totalValue = 0;
        let totalCost = 0;
        for (const holding of portfolio.holdings) {
            const currentPrice = await this.stocksService.getCurrentPrice(holding.stock.symbol);
            const marketValue = holding.quantity * currentPrice;
            const cost = holding.quantity * holding.averagePrice;
            totalValue += marketValue;
            totalCost += cost;
        }
        const totalReturn = totalValue - totalCost;
        const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;
        return {
            totalValue,
            totalCost,
            totalReturn,
            totalReturnPercent,
            unrealizedGain: totalReturn,
            unrealizedGainPercent: totalReturnPercent,
        };
    }
    async calculateHoldingReturns(holdingId) {
        const holding = await this.holdingRepository.findOne({
            where: { id: holdingId },
            relations: ['stock'],
        });
        if (!holding) {
            throw new Error('보유량을 찾을 수 없습니다.');
        }
        const currentPrice = await this.stocksService.getCurrentPrice(holding.stock.symbol);
        const marketValue = holding.quantity * currentPrice;
        const totalCost = holding.quantity * holding.averagePrice;
        const unrealizedGain = marketValue - totalCost;
        const unrealizedGainPercent = totalCost > 0 ? (unrealizedGain / totalCost) * 100 : 0;
        return {
            symbol: holding.stock.symbol,
            quantity: holding.quantity,
            averagePrice: holding.averagePrice,
            currentPrice,
            marketValue,
            totalCost,
            unrealizedGain,
            unrealizedGainPercent,
            returnRate: unrealizedGainPercent,
        };
    }
    async calculatePortfolioRiskMetrics(portfolioId) {
        const returns = await this.calculatePortfolioReturns(portfolioId);
        const volatility = Math.abs(returns.totalReturnPercent) * 0.1;
        const riskFreeRate = 2.5;
        const sharpeRatio = returns.totalReturnPercent > riskFreeRate
            ? (returns.totalReturnPercent - riskFreeRate) / volatility
            : 0;
        const maxDrawdown = returns.totalReturnPercent < 0 ? Math.abs(returns.totalReturnPercent) : 0;
        const beta = 1.0;
        const alpha = returns.totalReturnPercent - (riskFreeRate + beta * 8);
        return {
            volatility,
            sharpeRatio,
            maxDrawdown,
            beta,
            alpha,
        };
    }
    async compareWithBenchmark(portfolioId, benchmarkSymbol = 'SPY') {
        const portfolioReturns = await this.calculatePortfolioReturns(portfolioId);
        const benchmarkReturn = 8.5;
        const excessReturn = portfolioReturns.totalReturnPercent - benchmarkReturn;
        const trackingError = Math.abs(excessReturn) * 0.15;
        const informationRatio = trackingError > 0 ? excessReturn / trackingError : 0;
        return {
            portfolioReturn: portfolioReturns.totalReturnPercent,
            benchmarkReturn,
            excessReturn,
            trackingError,
            informationRatio,
        };
    }
    async analyzeAssetAllocation(portfolioId) {
        const portfolio = await this.portfolioRepository.findOne({
            where: { id: portfolioId },
            relations: ['holdings', 'holdings.stock'],
        });
        if (!portfolio) {
            throw new Error('포트폴리오를 찾을 수 없습니다.');
        }
        let totalValue = 0;
        const allocations = [];
        for (const holding of portfolio.holdings) {
            const currentPrice = await this.stocksService.getCurrentPrice(holding.stock.symbol);
            const marketValue = holding.quantity * currentPrice;
            totalValue += marketValue;
            allocations.push({
                symbol: holding.stock.symbol,
                value: marketValue,
                percentage: 0,
                sector: holding.stock.sector,
            });
        }
        allocations.forEach(allocation => {
            allocation.percentage = totalValue > 0 ? (allocation.value / totalValue) * 100 : 0;
        });
        const sectorAllocation = {};
        allocations.forEach(allocation => {
            if (allocation.sector) {
                sectorAllocation[allocation.sector] =
                    (sectorAllocation[allocation.sector] || 0) + allocation.percentage;
            }
        });
        return {
            totalValue,
            allocations,
            sectorAllocation,
        };
    }
    async analyzeReturnDistribution(portfolioId) {
        const portfolio = await this.portfolioRepository.findOne({
            where: { id: portfolioId },
            relations: ['holdings', 'holdings.stock'],
        });
        if (!portfolio) {
            throw new Error('포트폴리오를 찾을 수 없습니다.');
        }
        const returns = [];
        let profitableHoldings = 0;
        let losingHoldings = 0;
        for (const holding of portfolio.holdings) {
            const holdingReturns = await this.calculateHoldingReturns(holding.id);
            returns.push(holdingReturns);
            if (holdingReturns.unrealizedGain > 0) {
                profitableHoldings++;
            }
            else {
                losingHoldings++;
            }
        }
        if (returns.length === 0) {
            return {
                profitableHoldings: 0,
                losingHoldings: 0,
                bestPerformer: { symbol: '', returnPercent: 0 },
                worstPerformer: { symbol: '', returnPercent: 0 },
                averageReturn: 0,
                medianReturn: 0,
            };
        }
        returns.sort((a, b) => b.returnRate - a.returnRate);
        const bestPerformer = {
            symbol: returns[0].symbol,
            returnPercent: returns[0].returnRate,
        };
        const worstPerformer = {
            symbol: returns[returns.length - 1].symbol,
            returnPercent: returns[returns.length - 1].returnRate,
        };
        const averageReturn = returns.reduce((sum, r) => sum + r.returnRate, 0) / returns.length;
        const medianReturn = returns[Math.floor(returns.length / 2)].returnRate;
        return {
            profitableHoldings,
            losingHoldings,
            bestPerformer,
            worstPerformer,
            averageReturn,
            medianReturn,
        };
    }
    async analyzeReturnTrends(portfolioId) {
        const returns = await this.calculatePortfolioReturns(portfolioId);
        const dailyReturn = returns.totalReturnPercent * 0.01;
        const weeklyReturn = returns.totalReturnPercent * 0.05;
        const monthlyReturn = returns.totalReturnPercent * 0.2;
        const yearlyReturn = returns.totalReturnPercent;
        let trend;
        if (returns.totalReturnPercent > 5) {
            trend = 'increasing';
        }
        else if (returns.totalReturnPercent < -5) {
            trend = 'decreasing';
        }
        else {
            trend = 'stable';
        }
        return {
            dailyReturn,
            weeklyReturn,
            monthlyReturn,
            yearlyReturn,
            trend,
        };
    }
};
exports.PortfolioReturnsService = PortfolioReturnsService;
exports.PortfolioReturnsService = PortfolioReturnsService = PortfolioReturnsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(portfolio_entity_1.Portfolio)),
    __param(1, (0, typeorm_1.InjectRepository)(portfolio_holding_entity_1.PortfolioHolding)),
    __param(2, (0, typeorm_1.InjectRepository)(stock_entity_1.Stock)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        stocks_service_1.StocksService])
], PortfolioReturnsService);
//# sourceMappingURL=portfolio-returns.service.js.map