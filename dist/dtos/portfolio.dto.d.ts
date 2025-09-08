export declare class CreatePortfolioDto {
    name: string;
    description?: string;
}
export declare class UpdatePortfolioDto {
    name?: string;
    description?: string;
}
export declare class AddHoldingDto {
    symbol: string;
    quantity: number;
    averagePrice: number;
    purchaseDate?: string;
    notes?: string;
}
export declare class UpdateHoldingDto {
    quantity?: number;
    averagePrice?: number;
    notes?: string;
}
export declare class PortfolioResponseDto {
    id: number;
    name: string;
    description?: string;
    riskLevel?: string;
    targetReturn?: number;
    totalValue: number;
    totalCost: number;
    totalReturn: number;
    totalReturnPercent: number;
    holdingsCount: number;
    createdAt: string;
    updatedAt: string;
}
export declare class PortfolioHoldingResponseDto {
    id: number;
    symbol: string;
    companyName: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    marketValue: number;
    totalCost: number;
    unrealizedGain: number;
    unrealizedGainPercent: number;
    purchaseDate: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
export declare class PortfolioSummaryDto {
    id: number;
    name: string;
    totalValue: number;
    totalCost: number;
    totalReturn: number;
    totalReturnPercent: number;
    holdingsCount: number;
    lastUpdated: string;
}
export declare class PortfolioPerformanceDto {
    portfolioId: number;
    portfolioName: string;
    totalValue: number;
    totalCost: number;
    totalReturn: number;
    totalReturnPercent: number;
    dailyReturn: number;
    dailyReturnPercent: number;
    weeklyReturn: number;
    weeklyReturnPercent: number;
    monthlyReturn: number;
    monthlyReturnPercent: number;
    yearlyReturn: number;
    yearlyReturnPercent: number;
    sharpeRatio: number;
    maxDrawdown: number;
    volatility: number;
    lastUpdated: string;
}
export declare class RebalancePortfolioDto {
    symbol: string;
    targetPercentage: number;
    notes?: string;
}
export declare class ExportPortfolioDto {
    format: 'csv' | 'pdf' | 'json';
    startDate?: string;
    endDate?: string;
    dataType?: 'all' | 'holdings' | 'transactions' | 'performance';
}
