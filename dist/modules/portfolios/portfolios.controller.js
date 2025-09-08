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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfoliosController = void 0;
const common_1 = require("@nestjs/common");
const portfolios_service_1 = require("./portfolios.service");
const portfolio_returns_service_1 = require("./portfolio-returns.service");
const portfolio_dto_1 = require("../../dtos/portfolio.dto");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../../entities/user.entity");
let PortfoliosController = class PortfoliosController {
    portfoliosService;
    portfolioReturnsService;
    constructor(portfoliosService, portfolioReturnsService) {
        this.portfoliosService = portfoliosService;
        this.portfolioReturnsService = portfolioReturnsService;
    }
    async getUserPortfolios(user) {
        return await this.portfoliosService.getUserPortfolios(user.id);
    }
    async createPortfolio(user, createPortfolioDto) {
        return await this.portfoliosService.createPortfolio(user.id, createPortfolioDto);
    }
    async getPortfolio(user, portfolioId) {
        return await this.portfoliosService.getPortfolio(user.id, portfolioId);
    }
    async updatePortfolio(user, portfolioId, updatePortfolioDto) {
        return await this.portfoliosService.updatePortfolio(user.id, portfolioId, updatePortfolioDto);
    }
    async deletePortfolio(user, portfolioId) {
        await this.portfoliosService.deletePortfolio(user.id, portfolioId);
    }
    async getPortfolioHoldings(user, portfolioId) {
        return await this.portfoliosService.getPortfolioHoldings(user.id, portfolioId);
    }
    async removeHolding(user, portfolioId, holdingId) {
        await this.portfoliosService.removeHolding(user.id, portfolioId, holdingId);
    }
    async getPortfolioPerformance(user, portfolioId) {
        return await this.portfoliosService.getPortfolioPerformance(user.id, portfolioId);
    }
    async getPortfolioReturns(user, portfolioId) {
        return await this.portfolioReturnsService.calculatePortfolioReturns(portfolioId);
    }
    async getPortfolioRiskMetrics(user, portfolioId) {
        return await this.portfolioReturnsService.calculatePortfolioRiskMetrics(portfolioId);
    }
    async getBenchmarkComparison(user, portfolioId, benchmark = 'SPY') {
        return await this.portfolioReturnsService.compareWithBenchmark(portfolioId, benchmark);
    }
    async getAssetAllocation(user, portfolioId) {
        return await this.portfolioReturnsService.analyzeAssetAllocation(portfolioId);
    }
    async getReturnDistribution(user, portfolioId) {
        return await this.portfolioReturnsService.analyzeReturnDistribution(portfolioId);
    }
    async getReturnTrends(user, portfolioId) {
        return await this.portfolioReturnsService.analyzeReturnTrends(portfolioId);
    }
    async getHoldingReturns(user, portfolioId, holdingId) {
        return await this.portfolioReturnsService.calculateHoldingReturns(holdingId);
    }
};
exports.PortfoliosController = PortfoliosController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "getUserPortfolios", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        portfolio_dto_1.CreatePortfolioDto]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "createPortfolio", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "getPortfolio", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number, portfolio_dto_1.UpdatePortfolioDto]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "updatePortfolio", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "deletePortfolio", null);
__decorate([
    (0, common_1.Get)(':id/holdings'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "getPortfolioHoldings", null);
__decorate([
    (0, common_1.Delete)(':id/holdings/:holdingId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('holdingId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number, Number]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "removeHolding", null);
__decorate([
    (0, common_1.Get)(':id/performance'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "getPortfolioPerformance", null);
__decorate([
    (0, common_1.Get)(':id/returns'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "getPortfolioReturns", null);
__decorate([
    (0, common_1.Get)(':id/risk-metrics'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "getPortfolioRiskMetrics", null);
__decorate([
    (0, common_1.Get)(':id/benchmark-comparison'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('benchmark')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number, String]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "getBenchmarkComparison", null);
__decorate([
    (0, common_1.Get)(':id/asset-allocation'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "getAssetAllocation", null);
__decorate([
    (0, common_1.Get)(':id/return-distribution'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "getReturnDistribution", null);
__decorate([
    (0, common_1.Get)(':id/return-trends'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "getReturnTrends", null);
__decorate([
    (0, common_1.Get)(':id/holdings/:holdingId/returns'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('holdingId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number, Number]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "getHoldingReturns", null);
exports.PortfoliosController = PortfoliosController = __decorate([
    (0, common_1.Controller)('portfolios'),
    __metadata("design:paramtypes", [portfolios_service_1.PortfoliosService,
        portfolio_returns_service_1.PortfolioReturnsService])
], PortfoliosController);
//# sourceMappingURL=portfolios.controller.js.map