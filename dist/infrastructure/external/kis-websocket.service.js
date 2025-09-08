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
var KisWebSocketService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KisWebSocketService = void 0;
const common_1 = require("@nestjs/common");
const ws_1 = require("ws");
const events_1 = require("events");
const schedule_1 = require("@nestjs/schedule");
const kis_api_service_1 = require("./kis-api.service");
const config_1 = require("@nestjs/config");
const ws_response_dto_1 = require("./dto/response/ws-response.dto");
const kis_constants_1 = require("./dto/kis-constants");
const stock_entity_1 = require("../../entities/stock.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const common_type_1 = require("../../shared/types/common-type");
let KisWebSocketService = KisWebSocketService_1 = class KisWebSocketService extends events_1.EventEmitter {
    config;
    kisApiService;
    stockRepository;
    logger = new common_1.Logger(KisWebSocketService_1.name);
    ws = null;
    reconnectAttempts = 0;
    maxReconnectAttempts = 5;
    reconnectInterval = 5000;
    heartbeatInterval = null;
    isConnected = false;
    isConnecting = false;
    websocketToken = null;
    trIdList = [
        kis_constants_1.KISTransactionID.OVERSEAS_STOCK_REAL_TIME_TRADE_DELAYED,
    ];
    stockCodeList = [];
    subscribedStocks = new Map();
    wsUrl;
    appKey;
    appSecret;
    mode;
    constructor(config, kisApiService, stockRepository) {
        super();
        this.config = config;
        this.kisApiService = kisApiService;
        this.stockRepository = stockRepository;
        this.mode = (this.config.get('KIS_MODE') ?? 'demo');
        this.wsUrl = this.mode === 'live'
            ? this.config.getOrThrow('KIS_WEBSOCKET_URL')
            : this.config.getOrThrow('KIS_WEBSOCKET_MOCK_URL');
        this.appKey = this.mode === 'live' ? this.config.getOrThrow('KIS_APP_KEY') : this.config.getOrThrow('KIS_MOCK_APP_KEY');
        this.appSecret = this.mode === 'live' ? this.config.getOrThrow('KIS_APP_SECRET') : this.config.getOrThrow('KIS_MOCK_APP_SECRET');
    }
    async onApplicationBootstrap() {
        this.logger.log('한국투자증권 WebSocket 서비스 초기화 시작');
        this.logger.log(`현재 모드:  ${this.mode}`);
        await this.connect();
    }
    async onModuleDestroy() {
        this.logger.log('한국투자증권 WebSocket 서비스 종료');
        await this.disconnect();
    }
    async connect() {
        if (this.mode === 'demo') {
            return;
        }
        if (this.isConnecting || this.isConnected) {
            this.logger.warn('이미 연결 중이거나 연결된 상태입니다.');
            return;
        }
        try {
            this.isConnecting = true;
            this.logger.log('한국투자증권 WebSocket 연결 시도...');
            this.logger.log(`현재 모드:  ${this.mode}`);
            this.logger.log(`WebSocket 연결 URL: ${this.wsUrl}`);
            this.ws = new ws_1.WebSocket(this.wsUrl);
            this.setupEventListeners();
        }
        catch (error) {
            this.logger.error('WebSocket 연결 실패:', error.message, 'KisWebSocketService');
            this.handleConnectionError(error);
        }
    }
    setupEventListeners() {
        if (!this.ws)
            return;
        this.ws.on('open', async () => {
            this.logger.log('한국투자증권 WebSocket 연결 성공');
            this.isConnected = true;
            this.isConnecting = false;
            this.reconnectAttempts = 0;
            this.startHeartbeat();
            this.emit(common_type_1.EventEmitterType.CONNECT);
            this.websocketToken = await this.kisApiService.refreshWebSocketToken();
            if (!this.websocketToken) {
                throw new Error("WebSocket 토큰 갱신 실패");
            }
            const stocks = await this.stockRepository.find();
            for (const stock of stocks) {
                if (stock.kisDayCode) {
                    this.stockCodeList.push(stock.kisDayCode);
                }
                if (stock.kisNightCode) {
                    this.stockCodeList.push(stock.kisNightCode);
                }
            }
            for (const stockCode of this.stockCodeList) {
                for (const trId of this.trIdList) {
                    this.subscribeStockPrice(trId, stockCode);
                }
            }
        });
        this.ws.on('message', (data) => {
            try {
                console.log("data", data.toString());
                const text = Buffer.isBuffer(data)
                    ? data.toString('utf-8')
                    : Array.isArray(data)
                        ? Buffer.concat(data).toString('utf-8')
                        : typeof data === 'string'
                            ? data
                            : data.toString?.() ?? '';
                this.logger.log(`text: ${text}`);
                if (text.includes('SUBSCRIBE SUCCESS')) {
                    const json = JSON.parse(text);
                    const stockCode = json.header.tr_key;
                    const trId = json.header.tr_id;
                    this.logger.log(`${trId} - ${stockCode} 종목 구독 성공`);
                    this.subscribedStocks.set(stockCode, trId);
                }
                if (!text || text.includes('PINGPONG') || text.includes('JSON PARSING ERROR')) {
                    return;
                }
                const { header: KISWebSocketHeader, body } = ws_response_dto_1.KISWebSocketParser.parseRawData(text);
                console.log("header", KISWebSocketHeader);
                console.log("body", body);
                this.handleMessage(KISWebSocketHeader.trId, body);
            }
            catch (error) {
                this.logger.error('메시지 파싱 오류:', error.message, 'KisWebSocketService');
            }
        });
        this.ws.on('close', (code, reason) => {
            this.logger.warn(`WebSocket 연결 종료: ${code} - ${reason.toString()}`);
            this.handleDisconnection();
        });
        this.ws.on('error', (error) => {
            this.logger.error('WebSocket 에러:', error.message, 'KisWebSocketService');
            this.handleConnectionError(error);
        });
    }
    handleMessage(trId, body) {
        try {
            switch (trId) {
                case kis_constants_1.KISTransactionID.KOREA_STOCK_REAL_TIME_ORDERBOOK: {
                    console.log("HDFSASP0");
                    this.handleOrderBookData(body);
                }
                case kis_constants_1.KISTransactionID.OVERSEAS_STOCK_REAL_TIME_TRADE_DELAYED: {
                    console.log("H0STCNT0");
                    this.handleTradeData(body);
                }
                default:
                    this.logger.debug(`Unhandled TR: ${trId}`);
            }
        }
        catch (error) {
            this.logger.error('메시지 처리 오류:', error.message, 'KisWebSocketService');
        }
    }
    handleTradeData(data) {
        this.logger.debug('체결 데이터 수신');
        this.emit(common_type_1.EventEmitterType.TRADE, data);
    }
    handleOrderBookData(data) {
        this.logger.debug('호가 데이터 수신');
        this.emit(common_type_1.EventEmitterType.ORDERBOOK, data);
    }
    handleOrderExecution(data) {
        this.logger.debug('주문 체결 데이터 수신:', data);
        this.emit(common_type_1.EventEmitterType.ORDER_EXECUTION, {
            orderId: data.orderId,
            symbol: data.symbol,
            price: data.price,
            quantity: data.quantity,
            status: data.status,
            timestamp: data.timestamp,
        });
    }
    handleBalanceData(data) {
        this.logger.debug('잔고 데이터 수신:', data);
        this.emit(common_type_1.EventEmitterType.BALANCE, {
            accountId: data.accountId,
            cash: data.cash,
            securities: data.securities,
            timestamp: data.timestamp,
        });
    }
    handleHeartbeat() {
        this.logger.debug('하트비트 응답 수신');
    }
    async subscribeStockPrice(trId, stockCode) {
        if (!this.isWebSocketConnected()) {
            this.logger.warn(`WebSocket이 연결되지 않았습니다. ${stockCode} 종목을 구독할 수 없습니다.`);
            return;
        }
        try {
            const header = {
                approval_key: this.websocketToken,
                custtype: "P",
                tr_type: "1",
                "content-type": "utf-8"
            };
            const input = {
                tr_id: trId,
                tr_key: stockCode
            };
            const body = {
                input: input
            };
            const request = {
                header: header,
                body: body
            };
            const requestJson = JSON.stringify(request);
            this.logger.log(`${stockCode} 종목 구독 요청 전송: ${requestJson}`);
            this.sendMessage(requestJson);
        }
        catch (error) {
            this.logger.error(`${stockCode} 종목 구독 중 오류 발생:`, error);
            throw error;
        }
    }
    async unsubscribeStockPrice(stockCode) {
        if (!this.isWebSocketConnected()) {
            this.logger.warn(`WebSocket이 연결되지 않았습니다. ${stockCode} 종목을 구독 해제할 수 없습니다.`);
            return;
        }
        try {
            const request = {
                header: {
                    approval_key: this.websocketToken,
                    custtype: "P",
                    tr_type: "2",
                    "content-type": "utf-8"
                },
                body: {
                    input: {
                        tr_id: "",
                        tr_key: stockCode
                    }
                }
            };
            const requestJson = JSON.stringify(request);
            this.logger.log(`${stockCode} 종목 구독 해제 요청: ${requestJson}`);
            this.sendMessage(requestJson);
            this.subscribedStocks.delete(stockCode);
            this.logger.log(`${stockCode} 종목 구독 해제 완료`);
        }
        catch (error) {
            this.logger.error(`${stockCode} 종목 구독 해제 중 오류 발생:`, error);
            throw error;
        }
    }
    getSubscribedStocks() {
        return new Map(this.subscribedStocks);
    }
    isSubscribed(stockCode) {
        return this.subscribedStocks.has(stockCode);
    }
    async unsubscribeAllStocks() {
        const stockCodes = Array.from(this.subscribedStocks.keys());
        for (const stockCode of stockCodes) {
            try {
                await this.unsubscribeStockPrice(stockCode);
            }
            catch (error) {
                this.logger.error(`${stockCode} 종목 구독 해제 실패:`, error);
            }
        }
        this.logger.log('모든 종목 구독 해제 완료');
    }
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            if (this.ws && this.isConnected) {
                try {
                    this.ws.send(JSON.stringify({ type: 'ping' }));
                }
                catch (error) {
                    this.logger.error('하트비트 전송 실패:', error);
                }
            }
        }, 30000);
    }
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }
    handleDisconnection() {
        this.isConnected = false;
        this.isConnecting = false;
        this.stopHeartbeat();
        this.emit(common_type_1.EventEmitterType.DISCONNECT);
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
        }
        else {
            this.logger.error('최대 재연결 시도 횟수 초과');
            this.emit(common_type_1.EventEmitterType.MAX_RECONNECT_ATTEMPTS_REACHED);
        }
    }
    handleConnectionError(error) {
        this.logger.error('연결 에러:', error.message, 'KisWebSocketService');
        this.isConnecting = false;
        this.emit(common_type_1.EventEmitterType.ERROR, error);
    }
    scheduleReconnect() {
        this.reconnectAttempts++;
        const delay = this.reconnectInterval * this.reconnectAttempts;
        this.logger.log(`${delay}ms 후 재연결 시도 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        setTimeout(() => {
            this.connect();
        }, delay);
    }
    async disconnect() {
        this.logger.log('WebSocket 연결 해제');
        this.stopHeartbeat();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isConnected = false;
        this.isConnecting = false;
    }
    isWebSocketConnected() {
        return this.isConnected;
    }
    sendMessage(message) {
        if (!this.ws || !this.isConnected) {
            this.logger.warn('WebSocket이 연결되지 않았습니다.');
            return false;
        }
        try {
            this.ws.send(message);
            return true;
        }
        catch (error) {
            this.logger.error('메시지 전송 실패:', error.message, 'KisWebSocketService');
            return false;
        }
    }
    sendOrder(order) {
        const orderMessage = {
            type: 'order',
            ...order,
        };
        return this.sendMessage(orderMessage);
    }
    cancelOrder(orderId) {
        const cancelMessage = {
            type: 'cancelOrder',
            orderId,
        };
        return this.sendMessage(JSON.stringify(cancelMessage));
    }
    monitorConnection() {
        if (!this.isConnected && !this.isConnecting) {
            this.logger.warn('WebSocket 연결이 끊어졌습니다. 재연결을 시도합니다.');
            this.connect();
        }
    }
    logConnectionStatus() {
        this.logger.log(`WebSocket 연결 상태: ${this.isConnected ? '연결됨' : '연결 안됨'}`);
    }
};
exports.KisWebSocketService = KisWebSocketService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KisWebSocketService.prototype, "monitorConnection", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KisWebSocketService.prototype, "logConnectionStatus", null);
exports.KisWebSocketService = KisWebSocketService = KisWebSocketService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(stock_entity_1.Stock)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        kis_api_service_1.KisApiService,
        typeorm_2.Repository])
], KisWebSocketService);
//# sourceMappingURL=kis-websocket.service.js.map