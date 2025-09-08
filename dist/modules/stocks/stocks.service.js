"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var StocksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StocksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stock_entity_1 = require("../../entities/stock.entity");
const stock_dto_1 = require("../../dtos/stock.dto");
let StocksService = StocksService_1 = class StocksService {
    stockRepository;
    logger = new common_1.Logger(StocksService_1.name);
    constructor(stockRepository) {
        this.stockRepository = stockRepository;
    }
    async updateStockPrice(symbol) {
        try {
            const priceData = {};
            let stock = await this.stockRepository.findOne({
                where: { symbol: symbol.toUpperCase() },
            });
            if (!stock) {
                const stockInfo = {
                    symbol,
                    name: '',
                    sector: '',
                    industry: '',
                    exchange: '',
                    currency: '',
                    marketCap: 0,
                    peRatio: 0,
                    dividendYield: 0,
                };
                stock = this.stockRepository.create({
                    symbol: stockInfo.symbol,
                    companyName: stockInfo.name,
                    name: stockInfo.name,
                    sector: stockInfo.sector,
                    industry: stockInfo.industry,
                    exchange: stockInfo.exchange,
                    currency: stockInfo.currency,
                    currentPrice: priceData.price,
                    previousClose: priceData.prevClose,
                    high: priceData.high,
                    low: priceData.low,
                    volume: priceData.volume,
                    marketCap: stockInfo.marketCap,
                    peRatio: stockInfo.peRatio,
                    dividendYield: stockInfo.dividendYield,
                });
            }
            else {
                stock.previousClose = stock.currentPrice;
                stock.currentPrice = priceData.price;
                stock.high = priceData.high;
                stock.low = priceData.low;
                stock.volume = priceData.volume;
                stock.lastUpdated = new Date();
            }
            await this.stockRepository.save(stock);
            return new stock_dto_1.StockPriceResponseDto({
                symbol: stock.symbol,
                currentPrice: stock.currentPrice,
                previousClose: stock.previousClose,
                change: priceData.change,
                changePercent: priceData.changePercent,
                volume: stock.volume,
                marketCap: stock.marketCap,
                high: stock.high,
                low: stock.low,
                open: priceData.open,
                timestamp: stock.lastUpdated,
            });
        }
        catch (error) {
            this.logger.error(`주식 가격 업데이트 실패 (${symbol}):`, error.message);
            throw error;
        }
    }
    async getStockInfo(symbol) {
        const stock = await this.stockRepository.findOne({
            where: { symbol: symbol.toUpperCase() },
        });
        if (!stock) {
            throw new common_1.NotFoundException(`주식 정보를 찾을 수 없습니다: ${symbol}`);
        }
        return stock;
    }
    async getAllStocks() {
        return await this.stockRepository.find({
            order: { symbol: 'ASC' },
        });
    }
    async getStockHistory(symbol, days = 30) {
        const prices = [];
        const stockPrices = prices.map(price => ({
            symbol,
            date: price.date,
            open: price.open,
            high: price.high,
            low: price.low,
            close: price.close,
            volume: price.volume,
        }));
        return new stock_dto_1.StockHistoryResponseDto(symbol, stockPrices, `${days}일`);
    }
    async searchStocks(query, limit = 10) {
        const searchResults = [];
        return searchResults.map(result => ({
            symbol: result.symbol,
            name: result.name,
            sector: 'Unknown',
            industry: 'Unknown',
            exchange: result.exchange,
            currency: result.currency,
            marketCap: 0,
            peRatio: 0,
            dividendYield: 0,
        }));
    }
    async getStockStats(symbol, days = 30) {
        const prices = [];
        if (prices.length === 0) {
            throw new common_1.NotFoundException(`주식 데이터를 찾을 수 없습니다: ${symbol}`);
        }
        const closePrices = prices.map(p => p.close);
        const volumes = prices.map(p => p.volume);
        const avgPrice = closePrices.reduce((sum, price) => sum + price, 0) / closePrices.length;
        const maxPrice = Math.max(...closePrices);
        const minPrice = Math.min(...closePrices);
        const totalVolume = volumes.reduce((sum, volume) => sum + volume, 0);
        const variance = closePrices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / closePrices.length;
        const priceVolatility = Math.sqrt(variance);
        return new stock_dto_1.StockStatsDto({
            symbol,
            avgPrice,
            maxPrice,
            minPrice,
            totalVolume,
            priceVolatility,
            period: `${days}일`,
        });
    }
    async updateMultipleStocks(symbols) {
        const results = [];
        for (const symbol of symbols) {
            try {
                const result = await this.updateStockPrice(symbol);
                results.push(result);
            }
            catch (error) {
                this.logger.error(`주식 업데이트 실패 (${symbol}):`, error.message);
            }
        }
        return results;
    }
    async saveStockInfo(stockInfo) {
        let stock = await this.stockRepository.findOne({
            where: { symbol: stockInfo.symbol },
        });
        if (!stock) {
            stock = this.stockRepository.create({
                symbol: stockInfo.symbol,
                companyName: stockInfo.name,
                name: stockInfo.name,
                sector: stockInfo.sector,
                industry: stockInfo.industry,
                exchange: stockInfo.exchange,
                currency: stockInfo.currency,
                marketCap: stockInfo.marketCap,
                peRatio: stockInfo.peRatio,
                dividendYield: stockInfo.dividendYield,
            });
        }
        else {
            Object.assign(stock, stockInfo);
        }
        return await this.stockRepository.save(stock);
    }
    async deleteStock(symbol) {
        const stock = await this.getStockInfo(symbol);
        await this.stockRepository.remove(stock);
    }
    async checkPriceCondition(symbol, targetPrice, condition) {
        const stock = await this.getStockInfo(symbol);
        if (condition === 'above') {
            return stock.currentPrice >= targetPrice;
        }
        else {
            return stock.currentPrice <= targetPrice;
        }
    }
    async getPriceChangePercent(symbol, days = 1) {
        const prices = [];
        if (prices.length < 2) {
            throw new common_1.NotFoundException(`충분한 히스토리 데이터가 없습니다: ${symbol}`);
        }
        const currentPrice = prices[0].close;
        const previousPrice = prices[1].close;
        return ((currentPrice - previousPrice) / previousPrice) * 100;
    }
    async getCurrentPrice(symbol) {
        try {
            const stock = await this.stockRepository.findOne({
                where: { symbol: symbol.toUpperCase() },
            });
            if (!stock || !stock.currentPrice) {
                return 100.0;
            }
            return stock.currentPrice;
        }
        catch (error) {
            this.logger.error(`현재 가격 조회 실패 (${symbol}):`, error.message);
            return 100.0;
        }
    }
    async updateStockPriceInfo(symbol, currentPrice, highPrice, lowPrice, volume) {
        try {
            let stock = await this.getStockInfo(symbol);
            if (!stock) {
                stock = this.stockRepository.create({
                    symbol,
                    name: symbol,
                    currentPrice,
                    high: highPrice || currentPrice,
                    low: lowPrice || currentPrice,
                    volume: volume || 0,
                });
            }
            else {
                stock.currentPrice = currentPrice;
                if (highPrice !== null)
                    stock.high = highPrice;
                if (lowPrice !== null)
                    stock.low = lowPrice;
                if (volume !== null)
                    stock.volume = volume;
            }
            return await this.stockRepository.save(stock);
        }
        catch (error) {
            this.logger.error(`주식 가격 정보 업데이트 실패 (${symbol}):`, error);
            return null;
        }
    }
};
exports.StocksService = StocksService;
exports.StocksService = StocksService = StocksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stock_entity_1.Stock)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StocksService);
//# sourceMappingURL=stocks.service.js.map