import { Injectable, OnApplicationBootstrap, Logger, Global } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';
import { EventEmitter } from 'events';
import { KISTransactionID,KISTransactionID_MOCK } from './dto/kis-constants';
import { OverseasStockCurrentPriceResponse, OverseasStockHoldingResponse } from './dto/response/response.dto';

/**
 * 한국투자증권 API 서비스
 * 국내 주식과 해외 주식 데이터를 가져오는 기능을 제공합니다.
 */
@Injectable() 
@Global() // ← 추가
export class KisApiService extends EventEmitter {
  private readonly axiosInstance: AxiosInstance;
  private readonly logger = new Logger(KisApiService.name);
  // API 설정
  private readonly appKey: string;
  private readonly appSecret: string;
  private readonly mode: 'live' | 'demo';
  private readonly baseUrl: string;
  private readonly KISTransactionIDList: typeof KISTransactionID | typeof KISTransactionID_MOCK;
  
  // 액세스 토큰
  private accessToken: string | null = null;
  // 토큰 만료 시간 (Date)
  private tokenExpiry: string | null = null;
  
  constructor(private readonly config: ConfigService) {
    super();
    this.mode     = (this.config.get<'live'|'demo'>('KIS_MODE') ?? 'demo');
    this.baseUrl  = this.mode === 'live'
    ? this.config.getOrThrow<string>('KIS_URL')
    : this.config.getOrThrow<string>('KIS_MOCK_URL');
    this.appKey   = this.mode === 'live' ? this.config.getOrThrow<string>('KIS_APP_KEY') : this.config.getOrThrow<string>('KIS_MOCK_APP_KEY');
    this.appSecret= this.mode === 'live' ? this.config.getOrThrow<string>('KIS_APP_SECRET') : this.config.getOrThrow<string>('KIS_MOCK_APP_SECRET');
    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.KISTransactionIDList = this.mode === 'live' ? KISTransactionID : KISTransactionID_MOCK;
  }

  /**
   * 공통 헤더 설정
   */
  private async setHeaders() {
    const token = await this.getValidAccessToken();
    if (!token) {
      throw new Error('유효한 액세스 토큰을 가져올 수 없습니다.');
    }
    
    const headers: any = {};
    headers['Content-Type'] = 'application/json';
    headers['Authorization'] = `Bearer ${token}`;
    headers['appkey'] = this.appKey;
    headers['appsecret'] = this.appSecret;
    return headers;
  }

  /**
   * 유효한 액세스 토큰을 가져옵니다.
   */
  private async getValidAccessToken(): Promise<string | null> {
  
    // 토큰이 있고 아직 유효한 경우
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > this.getCurrentTime()) {
      this.logger.log('기존 Access Token 사용');
      return this.accessToken;
    }

    // 토큰 갱신
    return await this.refreshAccessToken();
  }

  /**
   * 액세스 토큰을 갱신합니다.
   */
  private async refreshAccessToken(): Promise<string | null> {
    
    try {
      this.logger.log('액세스 토큰 갱신 중...');
      const response = await this.axiosInstance.post(`${this.baseUrl}/oauth2/tokenP`,
        {
          grant_type: 'client_credentials',
          appkey: this.appKey,
          appsecret: this.appSecret,
        }
      );
      
      this.accessToken = response.data.access_token;
      // 토큰 만료 시간 설정
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

  /**
   * 웹소켓 토큰을 갱신합니다.
   */
  public async refreshWebSocketToken(): Promise<string | null> {
    try {
      this.logger.log('웹소켓 토큰 갱신 중...');
      
      const response = await this.axiosInstance.post(
        `${this.baseUrl}/oauth2/Approval`,
        {
          grant_type: 'client_credentials',
          appkey: this.appKey,
          secretkey: this.appSecret,
        }
      );

      this.logger.log('웹소켓 토큰 갱신 완료');
      return response.data.approval_key;
    } catch (error) {
      this.logger.error('웹소켓 토큰 갱신 실패:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * 해외주식 현재체결가
   * @param symbol 종목코드 (TSLA, AAPL, GOOGL, MSFT, AMZN, NVDA)
   */
  public async getOverseasStockPrice(symbol: string): Promise<OverseasStockCurrentPriceResponse | null> {
    try {

        const headers = await this.setHeaders();
        headers['tr_id'] = this.KISTransactionIDList.OVERSEAS_STOCK_CURRENT_PRICE;

        const params = `SYMB=${symbol}&EXCD=NAS`;

        const response = await this.axiosInstance.get(
          `${this.baseUrl}/uapi/overseas-price/v1/quotations/price?${params}`,
          {
            headers: headers,
          }
        );

        const data:OverseasStockCurrentPriceResponse = response.data.output;
        return data;
    } 
    catch (err) {
      this.logger.error('해외주식 현재가 상세 조회 실패:', err.response?.data || err.message);
      return null;
    }
  }
  
  /**
   * 해외주식 잔고 조회
   * @param accountNumber 계좌 번호
   * @returns 
   */
  public async getOverseasStockHolding(accountNumber:string): Promise<OverseasStockHoldingResponse | null> {
    try {
      const headers = await this.setHeaders();
      headers['tr_id'] = this.KISTransactionIDList.OVERSEAS_STOCK_HOLDING;

      let ovrs_excg_cd = this.mode === "live" ? "NAS" : "NASD";
      let tr_crcy_cd =  "USD";

      //맨 뒤 두자리와 나머지 앞자리들을 분리  
      // 5015196301 -> cano: "501519630", acnt_prdt_cd: "01"
      let cano = accountNumber.toString().slice(0, -2);
      let acnt_prdt_cd = accountNumber.toString().slice(-2);

      const params = `OVRS_EXCG_CD=${ovrs_excg_cd}&TR_CRCY_CD=${tr_crcy_cd}&CTX_AREA_FK200&CTX_AREA_NK200&CANO=${cano}&ACNT_PRDT_CD=${acnt_prdt_cd}`

      const response = await this.axiosInstance.get(
        `${this.baseUrl}/uapi/overseas-stock/v1/trading/inquire-balance?${params}`,
        {
          headers: headers,
        }
      );

      console.log(response.data);

      const data:OverseasStockHoldingResponse = response.data;
      return data;

    }
    catch(err){
      this.logger.error('해외주식 잔고 조회 실패:', err.response?.data || err.message);
      return null;
    }
  }

  private getCurrentTime():string{
    const date = new Date();
    let year = date.getFullYear().toString();
    let month:any = date.getMonth() + 1;
        month = month < 10 ? '0' + month.toString() : month.toString();

    let day:any = date.getDate();
        day = day < 10 ? '0' + day.toString() : day.toString();

    let hour:any = date.getHours();
        hour = hour < 10 ? '0' + hour.toString() : hour.toString();
    
    let minites:any = date.getMinutes();
        minites = minites < 10 ? '0' + minites.toString() : minites.toString();

    let seconds:any = date.getSeconds();
        seconds = seconds < 10 ? '0' + seconds.toString() : seconds.toString();

    return `${year}-${month}-${day} ${hour}:${minites}:${seconds}`;
  }
}