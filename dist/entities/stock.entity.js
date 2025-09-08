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
exports.Stock = void 0;
const typeorm_1 = require("typeorm");
const portfolio_holding_entity_1 = require("./portfolio-holding.entity");
const transaction_entity_1 = require("./transaction.entity");
const trading_signal_entity_1 = require("./trading-signal.entity");
const price_alert_entity_1 = require("./price-alert.entity");
let Stock = class Stock {
    id;
    symbol;
    companyName;
    name;
    sector;
    industry;
    exchange;
    currency;
    currentPrice;
    previousClose;
    high;
    low;
    bidPrice;
    askPrice;
    volume;
    marketCap;
    peRatio;
    dividendYield;
    kisNightCode;
    kisDayCode;
    lastUpdated;
    portfolioHoldings;
    transactions;
    tradingSignals;
    priceAlerts;
    get priceChange() {
        if (!this.currentPrice || !this.previousClose) {
            return 0;
        }
        return ((this.currentPrice - this.previousClose) / this.previousClose) * 100;
    }
    get priceChangeDirection() {
        if (!this.currentPrice || !this.previousClose) {
            return 'unchanged';
        }
        if (this.currentPrice > this.previousClose) {
            return 'up';
        }
        if (this.currentPrice < this.previousClose) {
            return 'down';
        }
        return 'unchanged';
    }
    isActive() {
        return this.currentPrice !== null && this.currentPrice > 0;
    }
};
exports.Stock = Stock;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Stock.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true,
        length: 20,
        comment: '주식 심볼 (예: TSLA, AAPL)'
    }),
    __metadata("design:type", String)
], Stock.prototype, "symbol", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'company_name',
        length: 255,
        comment: '회사명'
    }),
    __metadata("design:type", String)
], Stock.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 100,
        nullable: true,
        comment: '주식명 (간단한 이름)'
    }),
    __metadata("design:type", String)
], Stock.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 100,
        nullable: true,
        comment: '섹터 (예: Technology, Healthcare)'
    }),
    __metadata("design:type", String)
], Stock.prototype, "sector", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 100,
        nullable: true,
        comment: '산업 분야'
    }),
    __metadata("design:type", String)
], Stock.prototype, "industry", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 50,
        nullable: true,
        comment: '거래소 (예: NASDAQ, NYSE)'
    }),
    __metadata("design:type", String)
], Stock.prototype, "exchange", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 10,
        nullable: true,
        comment: '통화 (예: USD, KRW)'
    }),
    __metadata("design:type", String)
], Stock.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'current_price',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
        comment: '현재 주가'
    }),
    __metadata("design:type", Number)
], Stock.prototype, "currentPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'previous_close',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
        comment: '전일 종가'
    }),
    __metadata("design:type", Number)
], Stock.prototype, "previousClose", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
        comment: '당일 고가'
    }),
    __metadata("design:type", Number)
], Stock.prototype, "high", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
        comment: '당일 저가'
    }),
    __metadata("design:type", Number)
], Stock.prototype, "low", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'bid_price',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
        comment: '매수 1호가'
    }),
    __metadata("design:type", Number)
], Stock.prototype, "bidPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'ask_price',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
        comment: '매도 1호가'
    }),
    __metadata("design:type", Number)
], Stock.prototype, "askPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'bigint',
        nullable: true,
        comment: '거래량'
    }),
    __metadata("design:type", Number)
], Stock.prototype, "volume", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'market_cap',
        type: 'decimal',
        precision: 20,
        scale: 2,
        nullable: true,
        comment: '시가총액'
    }),
    __metadata("design:type", Number)
], Stock.prototype, "marketCap", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'pe_ratio',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
        comment: 'PER (주가수익비율)'
    }),
    __metadata("design:type", Number)
], Stock.prototype, "peRatio", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'dividend_yield',
        type: 'decimal',
        precision: 5,
        scale: 2,
        nullable: true,
        comment: '배당수익률 (%)'
    }),
    __metadata("design:type", Number)
], Stock.prototype, "dividendYield", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'kis_night_code',
        length: 20,
        nullable: true,
        comment: '야간 종목코드'
    }),
    __metadata("design:type", String)
], Stock.prototype, "kisNightCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'kis_day_code',
        length: 20,
        nullable: true,
        comment: '주간 종목코드'
    }),
    __metadata("design:type", String)
], Stock.prototype, "kisDayCode", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'last_updated',
        comment: '마지막 업데이트 일시'
    }),
    __metadata("design:type", Date)
], Stock.prototype, "lastUpdated", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => portfolio_holding_entity_1.PortfolioHolding, holding => holding.stock),
    __metadata("design:type", Array)
], Stock.prototype, "portfolioHoldings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transaction_entity_1.Transaction, transaction => transaction.stock),
    __metadata("design:type", Array)
], Stock.prototype, "transactions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => trading_signal_entity_1.TradingSignal, signal => signal.stock),
    __metadata("design:type", Array)
], Stock.prototype, "tradingSignals", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => price_alert_entity_1.PriceAlert, alert => alert.stock),
    __metadata("design:type", Array)
], Stock.prototype, "priceAlerts", void 0);
exports.Stock = Stock = __decorate([
    (0, typeorm_1.Entity)('stocks')
], Stock);
//# sourceMappingURL=stock.entity.js.map