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
exports.BacktestResult = void 0;
const typeorm_1 = require("typeorm");
const trading_strategy_entity_1 = require("./trading-strategy.entity");
let BacktestResult = class BacktestResult {
    id;
    strategyId;
    name;
    startDate;
    endDate;
    initialCapital;
    finalCapital;
    totalReturn;
    annualizedReturn;
    sharpeRatio;
    maxDrawdown;
    totalTrades;
    winningTrades;
    losingTrades;
    winRate;
    averageWin;
    averageLoss;
    profitFactor;
    createdAt;
    strategy;
};
exports.BacktestResult = BacktestResult;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BacktestResult.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'strategyId',
        comment: '백테스팅을 수행한 전략 ID'
    }),
    __metadata("design:type", Number)
], BacktestResult.prototype, "strategyId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '백테스팅 결과 이름'
    }),
    __metadata("design:type", String)
], BacktestResult.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'start_date',
        type: 'date',
        comment: '백테스팅 시작 날짜'
    }),
    __metadata("design:type", Date)
], BacktestResult.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'end_date',
        type: 'date',
        comment: '백테스팅 종료 날짜'
    }),
    __metadata("design:type", Date)
], BacktestResult.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'initial_capital',
        type: 'decimal',
        precision: 15,
        scale: 2,
        comment: '초기 자본금'
    }),
    __metadata("design:type", Number)
], BacktestResult.prototype, "initialCapital", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'final_capital',
        type: 'decimal',
        precision: 15,
        scale: 2,
        comment: '최종 자본금'
    }),
    __metadata("design:type", Number)
], BacktestResult.prototype, "finalCapital", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_return',
        type: 'decimal',
        precision: 8,
        scale: 2,
        comment: '총 수익률 (%)'
    }),
    __metadata("design:type", Number)
], BacktestResult.prototype, "totalReturn", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'annualized_return',
        type: 'decimal',
        precision: 8,
        scale: 2,
        nullable: true,
        comment: '연간 수익률 (%)'
    }),
    __metadata("design:type", Number)
], BacktestResult.prototype, "annualizedReturn", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'sharpe_ratio',
        type: 'decimal',
        precision: 8,
        scale: 2,
        nullable: true,
        comment: '샤프 비율 (위험 대비 수익률)'
    }),
    __metadata("design:type", Number)
], BacktestResult.prototype, "sharpeRatio", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'max_drawdown',
        type: 'decimal',
        precision: 8,
        scale: 2,
        nullable: true,
        comment: '최대 손실폭 (%)'
    }),
    __metadata("design:type", Number)
], BacktestResult.prototype, "maxDrawdown", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_trades',
        comment: '총 거래 횟수'
    }),
    __metadata("design:type", Number)
], BacktestResult.prototype, "totalTrades", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'winning_trades',
        comment: '수익 거래 횟수'
    }),
    __metadata("design:type", Number)
], BacktestResult.prototype, "winningTrades", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'losing_trades',
        comment: '손실 거래 횟수'
    }),
    __metadata("design:type", Number)
], BacktestResult.prototype, "losingTrades", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'win_rate',
        type: 'decimal',
        precision: 8,
        scale: 2,
        comment: '승률 (%)'
    }),
    __metadata("design:type", Number)
], BacktestResult.prototype, "winRate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'average_win',
        type: 'decimal',
        precision: 8,
        scale: 2,
        nullable: true,
        comment: '평균 수익 (%)'
    }),
    __metadata("design:type", Number)
], BacktestResult.prototype, "averageWin", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'average_loss',
        type: 'decimal',
        precision: 8,
        scale: 2,
        nullable: true,
        comment: '평균 손실 (%)'
    }),
    __metadata("design:type", Number)
], BacktestResult.prototype, "averageLoss", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'profit_factor',
        type: 'decimal',
        precision: 8,
        scale: 2,
        nullable: true,
        comment: '수익 팩터 (총 수익 / 총 손실)'
    }),
    __metadata("design:type", Number)
], BacktestResult.prototype, "profitFactor", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'createdAt',
        comment: '백테스팅 결과 생성 일시'
    }),
    __metadata("design:type", Date)
], BacktestResult.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => trading_strategy_entity_1.TradingStrategy, (strategy) => strategy.backtestResults),
    (0, typeorm_1.JoinColumn)({ name: 'strategyId' }),
    __metadata("design:type", trading_strategy_entity_1.TradingStrategy)
], BacktestResult.prototype, "strategy", void 0);
exports.BacktestResult = BacktestResult = __decorate([
    (0, typeorm_1.Entity)('backtest_results')
], BacktestResult);
//# sourceMappingURL=backtest-result.entity.js.map