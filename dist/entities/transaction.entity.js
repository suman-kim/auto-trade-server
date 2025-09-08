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
exports.Transaction = exports.TransactionStatus = exports.TransactionType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const portfolio_entity_1 = require("./portfolio.entity");
const stock_entity_1 = require("./stock.entity");
var TransactionType;
(function (TransactionType) {
    TransactionType["BUY"] = "BUY";
    TransactionType["SELL"] = "SELL";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["COMPLETED"] = "COMPLETED";
    TransactionStatus["CANCELLED"] = "CANCELLED";
    TransactionStatus["FAILED"] = "FAILED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
let Transaction = class Transaction {
    id;
    userId;
    portfolioId;
    stockId;
    transactionType;
    quantity;
    pricePerShare;
    totalAmount;
    transactionDate;
    status;
    fees;
    notes;
    user;
    portfolio;
    stock;
    isBuy() {
        return this.transactionType === TransactionType.BUY;
    }
    isSell() {
        return this.transactionType === TransactionType.SELL;
    }
    isCompleted() {
        return this.status === TransactionStatus.COMPLETED;
    }
    get totalWithFees() {
        return this.totalAmount + this.fees;
    }
    isSuccessful() {
        return this.status === TransactionStatus.COMPLETED;
    }
};
exports.Transaction = Transaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'userId',
        comment: '거래를 수행한 사용자 ID'
    }),
    __metadata("design:type", Number)
], Transaction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'portfolioId',
        comment: '거래가 속한 포트폴리오 ID'
    }),
    __metadata("design:type", Number)
], Transaction.prototype, "portfolioId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'stockId',
        comment: '거래된 주식의 ID'
    }),
    __metadata("design:type", Number)
], Transaction.prototype, "stockId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transaction_type',
        comment: '거래 타입 (BUY: 매수, SELL: 매도)'
    }),
    __metadata("design:type", String)
], Transaction.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '거래 수량 (주식 개수)'
    }),
    __metadata("design:type", Number)
], Transaction.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'price_per_share',
        type: 'decimal',
        precision: 10,
        scale: 2,
        comment: '주당 거래 가격'
    }),
    __metadata("design:type", Number)
], Transaction.prototype, "pricePerShare", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_amount',
        type: 'decimal',
        precision: 15,
        scale: 2,
        comment: '거래 총액 (수량 × 주당가격)'
    }),
    __metadata("design:type", Number)
], Transaction.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transaction_date',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        comment: '거래 실행 일시'
    }),
    __metadata("design:type", Date)
], Transaction.prototype, "transactionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 'COMPLETED',
        comment: '거래 상태 (PENDING: 대기중, COMPLETED: 완료, CANCELLED: 취소, FAILED: 실패)'
    }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
        comment: '거래 수수료'
    }),
    __metadata("design:type", Number)
], Transaction.prototype, "fees", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        comment: '거래 메모 또는 참고사항'
    }),
    __metadata("design:type", String)
], Transaction.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.transactions),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Transaction.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => portfolio_entity_1.Portfolio, (portfolio) => portfolio.transactions),
    (0, typeorm_1.JoinColumn)({ name: 'portfolioId' }),
    __metadata("design:type", portfolio_entity_1.Portfolio)
], Transaction.prototype, "portfolio", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_entity_1.Stock),
    (0, typeorm_1.JoinColumn)({ name: 'stockId' }),
    __metadata("design:type", stock_entity_1.Stock)
], Transaction.prototype, "stock", void 0);
exports.Transaction = Transaction = __decorate([
    (0, typeorm_1.Entity)('transactions')
], Transaction);
//# sourceMappingURL=transaction.entity.js.map