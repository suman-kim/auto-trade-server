import { Repository } from 'typeorm';
import { Stock } from '../../entities/stock.entity';
import { StockInfoDto, StockPriceResponseDto, StockHistoryResponseDto, StockStatsDto } from '../../dtos/stock.dto';
export declare class StocksService {
    private readonly stockRepository;
    private readonly logger;
    constructor(stockRepository: Repository<Stock>);
    updateStockPrice(symbol: string): Promise<StockPriceResponseDto>;
    getStockInfo(symbol: string): Promise<Stock>;
    getAllStocks(): Promise<Stock[]>;
    getStockHistory(symbol: string, days?: number): Promise<StockHistoryResponseDto>;
    searchStocks(query: string, limit?: number): Promise<StockInfoDto[]>;
    getStockStats(symbol: string, days?: number): Promise<StockStatsDto>;
    updateMultipleStocks(symbols: string[]): Promise<StockPriceResponseDto[]>;
    saveStockInfo(stockInfo: StockInfoDto): Promise<Stock>;
    deleteStock(symbol: string): Promise<void>;
    checkPriceCondition(symbol: string, targetPrice: number, condition: 'above' | 'below'): Promise<boolean>;
    getPriceChangePercent(symbol: string, days?: number): Promise<number>;
    getCurrentPrice(symbol: string): Promise<number>;
    updateStockPriceInfo(symbol: string, currentPrice: number, highPrice: number | null, lowPrice: number | null, volume: number): Promise<Stock | null>;
}
