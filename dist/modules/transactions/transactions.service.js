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
var TransactionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("../../entities/transaction.entity");
const user_entity_1 = require("../../entities/user.entity");
const portfolio_entity_1 = require("../../entities/portfolio.entity");
const stock_entity_1 = require("../../entities/stock.entity");
const trading_strategy_types_1 = require("../../shared/types/trading-strategy.types");
const transaction_dto_1 = require("../../dtos/transaction.dto");
let TransactionsService = TransactionsService_1 = class TransactionsService {
    transactionRepository;
    userRepository;
    portfolioRepository;
    stockRepository;
    logger = new common_1.Logger(TransactionsService_1.name);
    constructor(transactionRepository, userRepository, portfolioRepository, stockRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.portfolioRepository = portfolioRepository;
        this.stockRepository = stockRepository;
    }
    async createTransaction(userId, createTransactionDto) {
        const portfolio = await this.portfolioRepository.findOne({
            where: { id: createTransactionDto.portfolioId, userId },
        });
        if (!portfolio) {
            throw new common_1.NotFoundException('포트폴리오를 찾을 수 없습니다.');
        }
        let stock = await this.stockRepository.findOne({
            where: { symbol: createTransactionDto.stockSymbol.toUpperCase() },
        });
        if (!stock) {
            stock = this.stockRepository.create({
                symbol: createTransactionDto.stockSymbol.toUpperCase(),
                name: createTransactionDto.stockSymbol,
                currentPrice: createTransactionDto.pricePerShare,
            });
            await this.stockRepository.save(stock);
        }
        const totalAmount = createTransactionDto.quantity * createTransactionDto.pricePerShare;
        const fees = createTransactionDto.fees || 0;
        const transaction = this.transactionRepository.create({
            userId,
            portfolioId: createTransactionDto.portfolioId,
            stockId: stock.id,
            transactionType: createTransactionDto.transactionType,
            quantity: createTransactionDto.quantity,
            pricePerShare: createTransactionDto.pricePerShare,
            totalAmount,
            fees,
            notes: createTransactionDto.notes,
            status: transaction_entity_1.TransactionStatus.COMPLETED,
            transactionDate: new Date(),
        });
        const savedTransaction = await this.transactionRepository.save(transaction);
        return this.mapToResponseDto(savedTransaction, stock);
    }
    async getUserTransactions(userId, filter) {
        const queryBuilder = this.transactionRepository
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.stock', 'stock')
            .where('transaction.userId = :userId', { userId });
        if (filter) {
            if (filter.transactionType) {
                queryBuilder.andWhere('transaction.transactionType = :transactionType', {
                    transactionType: filter.transactionType
                });
            }
            if (filter.status) {
                queryBuilder.andWhere('transaction.status = :status', { status: filter.status });
            }
            if (filter.stockSymbol) {
                queryBuilder.andWhere('stock.symbol ILIKE :stockSymbol', {
                    stockSymbol: `%${filter.stockSymbol}%`
                });
            }
            if (filter.portfolioId) {
                queryBuilder.andWhere('transaction.portfolioId = :portfolioId', {
                    portfolioId: filter.portfolioId
                });
            }
            if (filter.startDate && filter.endDate) {
                queryBuilder.andWhere('transaction.transactionDate BETWEEN :startDate AND :endDate', {
                    startDate: filter.startDate,
                    endDate: filter.endDate,
                });
            }
        }
        queryBuilder.orderBy('transaction.transactionDate', 'DESC');
        const transactions = await queryBuilder.getMany();
        return transactions.map(transaction => this.mapToResponseDto(transaction, transaction.stock));
    }
    async getTransaction(userId, transactionId) {
        const transaction = await this.transactionRepository.findOne({
            where: { id: transactionId, userId },
            relations: ['stock'],
        });
        if (!transaction) {
            throw new common_1.NotFoundException('거래 내역을 찾을 수 없습니다.');
        }
        return this.mapToResponseDto(transaction, transaction.stock);
    }
    async updateTransaction(userId, transactionId, updateTransactionDto) {
        const transaction = await this.transactionRepository.findOne({
            where: { id: transactionId, userId },
            relations: ['stock'],
        });
        if (!transaction) {
            throw new common_1.NotFoundException('거래 내역을 찾을 수 없습니다.');
        }
        if (transaction.status === transaction_entity_1.TransactionStatus.COMPLETED) {
            throw new common_1.BadRequestException('완료된 거래는 수정할 수 없습니다.');
        }
        Object.assign(transaction, updateTransactionDto);
        const updatedTransaction = await this.transactionRepository.save(transaction);
        return this.mapToResponseDto(updatedTransaction, transaction.stock);
    }
    async deleteTransaction(userId, transactionId) {
        const transaction = await this.transactionRepository.findOne({
            where: { id: transactionId, userId },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('거래 내역을 찾을 수 없습니다.');
        }
        if (transaction.status === transaction_entity_1.TransactionStatus.COMPLETED) {
            throw new common_1.BadRequestException('완료된 거래는 삭제할 수 없습니다.');
        }
        await this.transactionRepository.remove(transaction);
    }
    async getTransactionStats(userId, filter) {
        const queryBuilder = this.transactionRepository
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.stock', 'stock')
            .where('transaction.userId = :userId', { userId });
        if (filter) {
            if (filter.transactionType) {
                queryBuilder.andWhere('transaction.transactionType = :transactionType', {
                    transactionType: filter.transactionType
                });
            }
            if (filter.status) {
                queryBuilder.andWhere('transaction.status = :status', { status: filter.status });
            }
            if (filter.stockSymbol) {
                queryBuilder.andWhere('stock.symbol ILIKE :stockSymbol', {
                    stockSymbol: `%${filter.stockSymbol}%`
                });
            }
            if (filter.portfolioId) {
                queryBuilder.andWhere('transaction.portfolioId = :portfolioId', {
                    portfolioId: filter.portfolioId
                });
            }
            if (filter.startDate && filter.endDate) {
                queryBuilder.andWhere('transaction.transactionDate BETWEEN :startDate AND :endDate', {
                    startDate: filter.startDate,
                    endDate: filter.endDate,
                });
            }
        }
        const transactions = await queryBuilder.getMany();
        const totalTransactions = transactions.length;
        const totalBuyTransactions = transactions.filter(t => t.transactionType === transaction_entity_1.TransactionType.BUY).length;
        const totalSellTransactions = transactions.filter(t => t.transactionType === transaction_entity_1.TransactionType.SELL).length;
        const totalVolume = transactions.reduce((sum, t) => sum + t.quantity, 0);
        const totalAmount = transactions.reduce((sum, t) => sum + Number(t.totalAmount), 0);
        const totalFees = transactions.reduce((sum, t) => sum + Number(t.fees), 0);
        const averageTransactionAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;
        const stockVolumeMap = new Map();
        transactions.forEach(t => {
            const symbol = t.stock.symbol;
            stockVolumeMap.set(symbol, (stockVolumeMap.get(symbol) || 0) + t.quantity);
        });
        let mostTradedStock = '';
        let mostTradedStockVolume = 0;
        stockVolumeMap.forEach((volume, symbol) => {
            if (volume > mostTradedStockVolume) {
                mostTradedStock = symbol;
                mostTradedStockVolume = volume;
            }
        });
        return new transaction_dto_1.TransactionStatsDto({
            totalTransactions,
            totalBuyTransactions,
            totalSellTransactions,
            totalVolume,
            totalAmount,
            totalFees,
            averageTransactionAmount,
            mostTradedStock,
            mostTradedStockVolume,
        });
    }
    async analyzeTransactions(userId, period = '30d') {
        const endDate = new Date();
        let startDate = new Date();
        switch (period) {
            case '7d':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(endDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(endDate.getDate() - 90);
                break;
            case '1y':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(endDate.getDate() - 30);
        }
        const transactions = await this.transactionRepository.find({
            where: {
                userId,
                transactionDate: (0, typeorm_2.Between)(startDate, endDate),
                status: transaction_entity_1.TransactionStatus.COMPLETED,
            },
            relations: ['stock'],
            order: { transactionDate: 'ASC' },
        });
        const trades = this.pairBuySellTransactions(transactions);
        const totalTrades = trades.length;
        const winningTrades = trades.filter(t => t.profit > 0).length;
        const losingTrades = trades.filter(t => t.profit < 0).length;
        const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
        const profits = trades.filter(t => t.profit > 0).map(t => t.profit);
        const losses = trades.filter(t => t.profit < 0).map(t => Math.abs(t.profit));
        const averageProfit = profits.length > 0 ? profits.reduce((sum, p) => sum + p, 0) / profits.length : 0;
        const averageLoss = losses.length > 0 ? losses.reduce((sum, l) => sum + l, 0) / losses.length : 0;
        const totalProfit = profits.reduce((sum, p) => sum + p, 0);
        const totalLoss = losses.reduce((sum, l) => sum + l, 0);
        const netProfit = totalProfit - totalLoss;
        const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : 0;
        const largestWin = profits.length > 0 ? Math.max(...profits) : 0;
        const largestLoss = losses.length > 0 ? Math.max(...losses) : 0;
        const holdingPeriods = trades.map(t => {
            const buyDate = new Date(t.buyTransaction.transactionDate);
            const sellDate = new Date(t.sellTransaction.transactionDate);
            return (sellDate.getTime() - buyDate.getTime()) / (1000 * 60 * 60 * 24);
        });
        const averageHoldingPeriod = holdingPeriods.length > 0
            ? holdingPeriods.reduce((sum, p) => sum + p, 0) / holdingPeriods.length
            : 0;
        return new transaction_dto_1.TransactionAnalysisDto({
            period,
            totalTrades,
            winningTrades,
            losingTrades,
            winRate,
            averageProfit,
            averageLoss,
            totalProfit,
            totalLoss,
            netProfit,
            profitFactor,
            largestWin,
            largestLoss,
            averageHoldingPeriod,
        });
    }
    pairBuySellTransactions(transactions) {
        const trades = [];
        const buyTransactions = transactions.filter(t => t.transactionType === transaction_entity_1.TransactionType.BUY);
        const sellTransactions = transactions.filter(t => t.transactionType === transaction_entity_1.TransactionType.SELL);
        for (const buy of buyTransactions) {
            const matchingSells = sellTransactions.filter(sell => sell.stockId === buy.stockId &&
                sell.transactionDate > buy.transactionDate);
            for (const sell of matchingSells) {
                const profit = (Number(sell.pricePerShare) - Number(buy.pricePerShare)) * Math.min(buy.quantity, sell.quantity);
                trades.push({
                    buyTransaction: buy,
                    sellTransaction: sell,
                    profit,
                });
            }
        }
        return trades;
    }
    async createAutoTradingTransaction(strategy, stock, signal, quantity, orderResult) {
        try {
            this.logger.log(`자동매매 거래 생성: ${signal.signalType} ${stock.symbol} ${quantity}주`);
            const portfolio = await this.portfolioRepository.findOne({
                where: { userId: strategy.userId },
                order: { createdAt: 'ASC' },
            });
            if (!portfolio) {
                throw new common_1.NotFoundException(`사용자 ${strategy.userId}의 포트폴리오를 찾을 수 없습니다.`);
            }
            const totalAmount = signal.price * quantity;
            const fees = this.calculateTradingFees(totalAmount);
            const transaction = this.transactionRepository.create({
                userId: strategy.userId,
                portfolioId: portfolio.id,
                stockId: stock.id,
                transactionType: signal.signalType === trading_strategy_types_1.SignalType.BUY ? 'BUY' : 'SELL',
                quantity: quantity,
                pricePerShare: signal.price,
                totalAmount: totalAmount,
                fees: fees,
                transactionDate: new Date(),
                status: orderResult.success ? transaction_entity_1.TransactionStatus.COMPLETED : transaction_entity_1.TransactionStatus.FAILED,
                notes: `자동매매 주문 (전략: ${strategy.name}, 주문ID: ${orderResult.orderId || 'N/A'})`,
            });
            const savedTransaction = await this.transactionRepository.save(transaction);
            this.logger.log(`자동매매 거래 저장 완료: ID ${savedTransaction.id}, ${signal.signalType} ${stock.symbol} ${quantity}주`);
            return savedTransaction;
        }
        catch (error) {
            this.logger.error('자동매매 거래 생성 오류:', error);
            throw error;
        }
    }
    calculateTradingFees(totalAmount) {
        const baseFee = 0.001;
        const minFee = 1.0;
        const maxFee = 50.0;
        const calculatedFee = totalAmount * baseFee;
        return Math.max(minFee, Math.min(calculatedFee, maxFee));
    }
    async getStrategyTransactionStats(strategyId) {
        try {
            const transactions = await this.transactionRepository.find({
                where: {
                    notes: `%자동매매 주문 (전략: ${strategyId}%`,
                },
                order: { transactionDate: 'DESC' },
            });
            const totalTrades = transactions.length;
            const buyTrades = transactions.filter(t => t.transactionType === 'BUY').length;
            const sellTrades = transactions.filter(t => t.transactionType === 'SELL').length;
            const totalVolume = transactions.reduce((sum, t) => sum + t.quantity, 0);
            const totalFees = transactions.reduce((sum, t) => sum + Number(t.fees), 0);
            const averagePrice = totalTrades > 0
                ? transactions.reduce((sum, t) => sum + Number(t.pricePerShare), 0) / totalTrades
                : 0;
            const lastTradeDate = totalTrades > 0 ? transactions[0].transactionDate : null;
            return {
                totalTrades,
                buyTrades,
                sellTrades,
                totalVolume,
                totalFees,
                averagePrice: Math.round(averagePrice * 100) / 100,
                lastTradeDate,
            };
        }
        catch (error) {
            this.logger.error('전략별 거래 통계 조회 오류:', error);
            return {
                totalTrades: 0,
                buyTrades: 0,
                sellTrades: 0,
                totalVolume: 0,
                totalFees: 0,
                averagePrice: 0,
                lastTradeDate: null,
            };
        }
    }
    mapToResponseDto(transaction, stock) {
        return new transaction_dto_1.TransactionResponseDto({
            id: transaction.id,
            userId: transaction.userId,
            portfolioId: transaction.portfolioId,
            stockSymbol: stock.symbol,
            stockName: stock.name,
            transactionType: transaction.transactionType,
            quantity: transaction.quantity,
            pricePerShare: Number(transaction.pricePerShare),
            totalAmount: Number(transaction.totalAmount),
            fees: Number(transaction.fees),
            totalWithFees: Number(transaction.totalAmount) + Number(transaction.fees),
            transactionDate: transaction.transactionDate,
            status: transaction.status,
            notes: transaction.notes,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = TransactionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(portfolio_entity_1.Portfolio)),
    __param(3, (0, typeorm_1.InjectRepository)(stock_entity_1.Stock)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map