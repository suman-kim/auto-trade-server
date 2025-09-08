import { TransactionType, TransactionStatus } from '../entities/transaction.entity';
export declare class CreateTransactionDto {
    portfolioId: number;
    stockSymbol: string;
    transactionType: TransactionType;
    quantity: number;
    pricePerShare: number;
    fees?: number;
    notes?: string;
}
export declare class UpdateTransactionDto {
    status?: TransactionStatus;
    fees?: number;
    notes?: string;
}
export declare class TransactionFilterDto {
    transactionType?: TransactionType;
    status?: TransactionStatus;
    stockSymbol?: string;
    startDate?: string;
    endDate?: string;
    portfolioId?: number;
}
export declare class TransactionResponseDto {
    id: number;
    userId: number;
    portfolioId: number;
    stockSymbol: string;
    stockName: string;
    transactionType: TransactionType;
    quantity: number;
    pricePerShare: number;
    totalAmount: number;
    fees: number;
    totalWithFees: number;
    transactionDate: Date;
    status: TransactionStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<TransactionResponseDto>);
}
export declare class TransactionStatsDto {
    totalTransactions: number;
    totalBuyTransactions: number;
    totalSellTransactions: number;
    totalVolume: number;
    totalAmount: number;
    totalFees: number;
    averageTransactionAmount: number;
    mostTradedStock: string;
    mostTradedStockVolume: number;
    constructor(partial: Partial<TransactionStatsDto>);
}
export declare class TransactionAnalysisDto {
    period: string;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    averageProfit: number;
    averageLoss: number;
    totalProfit: number;
    totalLoss: number;
    netProfit: number;
    profitFactor: number;
    largestWin: number;
    largestLoss: number;
    averageHoldingPeriod: number;
    constructor(partial: Partial<TransactionAnalysisDto>);
}
