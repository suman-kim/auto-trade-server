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
var RealtimeEngineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeEngineService = void 0;
const common_1 = require("@nestjs/common");
const kis_websocket_service_1 = require("../../infrastructure/external/kis-websocket.service");
const common_type_1 = require("../../shared/types/common-type");
const kis_schedules_1 = require("../../infrastructure/external/kis-schedules");
const technical_indicators_service_1 = require("../../infrastructure/services/technical-indicators.service");
const trading_strategies_service_1 = require("../trading-strategies/trading-strategies.service");
const kis_api_service_1 = require("../../infrastructure/external/kis-api.service");
const transactions_service_1 = require("../transactions/transactions.service");
const stocks_service_1 = require("../stocks/stocks.service");
const portfolios_service_1 = require("../portfolios/portfolios.service");
const users_service_1 = require("../users/users.service");
const order_service_1 = require("../order/order.service");
let RealtimeEngineService = RealtimeEngineService_1 = class RealtimeEngineService {
    kisWebSocketService;
    kisSchedules;
    technicalIndicatorsService;
    tradingStrategiesService;
    kisApiService;
    transactionsService;
    stocksService;
    portfoliosService;
    userService;
    orderService;
    logger = new common_1.Logger(RealtimeEngineService_1.name);
    constructor(kisWebSocketService, kisSchedules, technicalIndicatorsService, tradingStrategiesService, kisApiService, transactionsService, stocksService, portfoliosService, userService, orderService) {
        this.kisWebSocketService = kisWebSocketService;
        this.kisSchedules = kisSchedules;
        this.technicalIndicatorsService = technicalIndicatorsService;
        this.tradingStrategiesService = tradingStrategiesService;
        this.kisApiService = kisApiService;
        this.transactionsService = transactionsService;
        this.stocksService = stocksService;
        this.portfoliosService = portfoliosService;
        this.userService = userService;
        this.orderService = orderService;
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.kisWebSocketService.on(common_type_1.EventEmitterType.TRADE, async (data) => {
            console.log('체결 데이터 수신', data);
            await this.processTradeData(data);
        });
        this.kisSchedules.on(common_type_1.EventEmitterType.TRADE, async (data) => {
            console.log('체결 데이터 수신', data);
            await this.processTradeData(data);
        });
        this.kisSchedules.on(common_type_1.EventEmitterType.BALANCE, async (data) => {
            console.log('잔고 데이터 수신', data);
            await this.processBalanceData(data.userId, data.data);
        });
    }
    async processTradeData(data) {
        try {
            this.logger.debug('체결 데이터 처리:', data);
            let stockCode;
            let currentPrice;
            let highPrice = null;
            let lowPrice = null;
            let volume;
            if (this.isOverseasStockRealTimeTrade(data)) {
                const realTimeTrade = data;
                stockCode = realTimeTrade.stockCode;
                currentPrice = realTimeTrade.currentPrice;
                highPrice = realTimeTrade.highPrice;
                lowPrice = realTimeTrade.lowPrice;
                volume = realTimeTrade.totalVolume;
            }
            else {
                const currentPriceData = data;
                stockCode = currentPriceData.rsym.substring(currentPriceData.rsym.length - 4);
                currentPrice = parseInt(currentPriceData.last);
                volume = parseInt(currentPriceData.tvol);
            }
            await this.stocksService.updateStockPriceInfo(stockCode, currentPrice, highPrice, lowPrice, volume);
            const stock = await this.stocksService.getStockInfo(stockCode);
            if (!stock) {
                this.logger.warn(`주식 정보를 찾을 수 없습니다: ${stockCode}`);
                return;
            }
            const activeStrategies = await this.tradingStrategiesService.getActiveStrategies();
            for (const strategy of activeStrategies) {
                try {
                    const indicators = await this.technicalIndicatorsService.calculateAllIndicators(stock.id, strategy.conditions?.indicators || {});
                    this.logger.debug(`기술적 지표 계산: ${JSON.stringify(indicators)}`);
                    const user = await this.userService.findById(strategy.userId);
                    const signal = await this.tradingStrategiesService.executeStrategy(strategy, user, stock, currentPrice, volume, indicators);
                    if (signal) {
                        if (strategy.autoTrading?.enabled) {
                            await this.orderService.executeOrder(strategy, stock, signal);
                        }
                    }
                }
                catch (error) {
                    this.logger.error(`전략 실행 오류 (${strategy.name}):`, error);
                }
            }
        }
        catch (error) {
            this.logger.error('체결 데이터 처리 오류:', error);
        }
    }
    isOverseasStockRealTimeTrade(data) {
        if (data.hasOwnProperty('stockCode')) {
            return true;
        }
        return false;
    }
    async processBalanceData(userId, data) {
        try {
            const portfolios = await this.portfoliosService.getUserPortfolios(userId);
            for (const portfolio of portfolios) {
                console.log('포트폴리오 조회', portfolio);
                this.portfoliosService.updatePortfolioFromKis(userId, portfolio.id, data);
                for (const outputItem of data.output1) {
                    this.portfoliosService.updateHolding(userId, portfolio.id, outputItem);
                }
            }
            this.logger.debug('잔고 데이터 처리:', data);
        }
        catch (error) {
            this.logger.error('잔고 데이터 처리 오류:', error);
        }
    }
};
exports.RealtimeEngineService = RealtimeEngineService;
exports.RealtimeEngineService = RealtimeEngineService = RealtimeEngineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [kis_websocket_service_1.KisWebSocketService,
        kis_schedules_1.KisSchedules,
        technical_indicators_service_1.TechnicalIndicatorsService,
        trading_strategies_service_1.TradingStrategiesService,
        kis_api_service_1.KisApiService,
        transactions_service_1.TransactionsService,
        stocks_service_1.StocksService,
        portfolios_service_1.PortfoliosService,
        users_service_1.UsersService,
        order_service_1.OrderService])
], RealtimeEngineService);
//# sourceMappingURL=realtime-engine.service.js.map