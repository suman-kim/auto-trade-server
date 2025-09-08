import { ConfigService } from '@nestjs/config';
import { EventEmitter } from 'events';
import { OverseasStockCurrentPriceResponse, OverseasStockHoldingResponse } from './dto/response/response.dto';
export declare class KisApiService extends EventEmitter {
    private readonly config;
    private readonly axiosInstance;
    private readonly logger;
    private readonly appKey;
    private readonly appSecret;
    private readonly mode;
    private readonly baseUrl;
    private readonly KISTransactionIDList;
    private accessToken;
    private tokenExpiry;
    constructor(config: ConfigService);
    private setHeaders;
    private getValidAccessToken;
    private refreshAccessToken;
    refreshWebSocketToken(): Promise<string | null>;
    getOverseasStockPrice(symbol: string): Promise<OverseasStockCurrentPriceResponse | null>;
    getOverseasStockHolding(accountNumber: string): Promise<OverseasStockHoldingResponse | null>;
    private getCurrentTime;
}
