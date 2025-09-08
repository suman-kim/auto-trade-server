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
var TechnicalIndicatorsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicalIndicatorsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stock_entity_1 = require("../../entities/stock.entity");
let TechnicalIndicatorsService = TechnicalIndicatorsService_1 = class TechnicalIndicatorsService {
    stockRepository;
    logger = new common_1.Logger(TechnicalIndicatorsService_1.name);
    constructor(stockRepository) {
        this.stockRepository = stockRepository;
    }
    calculateRSI(prices, period = 14) {
        if (prices.length < period + 1) {
            return 50;
        }
        const gains = [];
        const losses = [];
        for (let i = 1; i < prices.length; i++) {
            const change = prices[i] - prices[i - 1];
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? Math.abs(change) : 0);
        }
        const avgGain = this.calculateEMA(gains, period);
        const avgLoss = this.calculateEMA(losses, period);
        if (avgLoss === 0) {
            return 100;
        }
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        return Math.round(rsi * 100) / 100;
    }
    calculateSMA(prices, period) {
        if (prices.length < period) {
            return prices[prices.length - 1] || 0;
        }
        const sum = prices.slice(-period).reduce((acc, price) => acc + price, 0);
        return Math.round((sum / period) * 100) / 100;
    }
    calculateEMA(prices, period) {
        if (prices.length < period) {
            return prices[prices.length - 1] || 0;
        }
        const multiplier = 2 / (period + 1);
        let ema = prices[0];
        for (let i = 1; i < prices.length; i++) {
            ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
        }
        return Math.round(ema * 100) / 100;
    }
    calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
        if (prices.length < slowPeriod) {
            return { macd: 0, signal: 0, histogram: 0 };
        }
        const fastEMA = this.calculateEMA(prices, fastPeriod);
        const slowEMA = this.calculateEMA(prices, slowPeriod);
        const macd = fastEMA - slowEMA;
        const macdHistory = this.calculateMACDHistory(prices, fastPeriod, slowPeriod);
        const signal = this.calculateEMA(macdHistory, signalPeriod);
        const histogram = macd - signal;
        return {
            macd: Math.round(macd * 100) / 100,
            signal: Math.round(signal * 100) / 100,
            histogram: Math.round(histogram * 100) / 100,
        };
    }
    calculateMACDHistory(prices, fastPeriod, slowPeriod) {
        const macdHistory = [];
        for (let i = slowPeriod - 1; i < prices.length; i++) {
            const periodPrices = prices.slice(0, i + 1);
            const fastEMA = this.calculateEMA(periodPrices, fastPeriod);
            const slowEMA = this.calculateEMA(periodPrices, slowPeriod);
            macdHistory.push(fastEMA - slowEMA);
        }
        return macdHistory;
    }
    calculateBollingerBands(prices, period = 20, standardDeviations = 2) {
        if (prices.length < period) {
            const currentPrice = prices[prices.length - 1] || 0;
            return { upper: currentPrice, middle: currentPrice, lower: currentPrice };
        }
        const periodPrices = prices.slice(-period);
        const middle = this.calculateSMA(periodPrices, period);
        const variance = periodPrices.reduce((acc, price) => {
            return acc + Math.pow(price - middle, 2);
        }, 0) / period;
        const standardDeviation = Math.sqrt(variance);
        const upper = middle + (standardDeviation * standardDeviations);
        const lower = middle - (standardDeviation * standardDeviations);
        return {
            upper: Math.round(upper * 100) / 100,
            middle: Math.round(middle * 100) / 100,
            lower: Math.round(lower * 100) / 100,
        };
    }
    calculateVolumeMA(volumes, period) {
        if (volumes.length < period) {
            return volumes[volumes.length - 1] || 0;
        }
        const sum = volumes.slice(-period).reduce((acc, volume) => acc + volume, 0);
        return Math.round(sum / period);
    }
    calculatePriceChangePercent(currentPrice, previousPrice) {
        if (previousPrice === 0)
            return 0;
        return Math.round(((currentPrice - previousPrice) / previousPrice) * 100 * 100) / 100;
    }
    calculateVolumeChangePercent(currentVolume, previousVolume) {
        if (previousVolume === 0)
            return 0;
        return Math.round(((currentVolume - previousVolume) / previousVolume) * 100 * 100) / 100;
    }
    async getRecentPrices(stockId, days = 30) {
        const stock = await this.stockRepository.findOne({ where: { id: stockId } });
        if (!stock)
            return [];
        return Array(days).fill(stock.currentPrice);
    }
    async getRecentVolumes(stockId, days = 30) {
        const stock = await this.stockRepository.findOne({ where: { id: stockId } });
        if (!stock)
            return [];
        return Array(days).fill(stock.volume || 0);
    }
    async calculateAllIndicators(stockId, indicators) {
        const result = {};
        try {
            if (indicators.rsi) {
                const prices = await this.getRecentPrices(stockId, indicators.rsi.period + 10);
                result.rsi = this.calculateRSI(prices, indicators.rsi.period);
            }
            if (indicators.movingAverage) {
                this.logger.debug(`이동평균 계산: ${JSON.stringify(indicators.movingAverage)}`);
                const prices = await this.getRecentPrices(stockId, indicators.movingAverage.longPeriod + 10);
                if (indicators.movingAverage.type === 'sma') {
                    result.shortMA = this.calculateSMA(prices, indicators.movingAverage.shortPeriod);
                    result.longMA = this.calculateSMA(prices, indicators.movingAverage.longPeriod);
                }
                else {
                    result.shortMA = this.calculateEMA(prices, indicators.movingAverage.shortPeriod);
                    result.longMA = this.calculateEMA(prices, indicators.movingAverage.longPeriod);
                }
            }
            if (indicators.macd) {
                const prices = await this.getRecentPrices(stockId, indicators.macd.slowPeriod + 20);
                result.macd = this.calculateMACD(prices, indicators.macd.fastPeriod, indicators.macd.slowPeriod, indicators.macd.signalPeriod);
            }
            if (indicators.bollingerBands) {
                const prices = await this.getRecentPrices(stockId, indicators.bollingerBands.period + 10);
                result.bollingerBands = this.calculateBollingerBands(prices, indicators.bollingerBands.period, indicators.bollingerBands.standardDeviations);
            }
            if (indicators.volumeMA) {
                const volumes = await this.getRecentVolumes(stockId, indicators.volumeMA.period + 10);
                result.volumeMA = this.calculateVolumeMA(volumes, indicators.volumeMA.period);
            }
        }
        catch (error) {
            this.logger.error(`지표 계산 중 오류 발생: ${error.message}`);
        }
        return result;
    }
};
exports.TechnicalIndicatorsService = TechnicalIndicatorsService;
exports.TechnicalIndicatorsService = TechnicalIndicatorsService = TechnicalIndicatorsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stock_entity_1.Stock)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TechnicalIndicatorsService);
//# sourceMappingURL=technical-indicators.service.js.map