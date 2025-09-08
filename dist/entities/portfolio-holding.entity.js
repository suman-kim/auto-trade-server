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
exports.PortfolioHolding = void 0;
const typeorm_1 = require("typeorm");
const portfolio_entity_1 = require("./portfolio.entity");
const stock_entity_1 = require("./stock.entity");
let PortfolioHolding = class PortfolioHolding {
    id;
    portfolioId;
    stockId;
    quantity;
    averagePrice;
    totalInvested;
    createdAt;
    updatedAt;
    portfolio;
    stock;
    get currentValue() {
        if (!this.stock || !this.stock.currentPrice) {
            return 0;
        }
        return this.quantity * this.stock.currentPrice;
    }
    get returnRate() {
        if (this.totalInvested === 0) {
            return 0;
        }
        return ((this.currentValue - this.totalInvested) / this.totalInvested) * 100;
    }
    get profitLoss() {
        return this.currentValue - this.totalInvested;
    }
    isProfitable() {
        return this.currentValue > this.totalInvested;
    }
};
exports.PortfolioHolding = PortfolioHolding;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PortfolioHolding.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'portfolioId',
        comment: '포트폴리오 ID'
    }),
    __metadata("design:type", Number)
], PortfolioHolding.prototype, "portfolioId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'stockId',
        comment: '보유 주식 ID'
    }),
    __metadata("design:type", Number)
], PortfolioHolding.prototype, "stockId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '보유 주식 수량'
    }),
    __metadata("design:type", Number)
], PortfolioHolding.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'average_price',
        type: 'decimal',
        precision: 10,
        scale: 2,
        comment: '평균 매수가'
    }),
    __metadata("design:type", Number)
], PortfolioHolding.prototype, "averagePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_invested',
        type: 'decimal',
        precision: 15,
        scale: 2,
        comment: '총 투자 금액 (수량 × 평균 매수가)'
    }),
    __metadata("design:type", Number)
], PortfolioHolding.prototype, "totalInvested", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'createdAt',
        comment: '보유 내역 생성 일시'
    }),
    __metadata("design:type", Date)
], PortfolioHolding.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updatedAt',
        comment: '보유 내역 수정 일시'
    }),
    __metadata("design:type", Date)
], PortfolioHolding.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => portfolio_entity_1.Portfolio, (portfolio) => portfolio.holdings),
    (0, typeorm_1.JoinColumn)({ name: 'portfolioId' }),
    __metadata("design:type", portfolio_entity_1.Portfolio)
], PortfolioHolding.prototype, "portfolio", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_entity_1.Stock),
    (0, typeorm_1.JoinColumn)({ name: 'stockId' }),
    __metadata("design:type", stock_entity_1.Stock)
], PortfolioHolding.prototype, "stock", void 0);
exports.PortfolioHolding = PortfolioHolding = __decorate([
    (0, typeorm_1.Entity)('portfolio_holdings')
], PortfolioHolding);
//# sourceMappingURL=portfolio-holding.entity.js.map