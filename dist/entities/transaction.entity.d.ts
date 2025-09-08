import { User } from './user.entity';
import { Portfolio } from './portfolio.entity';
import { Stock } from './stock.entity';
export declare enum TransactionType {
    BUY = "BUY",
    SELL = "SELL"
}
export declare enum TransactionStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED"
}
export declare class Transaction {
    id: number;
    userId: number;
    portfolioId: number;
    stockId: number;
    transactionType: 'BUY' | 'SELL';
    quantity: number;
    pricePerShare: number;
    totalAmount: number;
    transactionDate: Date;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
    fees: number;
    notes: string;
    user: User;
    portfolio: Portfolio;
    stock: Stock;
    isBuy(): boolean;
    isSell(): boolean;
    isCompleted(): boolean;
    get totalWithFees(): number;
    isSuccessful(): boolean;
}
