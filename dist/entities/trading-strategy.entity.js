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
exports.TradingStrategy = exports.StrategyStatus = exports.StrategyType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const trading_signal_entity_1 = require("./trading-signal.entity");
const backtest_result_entity_1 = require("./backtest-result.entity");
var StrategyType;
(function (StrategyType) {
    StrategyType["MOVING_AVERAGE"] = "moving_average";
    StrategyType["RSI"] = "rsi";
    StrategyType["MACD"] = "macd";
    StrategyType["BOLLINGER_BANDS"] = "bollinger_bands";
    StrategyType["CUSTOM"] = "custom";
})(StrategyType || (exports.StrategyType = StrategyType = {}));
var StrategyStatus;
(function (StrategyStatus) {
    StrategyStatus["ACTIVE"] = "active";
    StrategyStatus["INACTIVE"] = "inactive";
    StrategyStatus["PAUSED"] = "paused";
})(StrategyStatus || (exports.StrategyStatus = StrategyStatus = {}));
let TradingStrategy = class TradingStrategy {
    id;
    userId;
    name;
    description;
    type;
    status;
    conditions;
    autoTrading;
    backtestSummary;
    lastExecutedAt;
    createdAt;
    updatedAt;
    user;
    signals;
    backtestResults;
};
exports.TradingStrategy = TradingStrategy;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TradingStrategy.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'userId',
        comment: '전략 소유자 사용자 ID'
    }),
    __metadata("design:type", Number)
], TradingStrategy.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '전략 이름'
    }),
    __metadata("design:type", String)
], TradingStrategy.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        comment: '전략 설명'
    }),
    __metadata("design:type", String)
], TradingStrategy.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: StrategyType,
        default: StrategyType.MOVING_AVERAGE,
        comment: '전략 타입 (moving_average: 이동평균, rsi: RSI, macd: MACD, bollinger_bands: 볼린저밴드, custom: 사용자정의)'
    }),
    __metadata("design:type", String)
], TradingStrategy.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: StrategyStatus,
        default: StrategyStatus.INACTIVE,
        comment: '전략 상태 (active: 활성, inactive: 비활성, paused: 일시정지)'
    }),
    __metadata("design:type", String)
], TradingStrategy.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'json',
        comment: '거래 조건 설정 (기술적 지표, 가격 조건, 거래량 조건, 시간 조건 등을 JSON 형태로 저장)'
    }),
    __metadata("design:type", Object)
], TradingStrategy.prototype, "conditions", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'auto_trading',
        type: 'json',
        comment: '자동 거래 설정 (활성화 여부, 최대 포지션 크기, 손절/익절 비율, 일일 최대 거래 횟수, 거래당 위험 비율 등을 JSON 형태로 저장)'
    }),
    __metadata("design:type", Object)
], TradingStrategy.prototype, "autoTrading", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'backtest_summary',
        type: 'json',
        nullable: true,
        comment: '백테스팅 결과 요약 (총 수익률, 연간 수익률, 최대 손실폭, 샤프 비율, 승률, 거래 횟수 등을 JSON 형태로 저장)'
    }),
    __metadata("design:type", Object)
], TradingStrategy.prototype, "backtestSummary", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'last_executed_at',
        type: 'timestamp',
        nullable: true,
        comment: '마지막 실행 일시'
    }),
    __metadata("design:type", Object)
], TradingStrategy.prototype, "lastExecutedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'createdAt',
        comment: '전략 생성 일시'
    }),
    __metadata("design:type", Date)
], TradingStrategy.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updatedAt',
        comment: '전략 수정 일시'
    }),
    __metadata("design:type", Date)
], TradingStrategy.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.tradingStrategies),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], TradingStrategy.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => trading_signal_entity_1.TradingSignal, (signal) => signal.strategy),
    __metadata("design:type", Array)
], TradingStrategy.prototype, "signals", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => backtest_result_entity_1.BacktestResult, (result) => result.strategy),
    __metadata("design:type", Array)
], TradingStrategy.prototype, "backtestResults", void 0);
exports.TradingStrategy = TradingStrategy = __decorate([
    (0, typeorm_1.Entity)('trading_strategies')
], TradingStrategy);
//# sourceMappingURL=trading-strategy.entity.js.map