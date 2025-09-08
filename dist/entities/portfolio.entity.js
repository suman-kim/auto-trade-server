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
exports.Portfolio = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const portfolio_holding_entity_1 = require("./portfolio-holding.entity");
const transaction_entity_1 = require("./transaction.entity");
let Portfolio = class Portfolio {
    id;
    userId;
    name;
    description;
    foreignPurchaseAmount1;
    totalEvaluationProfitAmount;
    totalProfitRate;
    foreignPurchaseAmountSum1;
    foreignPurchaseAmountSum2;
    createdAt;
    updatedAt;
    user;
    holdings;
    transactions;
    get totalInvested() {
        if (!this.holdings) {
            return 0;
        }
        return this.holdings.reduce((total, holding) => total + holding.totalInvested, 0);
    }
};
exports.Portfolio = Portfolio;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Portfolio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'userId',
        comment: '포트폴리오 소유자 사용자 ID'
    }),
    __metadata("design:type", Number)
], Portfolio.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '포트폴리오 이름'
    }),
    __metadata("design:type", String)
], Portfolio.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        comment: '포트폴리오 설명'
    }),
    __metadata("design:type", String)
], Portfolio.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'foreign_purchase_amount1',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
        comment: '외화 매입 금액1'
    }),
    __metadata("design:type", Number)
], Portfolio.prototype, "foreignPurchaseAmount1", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_evaluation_profit',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
        comment: '총 평가 손익 금액'
    }),
    __metadata("design:type", Number)
], Portfolio.prototype, "totalEvaluationProfitAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_profit_rate',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
        comment: '총 수익률'
    }),
    __metadata("design:type", Number)
], Portfolio.prototype, "totalProfitRate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'foreign_purchase_amount_sum1',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
        comment: '외화 매수 금액 합계1'
    }),
    __metadata("design:type", Number)
], Portfolio.prototype, "foreignPurchaseAmountSum1", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'foreign_purchase_amount_sum2',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: 0,
        comment: '외화 매수 금액 합계2'
    }),
    __metadata("design:type", Number)
], Portfolio.prototype, "foreignPurchaseAmountSum2", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'createdAt',
        comment: '포트폴리오 생성 일시'
    }),
    __metadata("design:type", Date)
], Portfolio.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updatedAt',
        comment: '포트폴리오 정보 수정 일시'
    }),
    __metadata("design:type", Date)
], Portfolio.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.portfolios),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Portfolio.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => portfolio_holding_entity_1.PortfolioHolding, (holding) => holding.portfolio),
    __metadata("design:type", Array)
], Portfolio.prototype, "holdings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transaction_entity_1.Transaction, (transaction) => transaction.portfolio),
    __metadata("design:type", Array)
], Portfolio.prototype, "transactions", void 0);
exports.Portfolio = Portfolio = __decorate([
    (0, typeorm_1.Entity)('portfolios')
], Portfolio);
//# sourceMappingURL=portfolio.entity.js.map