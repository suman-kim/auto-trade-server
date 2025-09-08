export interface KISWebSocketHeader {
    status: string;
    trId: string;
    contentLength: string;
}
export type KisRawFrame = {
    flag: string;
    trId: string;
    code: string;
    payload: string;
};
export interface OverseasStockRealTimeQuote {
    trKey: string;
    stockCode: string;
    field1: string;
    localDate: string;
    localTime: string;
    koreanDate: string;
    koreanTime: string;
    bidTotalQuantity: number;
    askTotalQuantity: number;
    bidTotalQuantityRatio: number;
    askTotalQuantityRatio: number;
    bidPrice: number;
    askPrice: number;
    bidQuantity: number;
    askQuantity: number;
    bidQuantityRatio: number;
    askQuantityRatio: number;
}
export interface OverseasStockRealTimeTrade {
    trKey: string;
    stockCode: string;
    decimalPlaces: number;
    localBusinessDate: string;
    localDate: string;
    localTime: string;
    koreanDate: string;
    koreanTime: string;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    currentPrice: number;
    changeSign: number;
    changeDiff: number;
    changeRate: number;
    bidPrice: number;
    askPrice: number;
    bidVolume: number;
    askVolume: number;
    tradeVolume: number;
    totalVolume: number;
    tradeAmount: number;
    sellTradeVolume: number;
    buyTradeVolume: number;
    tradeStrength: number;
    marketType: number;
}
export declare class KISWebSocketParser {
    static parseRawData(rawData: string): {
        header: KISWebSocketHeader;
        body: any;
    };
    static parseDateTime(date: string, time: string): Date;
}
