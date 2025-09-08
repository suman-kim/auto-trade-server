export declare class StockPriceDto {
    symbol: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    date: string;
    change?: number;
    changePercent?: number;
}
export declare class StockInfoDto {
    symbol: string;
    name: string;
    sector?: string;
    industry?: string;
    exchange?: string;
    currency?: string;
    marketCap?: number;
    peRatio?: number;
    dividendYield?: number;
}
export declare class StockSearchDto {
    query: string;
    limit?: number;
}
export declare class StockPriceUpdateDto {
    symbol: string;
    interval: 'realtime' | 'daily' | 'weekly' | 'monthly';
}
export declare class StockPriceResponseDto {
    symbol: string;
    currentPrice: number;
    previousClose: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap?: number;
    high: number;
    low: number;
    open: number;
    timestamp: Date;
    constructor(data: any);
}
export declare class StockHistoryResponseDto {
    symbol: string;
    prices: StockPriceDto[];
    period: string;
    lastUpdated: Date;
    constructor(symbol: string, prices: StockPriceDto[], period: string);
}
export declare class StockAlertDto {
    symbol: string;
    targetPrice: number;
    condition: 'above' | 'below';
    message?: string;
}
export declare class StockStatsDto {
    symbol: string;
    avgPrice: number;
    maxPrice: number;
    minPrice: number;
    totalVolume: number;
    priceVolatility: number;
    period: string;
    constructor(data: any);
}
