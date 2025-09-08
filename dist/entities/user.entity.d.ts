import { Portfolio } from './portfolio.entity';
import { Transaction } from './transaction.entity';
import { TradingStrategy } from './trading-strategy.entity';
import { Notification } from './notification.entity';
import { PriceAlert } from './price-alert.entity';
export declare class User {
    id: number;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    kisAccountNumber: string;
    kisDemoAccountNumber: string;
    portfolios: Portfolio[];
    transactions: Transaction[];
    tradingStrategies: TradingStrategy[];
    notifications: Notification[];
    priceAlerts: PriceAlert[];
    get fullName(): string;
    isUserActive(): boolean;
}
