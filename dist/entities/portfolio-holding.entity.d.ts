import { Portfolio } from './portfolio.entity';
import { Stock } from './stock.entity';
export declare class PortfolioHolding {
    id: number;
    portfolioId: number;
    stockId: number;
    quantity: number;
    averagePrice: number;
    totalInvested: number;
    createdAt: Date;
    updatedAt: Date;
    portfolio: Portfolio;
    stock: Stock;
    get currentValue(): number;
    get returnRate(): number;
    get profitLoss(): number;
    isProfitable(): boolean;
}
