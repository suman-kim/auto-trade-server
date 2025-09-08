import { User } from './user.entity';
import { PortfolioHolding } from './portfolio-holding.entity';
import { Transaction } from './transaction.entity';
export declare class Portfolio {
    id: number;
    userId: number;
    name: string;
    description: string;
    foreignPurchaseAmount1: number;
    totalEvaluationProfitAmount: number;
    totalProfitRate: number;
    foreignPurchaseAmountSum1: number;
    foreignPurchaseAmountSum2: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    holdings: PortfolioHolding[];
    transactions: Transaction[];
    get totalInvested(): number;
}
