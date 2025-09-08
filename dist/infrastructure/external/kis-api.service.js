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
var KisApiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KisApiService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const config_1 = require("@nestjs/config");
const events_1 = require("events");
const kis_constants_1 = require("./dto/kis-constants");
let KisApiService = KisApiService_1 = class KisApiService extends events_1.EventEmitter {
    config;
    axiosInstance;
    logger = new common_1.Logger(KisApiService_1.name);
    appKey;
    appSecret;
    mode;
    baseUrl;
    KISTransactionIDList;
    accessToken = null;
    tokenExpiry = null;
    constructor(config) {
        super();
        this.config = config;
        this.mode = (this.config.get('KIS_MODE') ?? 'demo');
        this.baseUrl = this.mode === 'live'
            ? this.config.getOrThrow('KIS_URL')
            : this.config.getOrThrow('KIS_MOCK_URL');
        this.appKey = this.mode === 'live' ? this.config.getOrThrow('KIS_APP_KEY') : this.config.getOrThrow('KIS_MOCK_APP_KEY');
        this.appSecret = this.mode === 'live' ? this.config.getOrThrow('KIS_APP_SECRET') : this.config.getOrThrow('KIS_MOCK_APP_SECRET');
        this.axiosInstance = axios_1.default.create({
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.KISTransactionIDList = this.mode === 'live' ? kis_constants_1.KISTransactionID : kis_constants_1.KISTransactionID_MOCK;
    }
    async setHeaders() {
        const token = await this.getValidAccessToken();
        if (!token) {
            throw new Error('유효한 액세스 토큰을 가져올 수 없습니다.');
        }
        const headers = {};
        headers['Content-Type'] = 'application/json';
        headers['Authorization'] = `Bearer ${token}`;
        headers['appkey'] = this.appKey;
        headers['appsecret'] = this.appSecret;
        return headers;
    }
    async getValidAccessToken() {
        if (this.accessToken && this.tokenExpiry && this.tokenExpiry > this.getCurrentTime()) {
            this.logger.log('기존 Access Token 사용');
            return this.accessToken;
        }
        return await this.refreshAccessToken();
    }
    async refreshAccessToken() {
        try {
            this.logger.log('액세스 토큰 갱신 중...');
            const response = await this.axiosInstance.post(`${this.baseUrl}/oauth2/tokenP`, {
                grant_type: 'client_credentials',
                appkey: this.appKey,
                appsecret: this.appSecret,
            });
            this.accessToken = response.data.access_token;
            this.tokenExpiry = response.data.access_token_token_expired;
            this.logger.log(`액세스 토큰 갱신 완료. 만료시간: ${this.tokenExpiry}`);
            return this.accessToken;
        }
        catch (error) {
            this.logger.error('액세스 토큰 갱신 실패:', error.response?.data || error.message);
            this.accessToken = null;
            this.tokenExpiry = null;
            return null;
        }
    }
    async refreshWebSocketToken() {
        try {
            this.logger.log('웹소켓 토큰 갱신 중...');
            const response = await this.axiosInstance.post(`${this.baseUrl}/oauth2/Approval`, {
                grant_type: 'client_credentials',
                appkey: this.appKey,
                secretkey: this.appSecret,
            });
            this.logger.log('웹소켓 토큰 갱신 완료');
            return response.data.approval_key;
        }
        catch (error) {
            this.logger.error('웹소켓 토큰 갱신 실패:', error.response?.data || error.message);
            return null;
        }
    }
    async getOverseasStockPrice(symbol) {
        try {
            const headers = await this.setHeaders();
            headers['tr_id'] = this.KISTransactionIDList.OVERSEAS_STOCK_CURRENT_PRICE;
            const params = `SYMB=${symbol}&EXCD=NAS`;
            const response = await this.axiosInstance.get(`${this.baseUrl}/uapi/overseas-price/v1/quotations/price?${params}`, {
                headers: headers,
            });
            const data = response.data.output;
            return data;
        }
        catch (err) {
            this.logger.error('해외주식 현재가 상세 조회 실패:', err.response?.data || err.message);
            return null;
        }
    }
    async getOverseasStockHolding(accountNumber) {
        try {
            const headers = await this.setHeaders();
            headers['tr_id'] = this.KISTransactionIDList.OVERSEAS_STOCK_HOLDING;
            let ovrs_excg_cd = this.mode === "live" ? "NAS" : "NASD";
            let tr_crcy_cd = "USD";
            let cano = accountNumber.toString().slice(0, -2);
            let acnt_prdt_cd = accountNumber.toString().slice(-2);
            const params = `OVRS_EXCG_CD=${ovrs_excg_cd}&TR_CRCY_CD=${tr_crcy_cd}&CTX_AREA_FK200&CTX_AREA_NK200&CANO=${cano}&ACNT_PRDT_CD=${acnt_prdt_cd}`;
            const response = await this.axiosInstance.get(`${this.baseUrl}/uapi/overseas-stock/v1/trading/inquire-balance?${params}`, {
                headers: headers,
            });
            console.log(response.data);
            const data = response.data;
            return data;
        }
        catch (err) {
            this.logger.error('해외주식 잔고 조회 실패:', err.response?.data || err.message);
            return null;
        }
    }
    getCurrentTime() {
        const date = new Date();
        let year = date.getFullYear().toString();
        let month = date.getMonth() + 1;
        month = month < 10 ? '0' + month.toString() : month.toString();
        let day = date.getDate();
        day = day < 10 ? '0' + day.toString() : day.toString();
        let hour = date.getHours();
        hour = hour < 10 ? '0' + hour.toString() : hour.toString();
        let minites = date.getMinutes();
        minites = minites < 10 ? '0' + minites.toString() : minites.toString();
        let seconds = date.getSeconds();
        seconds = seconds < 10 ? '0' + seconds.toString() : seconds.toString();
        return `${year}-${month}-${day} ${hour}:${minites}:${seconds}`;
    }
};
exports.KisApiService = KisApiService;
exports.KisApiService = KisApiService = KisApiService_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Global)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], KisApiService);
//# sourceMappingURL=kis-api.service.js.map