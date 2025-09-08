import { Repository } from 'typeorm';
import { Transaction } from '../../entities/transaction.entity';
import { User } from '../../entities/user.entity';
import { Portfolio } from '../../entities/portfolio.entity';
import { Stock } from '../../entities/stock.entity';
import { TradingStrategy } from '../../entities/trading-strategy.entity';
import { TradingSignal } from '../../entities/trading-signal.entity';
import { CreateTransactionDto, UpdateTransactionDto, TransactionFilterDto, TransactionResponseDto, TransactionStatsDto, TransactionAnalysisDto } from '../../dtos/transaction.dto';
export declare class TransactionsService {
    private readonly transactionRepository;
    private readonly userRepository;
    private readonly portfolioRepository;
    private readonly stockRepository;
    private readonly logger;
    constructor(transactionRepository: Repository<Transaction>, userRepository: Repository<User>, portfolioRepository: Repository<Portfolio>, stockRepository: Repository<Stock>);
    createTransaction(userId: number, createTransactionDto: CreateTransactionDto): Promise<TransactionResponseDto>;
    getUserTransactions(userId: number, filter?: TransactionFilterDto): Promise<TransactionResponseDto[]>;
    getTransaction(userId: number, transactionId: number): Promise<TransactionResponseDto>;
    updateTransaction(userId: number, transactionId: number, updateTransactionDto: UpdateTransactionDto): Promise<TransactionResponseDto>;
    deleteTransaction(userId: number, transactionId: number): Promise<void>;
    getTransactionStats(userId: number, filter?: TransactionFilterDto): Promise<TransactionStatsDto>;
    analyzeTransactions(userId: number, period?: string): Promise<TransactionAnalysisDto>;
    private pairBuySellTransactions;
    createAutoTradingTransaction(strategy: TradingStrategy, stock: Stock, signal: TradingSignal, quantity: number, orderResult: {
        success: boolean;
        orderId?: string;
        error?: string;
    }): Promise<Transaction>;
    private calculateTradingFees;
    getStrategyTransactionStats(strategyId: number): Promise<{
        totalTrades: number;
        buyTrades: number;
        sellTrades: number;
        totalVolume: number;
        totalFees: number;
        averagePrice: number;
        lastTradeDate: Date | null;
    }>;
    private mapToResponseDto;
}
