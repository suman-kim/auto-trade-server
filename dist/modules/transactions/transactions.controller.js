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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("./transactions.service");
const transaction_dto_1 = require("../../dtos/transaction.dto");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../../entities/user.entity");
let TransactionsController = class TransactionsController {
    transactionsService;
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    async createTransaction(user, createTransactionDto) {
        return await this.transactionsService.createTransaction(user.id, createTransactionDto);
    }
    async getUserTransactions(user, filter) {
        return await this.transactionsService.getUserTransactions(user.id, filter);
    }
    async getTransaction(user, transactionId) {
        return await this.transactionsService.getTransaction(user.id, transactionId);
    }
    async updateTransaction(user, transactionId, updateTransactionDto) {
        return await this.transactionsService.updateTransaction(user.id, transactionId, updateTransactionDto);
    }
    async deleteTransaction(user, transactionId) {
        await this.transactionsService.deleteTransaction(user.id, transactionId);
    }
    async getTransactionStats(user, filter) {
        return await this.transactionsService.getTransactionStats(user.id, filter);
    }
    async analyzeTransactions(user, period = '30d') {
        return await this.transactionsService.analyzeTransactions(user.id, period);
    }
    async getPortfolioTransactions(user, portfolioId, filter) {
        const portfolioFilter = { ...filter, portfolioId };
        return await this.transactionsService.getUserTransactions(user.id, portfolioFilter);
    }
    async getStockTransactions(user, symbol, filter) {
        const stockFilter = { ...filter, stockSymbol: symbol };
        return await this.transactionsService.getUserTransactions(user.id, stockFilter);
    }
    async getTransactionsByPeriod(user, startDate, endDate, filter) {
        const periodFilter = { ...filter, startDate, endDate };
        return await this.transactionsService.getUserTransactions(user.id, periodFilter);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "createTransaction", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        transaction_dto_1.TransactionFilterDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getUserTransactions", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getTransaction", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number, transaction_dto_1.UpdateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "updateTransaction", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "deleteTransaction", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        transaction_dto_1.TransactionFilterDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getTransactionStats", null);
__decorate([
    (0, common_1.Get)('analysis'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "analyzeTransactions", null);
__decorate([
    (0, common_1.Get)('portfolio/:portfolioId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('portfolioId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number, transaction_dto_1.TransactionFilterDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getPortfolioTransactions", null);
__decorate([
    (0, common_1.Get)('stock/:symbol'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('symbol')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, transaction_dto_1.TransactionFilterDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getStockTransactions", null);
__decorate([
    (0, common_1.Get)('period'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String, transaction_dto_1.TransactionFilterDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getTransactionsByPeriod", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map