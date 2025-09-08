import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionDto, TransactionFilterDto, TransactionResponseDto, TransactionStatsDto, TransactionAnalysisDto } from '../../dtos/transaction.dto';
import { User } from '../../entities/user.entity';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    createTransaction(user: User, createTransactionDto: CreateTransactionDto): Promise<TransactionResponseDto>;
    getUserTransactions(user: User, filter: TransactionFilterDto): Promise<TransactionResponseDto[]>;
    getTransaction(user: User, transactionId: number): Promise<TransactionResponseDto>;
    updateTransaction(user: User, transactionId: number, updateTransactionDto: UpdateTransactionDto): Promise<TransactionResponseDto>;
    deleteTransaction(user: User, transactionId: number): Promise<void>;
    getTransactionStats(user: User, filter: TransactionFilterDto): Promise<TransactionStatsDto>;
    analyzeTransactions(user: User, period?: string): Promise<TransactionAnalysisDto>;
    getPortfolioTransactions(user: User, portfolioId: number, filter: TransactionFilterDto): Promise<TransactionResponseDto[]>;
    getStockTransactions(user: User, symbol: string, filter: TransactionFilterDto): Promise<TransactionResponseDto[]>;
    getTransactionsByPeriod(user: User, startDate: string, endDate: string, filter: TransactionFilterDto): Promise<TransactionResponseDto[]>;
}
