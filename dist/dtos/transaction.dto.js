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
exports.TransactionAnalysisDto = exports.TransactionStatsDto = exports.TransactionResponseDto = exports.TransactionFilterDto = exports.UpdateTransactionDto = exports.CreateTransactionDto = void 0;
const class_validator_1 = require("class-validator");
const transaction_entity_1 = require("../entities/transaction.entity");
class CreateTransactionDto {
    portfolioId;
    stockSymbol;
    transactionType;
    quantity;
    pricePerShare;
    fees;
    notes;
}
exports.CreateTransactionDto = CreateTransactionDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "portfolioId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "stockSymbol", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(transaction_entity_1.TransactionType),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "transactionType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "pricePerShare", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "fees", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "notes", void 0);
class UpdateTransactionDto {
    status;
    fees;
    notes;
}
exports.UpdateTransactionDto = UpdateTransactionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(transaction_entity_1.TransactionStatus),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateTransactionDto.prototype, "fees", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "notes", void 0);
class TransactionFilterDto {
    transactionType;
    status;
    stockSymbol;
    startDate;
    endDate;
    portfolioId;
}
exports.TransactionFilterDto = TransactionFilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(transaction_entity_1.TransactionType),
    __metadata("design:type", String)
], TransactionFilterDto.prototype, "transactionType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(transaction_entity_1.TransactionStatus),
    __metadata("design:type", String)
], TransactionFilterDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransactionFilterDto.prototype, "stockSymbol", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TransactionFilterDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TransactionFilterDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TransactionFilterDto.prototype, "portfolioId", void 0);
class TransactionResponseDto {
    id;
    userId;
    portfolioId;
    stockSymbol;
    stockName;
    transactionType;
    quantity;
    pricePerShare;
    totalAmount;
    fees;
    totalWithFees;
    transactionDate;
    status;
    notes;
    createdAt;
    updatedAt;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.TransactionResponseDto = TransactionResponseDto;
class TransactionStatsDto {
    totalTransactions;
    totalBuyTransactions;
    totalSellTransactions;
    totalVolume;
    totalAmount;
    totalFees;
    averageTransactionAmount;
    mostTradedStock;
    mostTradedStockVolume;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.TransactionStatsDto = TransactionStatsDto;
class TransactionAnalysisDto {
    period;
    totalTrades;
    winningTrades;
    losingTrades;
    winRate;
    averageProfit;
    averageLoss;
    totalProfit;
    totalLoss;
    netProfit;
    profitFactor;
    largestWin;
    largestLoss;
    averageHoldingPeriod;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.TransactionAnalysisDto = TransactionAnalysisDto;
//# sourceMappingURL=transaction.dto.js.map