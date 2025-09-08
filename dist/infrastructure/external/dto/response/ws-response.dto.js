"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KISWebSocketParser = void 0;
const kis_constants_1 = require("../kis-constants");
class KISWebSocketParser {
    static parseRawData(rawData) {
        const parts = rawData.split('|');
        if (parts.length < 4) {
            throw new Error('Invalid websocket data format');
        }
        const header = {
            status: parts[0],
            trId: parts[1],
            contentLength: parts[2],
        };
        const dataFields = parts[3].split('^');
        if (dataFields.length < 16) {
            throw new Error(`Insufficient data fields. Expected at least 16, got ${dataFields.length}`);
        }
        let body;
        if (header.trId === kis_constants_1.KISTransactionID.OVERSEAS_STOCK_REAL_TIME_TRADE_DELAYED) {
            const obj = {
                trKey: dataFields[0],
                stockCode: dataFields[1],
                decimalPlaces: parseFloat(dataFields[2]),
                localBusinessDate: dataFields[3],
                localDate: dataFields[4],
                localTime: dataFields[5],
                koreanDate: dataFields[6],
                koreanTime: dataFields[7],
                openPrice: parseFloat(dataFields[8]),
                highPrice: parseFloat(dataFields[9]),
                lowPrice: parseFloat(dataFields[10]),
                currentPrice: parseFloat(dataFields[11]),
                changeSign: parseFloat(dataFields[12]),
                changeDiff: parseFloat(dataFields[13]),
                changeRate: parseFloat(dataFields[14]),
                bidPrice: parseFloat(dataFields[15]),
                askPrice: parseFloat(dataFields[16]),
                bidVolume: parseFloat(dataFields[17]),
                askVolume: parseFloat(dataFields[18]),
                tradeVolume: parseFloat(dataFields[19]),
                totalVolume: parseFloat(dataFields[20]),
                tradeAmount: parseFloat(dataFields[21]),
                sellTradeVolume: parseFloat(dataFields[22]),
                buyTradeVolume: parseFloat(dataFields[23]),
                tradeStrength: parseFloat(dataFields[24]),
                marketType: parseFloat(dataFields[25])
            };
            body = obj;
        }
        if (header.trId === kis_constants_1.KISTransactionID.OVERSEAS_STOCK_REAL_TIME_TRADE) {
            const obj = {
                trKey: dataFields[0],
                stockCode: dataFields[1],
                field1: dataFields[2],
                localDate: dataFields[3],
                localTime: dataFields[4],
                koreanDate: dataFields[5],
                koreanTime: dataFields[6],
                bidTotalQuantity: parseFloat(dataFields[7]),
                askTotalQuantity: parseFloat(dataFields[8]),
                bidTotalQuantityRatio: parseFloat(dataFields[9]),
                askTotalQuantityRatio: parseFloat(dataFields[10]),
                bidPrice: parseFloat(dataFields[11]),
                askPrice: parseFloat(dataFields[12]),
                bidQuantity: parseFloat(dataFields[13]),
                askQuantity: parseFloat(dataFields[14]),
                bidQuantityRatio: parseFloat(dataFields[15]),
                askQuantityRatio: parseFloat(dataFields[16]),
            };
            body = obj;
        }
        return { header, body };
    }
    static parseDateTime(date, time) {
        const year = parseFloat(date.substring(0, 4));
        const month = parseFloat(date.substring(4, 6)) - 1;
        const day = parseFloat(date.substring(6, 8));
        const hour = parseFloat(time.substring(0, 2));
        const minute = parseFloat(time.substring(2, 4));
        const second = parseFloat(time.substring(4, 6));
        return new Date(year, month, day, hour, minute, second);
    }
}
exports.KISWebSocketParser = KISWebSocketParser;
//# sourceMappingURL=ws-response.dto.js.map