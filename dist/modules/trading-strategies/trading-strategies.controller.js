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
exports.TradingStrategiesController = void 0;
const common_1 = require("@nestjs/common");
const trading_strategies_service_1 = require("./trading-strategies.service");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const trading_strategy_dto_1 = require("../../dtos/trading-strategy.dto");
let TradingStrategiesController = class TradingStrategiesController {
    tradingStrategiesService;
    constructor(tradingStrategiesService) {
        this.tradingStrategiesService = tradingStrategiesService;
    }
    async createSimpleStrategy(userId, simpleStrategyDto) {
        return await this.tradingStrategiesService.createSimpleStrategy(userId, simpleStrategyDto.name, simpleStrategyDto.strategyType, simpleStrategyDto.description);
    }
    async getUserStrategies(userId) {
        return await this.tradingStrategiesService.getUserStrategies(userId);
    }
    async getStrategy(userId, strategyId) {
        return await this.tradingStrategiesService.getStrategy(userId, strategyId);
    }
    async updateStrategy(userId, strategyId, updateStrategyDto) {
        return await this.tradingStrategiesService.updateStrategy(userId, strategyId, updateStrategyDto);
    }
    async deleteStrategy(userId, strategyId) {
        await this.tradingStrategiesService.deleteStrategy(userId, strategyId);
        return { message: '거래 전략이 삭제되었습니다.' };
    }
    async toggleStrategy(userId, strategyId) {
        return await this.tradingStrategiesService.toggleStrategy(userId, strategyId);
    }
    async getStrategySignals(userId, strategyId) {
        return await this.tradingStrategiesService.getStrategySignals(userId, strategyId);
    }
};
exports.TradingStrategiesController = TradingStrategiesController;
__decorate([
    (0, common_1.Post)('simple'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TradingStrategiesController.prototype, "createSimpleStrategy", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TradingStrategiesController.prototype, "getUserStrategies", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TradingStrategiesController.prototype, "getStrategy", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, trading_strategy_dto_1.UpdateTradingStrategyDto]),
    __metadata("design:returntype", Promise)
], TradingStrategiesController.prototype, "updateStrategy", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TradingStrategiesController.prototype, "deleteStrategy", null);
__decorate([
    (0, common_1.Put)(':id/toggle'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TradingStrategiesController.prototype, "toggleStrategy", null);
__decorate([
    (0, common_1.Get)(':id/signals'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TradingStrategiesController.prototype, "getStrategySignals", null);
exports.TradingStrategiesController = TradingStrategiesController = __decorate([
    (0, common_1.Controller)('trading-strategies'),
    __metadata("design:paramtypes", [trading_strategies_service_1.TradingStrategiesService])
], TradingStrategiesController);
//# sourceMappingURL=trading-strategies.controller.js.map