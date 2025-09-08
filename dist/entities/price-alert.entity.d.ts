import { User } from './user.entity';
import { Stock } from './stock.entity';
export declare enum PriceAlertType {
    ABOVE = "ABOVE",
    BELOW = "BELOW"
}
export declare class PriceAlert {
    id: number;
    userId: number;
    stockId: number;
    alertType: 'ABOVE' | 'BELOW';
    targetPrice: number;
    isActive: boolean;
    createdAt: Date;
    user: User;
    stock: Stock;
    isAlertActive(): boolean;
    isTriggered(currentPrice: number): boolean;
    isAboveAlert(): boolean;
    isBelowAlert(): boolean;
    deactivate(): void;
    activate(): void;
}
