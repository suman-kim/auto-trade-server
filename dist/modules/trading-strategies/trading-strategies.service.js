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
var TradingStrategiesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradingStrategiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const trading_strategy_entity_1 = require("../../entities/trading-strategy.entity");
const trading_signal_entity_1 = require("../../entities/trading-signal.entity");
const trading_strategy_types_1 = require("../../shared/types/trading-strategy.types");
const backtest_result_entity_1 = require("../../entities/backtest-result.entity");
const stock_entity_1 = require("../../entities/stock.entity");
const user_entity_1 = require("../../entities/user.entity");
const kis_api_service_1 = require("../../infrastructure/external/kis-api.service");
const technical_indicators_service_1 = require("../../infrastructure/services/technical-indicators.service");
const common_2 = require("@nestjs/common");
let TradingStrategiesService = TradingStrategiesService_1 = class TradingStrategiesService {
    tradingStrategyRepository;
    tradingSignalRepository;
    backtestResultRepository;
    stockRepository;
    userRepository;
    kisApiService;
    technicalIndicatorsService;
    logger = new common_2.Logger(TradingStrategiesService_1.name);
    constructor(tradingStrategyRepository, tradingSignalRepository, backtestResultRepository, stockRepository, userRepository, kisApiService, technicalIndicatorsService) {
        this.tradingStrategyRepository = tradingStrategyRepository;
        this.tradingSignalRepository = tradingSignalRepository;
        this.backtestResultRepository = backtestResultRepository;
        this.stockRepository = stockRepository;
        this.userRepository = userRepository;
        this.kisApiService = kisApiService;
        this.technicalIndicatorsService = technicalIndicatorsService;
    }
    async createSimpleStrategy(userId, name, strategyType = trading_strategy_entity_1.StrategyType.MOVING_AVERAGE, description) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        const defaultConditions = this.generateDefaultConditions(strategyType);
        const strategy = this.tradingStrategyRepository.create({
            name,
            description: description || `${strategyType} 기반 자동매매 전략`,
            type: strategyType,
            conditions: defaultConditions,
            autoTrading: {
                enabled: false,
                maxPositionSize: 10000,
                stopLoss: 5.0,
                takeProfit: 10.0,
                maxDailyTrades: 10,
                riskPerTrade: 2.0,
                minConfidence: 0.6
            },
            userId,
            status: trading_strategy_entity_1.StrategyStatus.ACTIVE,
        });
        const savedStrategy = await this.tradingStrategyRepository.save(strategy);
        this.logger.log(`간단한 전략 생성 완료: ${name} (타입: ${strategyType})`);
        return savedStrategy;
    }
    generateDefaultConditions(strategyType) {
        const conditions = {};
        switch (strategyType) {
            case trading_strategy_entity_1.StrategyType.MOVING_AVERAGE:
                conditions.indicators = {
                    movingAverage: {
                        shortPeriod: 10,
                        longPeriod: 20,
                        type: 'sma'
                    }
                };
                break;
            case trading_strategy_entity_1.StrategyType.RSI:
                conditions.indicators = {
                    rsi: {
                        period: 14,
                        oversold: 30,
                        overbought: 70
                    }
                };
                break;
            case trading_strategy_entity_1.StrategyType.MACD:
                conditions.indicators = {
                    macd: {
                        fastPeriod: 12,
                        slowPeriod: 26,
                        signalPeriod: 9
                    }
                };
                break;
            case trading_strategy_entity_1.StrategyType.BOLLINGER_BANDS:
                conditions.indicators = {
                    bollingerBands: {
                        period: 20,
                        standardDeviations: 2
                    }
                };
                break;
            case trading_strategy_entity_1.StrategyType.CUSTOM:
                conditions.indicators = {
                    rsi: {
                        period: 14,
                        oversold: 30,
                        overbought: 70
                    },
                    movingAverage: {
                        shortPeriod: 10,
                        longPeriod: 20,
                        type: 'sma'
                    },
                    macd: {
                        fastPeriod: 12,
                        slowPeriod: 26,
                        signalPeriod: 9
                    },
                    bollingerBands: {
                        period: 20,
                        standardDeviations: 2
                    }
                };
                break;
            default:
                conditions.indicators = {
                    movingAverage: {
                        shortPeriod: 10,
                        longPeriod: 20,
                        type: 'sma'
                    }
                };
        }
        conditions.priceConditions = {
            minPrice: 0,
            maxPrice: 1000000,
            priceChangePercent: 5.0
        };
        conditions.volumeConditions = {
            minVolume: 1000,
            volumeChangePercent: 20.0
        };
        conditions.timeConditions = {
            tradingHours: {
                start: '23:30',
                end: '06:00'
            },
            excludeWeekends: true
        };
        return conditions;
    }
    async getUserStrategies(userId) {
        return await this.tradingStrategyRepository.find({
            where: { userId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async getStrategy(userId, strategyId) {
        const strategy = await this.tradingStrategyRepository.findOne({
            where: { id: strategyId, userId },
            relations: ['user'],
        });
        if (!strategy) {
            throw new common_1.NotFoundException('거래 전략을 찾을 수 없습니다.');
        }
        return strategy;
    }
    async updateStrategy(userId, strategyId, updateStrategyDto) {
        const strategy = await this.getStrategy(userId, strategyId);
        Object.assign(strategy, updateStrategyDto);
        return await this.tradingStrategyRepository.save(strategy);
    }
    async deleteStrategy(userId, strategyId) {
        const strategy = await this.getStrategy(userId, strategyId);
        await this.tradingStrategyRepository.remove(strategy);
    }
    async toggleStrategy(userId, strategyId) {
        const strategy = await this.getStrategy(userId, strategyId);
        const newStatus = strategy.status === trading_strategy_entity_1.StrategyStatus.ACTIVE
            ? trading_strategy_entity_1.StrategyStatus.INACTIVE
            : trading_strategy_entity_1.StrategyStatus.ACTIVE;
        await this.tradingStrategyRepository.update({ id: strategyId, userId }, { status: newStatus });
        return await this.getStrategy(userId, strategyId);
    }
    async getStrategySignals(userId, strategyId) {
        await this.getStrategy(userId, strategyId);
        return await this.tradingSignalRepository.find({
            where: { strategyId },
            order: { createdAt: 'DESC' },
            take: 100,
        });
    }
    async executeStrategy(strategy, user, stock, currentPrice, volume, indicators) {
        try {
            this.logger.debug(`전략 실행 시작: ${strategy.name} (${stock.symbol})`);
            await this.updateStrategyLastExecuted(strategy.id);
            const signal = await this.generateSignal(strategy, stock, currentPrice, volume, indicators);
            this.logger.debug(`신호 생성: ${signal?.signalType} (${stock.symbol}) - 신뢰도: ${signal?.confidence}`);
            return signal;
        }
        catch (error) {
            this.logger.error(`전략 실행 실패 (${strategy.name}):`, error);
            return null;
        }
    }
    async getActiveStrategies() {
        return await this.tradingStrategyRepository.find({
            where: { status: trading_strategy_entity_1.StrategyStatus.ACTIVE },
            order: { createdAt: 'ASC' },
        });
    }
    async updateStrategyLastExecuted(strategyId) {
        await this.tradingStrategyRepository.update({ id: strategyId }, { lastExecutedAt: new Date() });
    }
    evaluateStrategyConditions(conditions, currentPrice, volume, indicators) {
        let buySignals = 0;
        let sellSignals = 0;
        let totalConditions = 0;
        if (conditions.indicators?.rsi && indicators.rsi !== undefined) {
            totalConditions++;
            if (indicators.rsi < conditions.indicators.rsi.oversold) {
                buySignals++;
            }
            else if (indicators.rsi > conditions.indicators.rsi.overbought) {
                sellSignals++;
            }
        }
        if (conditions.indicators?.movingAverage && indicators.shortMA && indicators.longMA) {
            totalConditions++;
            if (indicators.shortMA > indicators.longMA) {
                buySignals++;
            }
            else if (indicators.shortMA < indicators.longMA) {
                sellSignals++;
            }
        }
        if (conditions.indicators?.macd && indicators.macd) {
            totalConditions++;
            if (indicators.macd.macd > indicators.macd.signal && indicators.macd.histogram > 0) {
                buySignals++;
            }
            else if (indicators.macd.macd < indicators.macd.signal && indicators.macd.histogram < 0) {
                sellSignals++;
            }
        }
        if (conditions.indicators?.bollingerBands && indicators.bollingerBands) {
            totalConditions++;
            if (currentPrice <= indicators.bollingerBands.lower) {
                buySignals++;
            }
            else if (currentPrice >= indicators.bollingerBands.upper) {
                sellSignals++;
            }
        }
        if (conditions.priceConditions) {
            if (conditions.priceConditions.maxPrice && currentPrice > conditions.priceConditions.maxPrice) {
                sellSignals++;
                totalConditions++;
            }
            if (conditions.priceConditions.minPrice && currentPrice < conditions.priceConditions.minPrice) {
                buySignals++;
                totalConditions++;
            }
        }
        if (conditions.volumeConditions) {
            if (conditions.volumeConditions.minVolume && volume < conditions.volumeConditions.minVolume) {
                return { signalType: trading_strategy_types_1.SignalType.HOLD, confidence: 0 };
            }
        }
        if (totalConditions === 0) {
            return { signalType: trading_strategy_types_1.SignalType.HOLD, confidence: 0 };
        }
        const buyRatio = buySignals / totalConditions;
        const sellRatio = sellSignals / totalConditions;
        if (buyRatio > 0.5) {
            return { signalType: trading_strategy_types_1.SignalType.BUY, confidence: buyRatio };
        }
        else if (sellRatio > 0.5) {
            return { signalType: trading_strategy_types_1.SignalType.SELL, confidence: sellRatio };
        }
        return { signalType: trading_strategy_types_1.SignalType.HOLD, confidence: 0 };
    }
    async generateSignal(strategy, stock, currentPrice, volume, indicators) {
        try {
            let signalType = trading_strategy_types_1.SignalType.HOLD;
            let confidence = 0.5;
            if (strategy.conditions?.indicators) {
                const signalResult = this.evaluateStrategyConditions(strategy.conditions, currentPrice, volume, indicators);
                signalType = signalResult.signalType;
                confidence = signalResult.confidence;
            }
            if (signalType === trading_strategy_types_1.SignalType.HOLD) {
                return null;
            }
            const signalData = {
                strategyId: strategy.id,
                stockId: stock.id,
                signalType,
                confidence,
                price: currentPrice,
                volume,
                indicators,
                executed: false,
                executedAt: null,
            };
            const signal = await this.saveTradingSignal(signalData);
            this.logger.log(`신호 생성: ${signalType} (${stock.symbol}) - 신뢰도: ${confidence}`);
            return signal;
        }
        catch (error) {
            this.logger.error(`신호 생성 오류 (${strategy.name}):`, error);
            return null;
        }
    }
    async saveTradingSignal(signal) {
        const tradingSignal = this.tradingSignalRepository.create(signal);
        return await this.tradingSignalRepository.save(tradingSignal);
    }
};
exports.TradingStrategiesService = TradingStrategiesService;
exports.TradingStrategiesService = TradingStrategiesService = TradingStrategiesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(trading_strategy_entity_1.TradingStrategy)),
    __param(1, (0, typeorm_1.InjectRepository)(trading_signal_entity_1.TradingSignal)),
    __param(2, (0, typeorm_1.InjectRepository)(backtest_result_entity_1.BacktestResult)),
    __param(3, (0, typeorm_1.InjectRepository)(stock_entity_1.Stock)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        kis_api_service_1.KisApiService,
        technical_indicators_service_1.TechnicalIndicatorsService])
], TradingStrategiesService);
//# sourceMappingURL=trading-strategies.service.js.map