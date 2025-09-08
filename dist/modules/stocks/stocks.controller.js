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
exports.StocksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stocks_service_1 = require("./stocks.service");
const stock_dto_1 = require("../../dtos/stock.dto");
const public_decorator_1 = require("../../shared/decorators/public.decorator");
let StocksController = class StocksController {
    stocksService;
    constructor(stocksService) {
        this.stocksService = stocksService;
    }
    async getStockPrice(symbol) {
        return await this.stocksService.updateStockPrice(symbol);
    }
    async getStockInfo(symbol) {
        return await this.stocksService.getStockInfo(symbol);
    }
    async getAllStocks() {
        return await this.stocksService.getAllStocks();
    }
    async getStockHistory(symbol, days = '30') {
        const daysNumber = parseInt(days, 10);
        return await this.stocksService.getStockHistory(symbol, daysNumber);
    }
    async searchStocks(searchDto) {
        return await this.stocksService.searchStocks(searchDto.query, searchDto.limit);
    }
    async getStockStats(symbol, days = '30') {
        const daysNumber = parseInt(days, 10);
        return await this.stocksService.getStockStats(symbol, daysNumber);
    }
    async updateStockPrice(symbol, updateDto) {
        return await this.stocksService.updateStockPrice(symbol);
    }
    async updateMultipleStocks(symbols) {
        return await this.stocksService.updateMultipleStocks(symbols);
    }
    async checkPriceCondition(symbol, alertDto) {
        return await this.stocksService.checkPriceCondition(symbol, alertDto.targetPrice, alertDto.condition);
    }
    async getPriceChangePercent(symbol, days = '1') {
        const daysNumber = parseInt(days, 10);
        const changePercent = await this.stocksService.getPriceChangePercent(symbol, daysNumber);
        return {
            symbol,
            changePercent,
            days: daysNumber,
        };
    }
    async deleteStock(symbol) {
        await this.stocksService.deleteStock(symbol);
        return { message: `${symbol} 주식 정보가 삭제되었습니다.` };
    }
    async getTeslaPrice() {
        return await this.stocksService.updateStockPrice('TSLA');
    }
    async getTeslaHistory(days = '30') {
        const daysNumber = parseInt(days, 10);
        return await this.stocksService.getStockHistory('TSLA', daysNumber);
    }
    async getTeslaStats(days = '30') {
        const daysNumber = parseInt(days, 10);
        return await this.stocksService.getStockStats('TSLA', daysNumber);
    }
};
exports.StocksController = StocksController;
__decorate([
    (0, common_1.Get)(':symbol/price'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: '실시간 주식 가격 조회',
        description: '특정 주식의 실시간 가격 정보를 조회합니다.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'symbol',
        description: '주식 심볼',
        example: 'TSLA',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '주식 가격 조회 성공',
        type: stock_dto_1.StockPriceResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: '주식을 찾을 수 없음',
    }),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getStockPrice", null);
__decorate([
    (0, common_1.Get)(':symbol'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getStockInfo", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getAllStocks", null);
__decorate([
    (0, common_1.Get)(':symbol/history'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: '주식 히스토리 데이터 조회',
        description: '특정 주식의 과거 가격 데이터를 조회합니다.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'symbol',
        description: '주식 심볼',
        example: 'TSLA',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'days',
        description: '조회할 일수',
        example: '30',
        required: false,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '주식 히스토리 조회 성공',
        type: stock_dto_1.StockHistoryResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: '주식을 찾을 수 없음',
    }),
    __param(0, (0, common_1.Param)('symbol')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getStockHistory", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [stock_dto_1.StockSearchDto]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "searchStocks", null);
__decorate([
    (0, common_1.Get)(':symbol/stats'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('symbol')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getStockStats", null);
__decorate([
    (0, common_1.Post)(':symbol/update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('symbol')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, stock_dto_1.StockPriceUpdateDto]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "updateStockPrice", null);
__decorate([
    (0, common_1.Post)('batch-update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "updateMultipleStocks", null);
__decorate([
    (0, common_1.Post)(':symbol/check-condition'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('symbol')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, stock_dto_1.StockAlertDto]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "checkPriceCondition", null);
__decorate([
    (0, common_1.Get)(':symbol/change-percent'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('symbol')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getPriceChangePercent", null);
__decorate([
    (0, common_1.Delete)(':symbol'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "deleteStock", null);
__decorate([
    (0, common_1.Get)('tesla/price'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getTeslaPrice", null);
__decorate([
    (0, common_1.Get)('tesla/history'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getTeslaHistory", null);
__decorate([
    (0, common_1.Get)('tesla/stats'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getTeslaStats", null);
exports.StocksController = StocksController = __decorate([
    (0, swagger_1.ApiTags)('stocks'),
    (0, common_1.Controller)('stocks'),
    __metadata("design:paramtypes", [stocks_service_1.StocksService])
], StocksController);
//# sourceMappingURL=stocks.controller.js.map