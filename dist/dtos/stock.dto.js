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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockStatsDto = exports.StockAlertDto = exports.StockHistoryResponseDto = exports.StockPriceResponseDto = exports.StockPriceUpdateDto = exports.StockSearchDto = exports.StockInfoDto = exports.StockPriceDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class StockPriceDto {
    symbol;
    open;
    high;
    low;
    close;
    volume;
    date;
    change;
    changePercent;
}
exports.StockPriceDto = StockPriceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '주식 심볼',
        example: 'TSLA',
        type: String,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StockPriceDto.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '시가',
        example: 250.50,
        type: Number,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StockPriceDto.prototype, "open", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '고가',
        example: 255.75,
        type: Number,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StockPriceDto.prototype, "high", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '저가',
        example: 248.25,
        type: Number,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StockPriceDto.prototype, "low", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '종가',
        example: 252.00,
        type: Number,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StockPriceDto.prototype, "close", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '거래량',
        example: 15000000,
        type: Number,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StockPriceDto.prototype, "volume", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '날짜',
        example: '2024-01-01',
        type: String,
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], StockPriceDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '가격 변화',
        example: 2.50,
        required: false,
        type: Number,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StockPriceDto.prototype, "change", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '가격 변화율 (%)',
        example: 1.0,
        required: false,
        type: Number,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StockPriceDto.prototype, "changePercent", void 0);
class StockInfoDto {
    symbol;
    name;
    sector;
    industry;
    exchange;
    currency;
    marketCap;
    peRatio;
    dividendYield;
}
exports.StockInfoDto = StockInfoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StockInfoDto.prototype, "symbol", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StockInfoDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StockInfoDto.prototype, "sector", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StockInfoDto.prototype, "industry", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StockInfoDto.prototype, "exchange", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StockInfoDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], StockInfoDto.prototype, "marketCap", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], StockInfoDto.prototype, "peRatio", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], StockInfoDto.prototype, "dividendYield", void 0);
class StockSearchDto {
    query;
    limit = 10;
}
exports.StockSearchDto = StockSearchDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StockSearchDto.prototype, "query", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StockSearchDto.prototype, "limit", void 0);
class StockPriceUpdateDto {
    symbol;
    interval;
}
exports.StockPriceUpdateDto = StockPriceUpdateDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StockPriceUpdateDto.prototype, "symbol", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['realtime', 'daily', 'weekly', 'monthly']),
    __metadata("design:type", String)
], StockPriceUpdateDto.prototype, "interval", void 0);
class StockPriceResponseDto {
    symbol;
    currentPrice;
    previousClose;
    change;
    changePercent;
    volume;
    marketCap;
    high;
    low;
    open;
    timestamp;
    constructor(data) {
        this.symbol = data.symbol;
        this.currentPrice = data.currentPrice;
        this.previousClose = data.previousClose;
        this.change = data.change;
        this.changePercent = data.changePercent;
        this.volume = data.volume;
        this.marketCap = data.marketCap;
        this.high = data.high;
        this.low = data.low;
        this.open = data.open;
        this.timestamp = data.timestamp;
    }
}
exports.StockPriceResponseDto = StockPriceResponseDto;
class StockHistoryResponseDto {
    symbol;
    prices;
    period;
    lastUpdated;
    constructor(symbol, prices, period) {
        this.symbol = symbol;
        this.prices = prices;
        this.period = period;
        this.lastUpdated = new Date();
    }
}
exports.StockHistoryResponseDto = StockHistoryResponseDto;
class StockAlertDto {
    symbol;
    targetPrice;
    condition;
    message;
}
exports.StockAlertDto = StockAlertDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StockAlertDto.prototype, "symbol", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StockAlertDto.prototype, "targetPrice", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['above', 'below']),
    __metadata("design:type", String)
], StockAlertDto.prototype, "condition", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StockAlertDto.prototype, "message", void 0);
class StockStatsDto {
    symbol;
    avgPrice;
    maxPrice;
    minPrice;
    totalVolume;
    priceVolatility;
    period;
    constructor(data) {
        this.symbol = data.symbol;
        this.avgPrice = data.avgPrice;
        this.maxPrice = data.maxPrice;
        this.minPrice = data.minPrice;
        this.totalVolume = data.totalVolume;
        this.priceVolatility = data.priceVolatility;
        this.period = data.period;
    }
}
exports.StockStatsDto = StockStatsDto;
//# sourceMappingURL=stock.dto.js.map