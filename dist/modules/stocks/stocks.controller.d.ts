import { StocksService } from './stocks.service';
import { StockPriceUpdateDto, StockSearchDto, StockAlertDto, StockPriceResponseDto, StockHistoryResponseDto, StockStatsDto } from '../../dtos/stock.dto';
export declare class StocksController {
    private readonly stocksService;
    constructor(stocksService: StocksService);
    getStockPrice(symbol: string): Promise<StockPriceResponseDto>;
    getStockInfo(symbol: string): Promise<import("../../entities").Stock>;
    getAllStocks(): Promise<import("../../entities").Stock[]>;
    getStockHistory(symbol: string, days?: string): Promise<StockHistoryResponseDto>;
    searchStocks(searchDto: StockSearchDto): Promise<import("../../dtos/stock.dto").StockInfoDto[]>;
    getStockStats(symbol: string, days?: string): Promise<StockStatsDto>;
    updateStockPrice(symbol: string, updateDto: StockPriceUpdateDto): Promise<StockPriceResponseDto>;
    updateMultipleStocks(symbols: string[]): Promise<StockPriceResponseDto[]>;
    checkPriceCondition(symbol: string, alertDto: StockAlertDto): Promise<boolean>;
    getPriceChangePercent(symbol: string, days?: string): Promise<{
        symbol: string;
        changePercent: number;
        days: number;
    }>;
    deleteStock(symbol: string): Promise<{
        message: string;
    }>;
    getTeslaPrice(): Promise<StockPriceResponseDto>;
    getTeslaHistory(days?: string): Promise<StockHistoryResponseDto>;
    getTeslaStats(days?: string): Promise<StockStatsDto>;
}
