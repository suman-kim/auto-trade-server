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
exports.TradingSignal = void 0;
const typeorm_1 = require("typeorm");
const trading_strategy_entity_1 = require("./trading-strategy.entity");
const stock_entity_1 = require("./stock.entity");
const trading_strategy_types_1 = require("../shared/types/trading-strategy.types");
let TradingSignal = class TradingSignal {
    id;
    strategyId;
    stockId;
    signalType;
    confidence;
    price;
    volume;
    indicators;
    executed;
    executedAt;
    createdAt;
    strategy;
    stock;
};
exports.TradingSignal = TradingSignal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TradingSignal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'strategyId',
        comment: '신호를 생성한 전략 ID'
    }),
    __metadata("design:type", Number)
], TradingSignal.prototype, "strategyId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'stockId',
        comment: '신호가 발생한 주식 ID'
    }),
    __metadata("design:type", Number)
], TradingSignal.prototype, "stockId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'signal_type',
        comment: '신호 타입 (BUY: 매수, SELL: 매도, HOLD: 보유)'
    }),
    __metadata("design:type", String)
], TradingSignal.prototype, "signalType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 5,
        scale: 4,
        comment: '신호 신뢰도 (0.0000 ~ 1.0000, 높을수록 신뢰도 높음)'
    }),
    __metadata("design:type", Number)
], TradingSignal.prototype, "confidence", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2,
        comment: '신호 발생 시점의 주가'
    }),
    __metadata("design:type", Number)
], TradingSignal.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        comment: '신호 발생 시점의 거래량'
    }),
    __metadata("design:type", Number)
], TradingSignal.prototype, "volume", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'json',
        nullable: true,
        comment: '신호 생성에 사용된 기술적 지표 값들 (JSON 형태)'
    }),
    __metadata("design:type", Object)
], TradingSignal.prototype, "indicators", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
        comment: '신호 실행 여부 (true: 실행됨, false: 미실행)'
    }),
    __metadata("design:type", Boolean)
], TradingSignal.prototype, "executed", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'executed_at',
        type: 'timestamp',
        nullable: true,
        comment: '신호 실행 일시'
    }),
    __metadata("design:type", Object)
], TradingSignal.prototype, "executedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'createdAt',
        comment: '신호 생성 일시'
    }),
    __metadata("design:type", Date)
], TradingSignal.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => trading_strategy_entity_1.TradingStrategy, (strategy) => strategy.signals),
    (0, typeorm_1.JoinColumn)({ name: 'strategyId' }),
    __metadata("design:type", trading_strategy_entity_1.TradingStrategy)
], TradingSignal.prototype, "strategy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_entity_1.Stock),
    (0, typeorm_1.JoinColumn)({ name: 'stockId' }),
    __metadata("design:type", stock_entity_1.Stock)
], TradingSignal.prototype, "stock", void 0);
exports.TradingSignal = TradingSignal = __decorate([
    (0, typeorm_1.Entity)('trading_signals')
], TradingSignal);
//# sourceMappingURL=trading-signal.entity.js.map