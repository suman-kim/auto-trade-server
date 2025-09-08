import { Injectable, OnModuleInit, OnModuleDestroy, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JwtService } from '@nestjs/jwt';
import { KisApiService } from './kis-api.service';
import { ConfigService } from '@nestjs/config';
import { KISWebSocketParser, OverseasStockRealTimeQuote,OverseasStockRealTimeTrade } from './dto/response/ws-response.dto';
import { KISTransactionID } from './dto/kis-constants';
import { Stock } from '../../entities/stock.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitterType } from '../../shared/types/common-type';

/**
 * 한국투자증권 WebSocket API 클라이언트
 * 실시간 주식 데이터 수집 및 주문 처리
 */
@Injectable()
export class KisWebSocketService extends EventEmitter implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(KisWebSocketService.name);
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000; // 5초
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isConnected = false;
  private isConnecting = false;
  private websocketToken: string | null = null;

  //구독할 TR ID 목록
  private trIdList: Array<string> = [
    //KISTransactionID.OVERSEAS_STOCK_REAL_TIME_TRADE,
    KISTransactionID.OVERSEAS_STOCK_REAL_TIME_TRADE_DELAYED,
  ]

  //구독할 종목 목록
  private stockCodeList: Array<string> = [];
  
  // 구독된 종목 목록
  private subscribedStocks: Map<string, string> = new Map();

  private readonly wsUrl: string;
  private readonly appKey: string;
  private readonly appSecret: string;
  private readonly mode: 'live' | 'demo';

  constructor (
    private readonly config: ConfigService,
    private readonly kisApiService: KisApiService,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>
  ) {
    super();
    this.mode     = (this.config.get<'live'|'demo'>('KIS_MODE') ?? 'demo');
    this.wsUrl = this.mode === 'live'
    ? this.config.getOrThrow<string>('KIS_WEBSOCKET_URL')
    : this.config.getOrThrow<string>('KIS_WEBSOCKET_MOCK_URL');
    this.appKey   = this.mode === 'live' ? this.config.getOrThrow<string>('KIS_APP_KEY') : this.config.getOrThrow<string>('KIS_MOCK_APP_KEY');
    this.appSecret= this.mode === 'live' ? this.config.getOrThrow<string>('KIS_APP_SECRET') : this.config.getOrThrow<string>('KIS_MOCK_APP_SECRET');
  }

  /**
   * 모듈 초기화 시 WebSocket 연결 시작
   */
  async onApplicationBootstrap() {
    this.logger.log('한국투자증권 WebSocket 서비스 초기화 시작');
    this.logger.log(`현재 모드:  ${this.mode}`);
    await this.connect();
  }

  /**
   * 모듈 종료 시 WebSocket 연결 정리
   */
  async onModuleDestroy() {
    this.logger.log('한국투자증권 WebSocket 서비스 종료');
    await this.disconnect();
  }

  /**
   * WebSocket 연결
   */
  async connect(): Promise<void> {
    if(this.mode === 'demo'){
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

      // WebSocket 연결 생성
      this.ws = new WebSocket(this.wsUrl);

      // 이벤트 리스너 설정
      this.setupEventListeners();

    } 
    catch (error) {
      this.logger.error('WebSocket 연결 실패:', error.message, 'KisWebSocketService');
      this.handleConnectionError(error);
    }
  }

  /**
   * WebSocket 이벤트 리스너 설정
   */
  private setupEventListeners(): void {
    if (!this.ws) return;

    // 연결 성공
    this.ws.on('open', async() => {
      this.logger.log('한국투자증권 WebSocket 연결 성공');
      this.isConnected = true;
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.emit(EventEmitterType.CONNECT);
      
      this.websocketToken = await this.kisApiService.refreshWebSocketToken();

      if(!this.websocketToken){
        throw new Error("WebSocket 토큰 갱신 실패");
      }

      // 종목 목록 조회
      const stocks = await this.stockRepository.find();
      for(const stock of stocks){
        if(stock.kisDayCode){
          this.stockCodeList.push(stock.kisDayCode);
        }
        if(stock.kisNightCode){
          this.stockCodeList.push(stock.kisNightCode);
        }
      }

      // 연결 후 구독 요청
      for(const stockCode of this.stockCodeList){
        for(const trId of this.trIdList){
          this.subscribeStockPrice(trId, stockCode);
        }
      }

    });

    // 메시지 수신
    this.ws.on('message', (data: Buffer | ArrayBuffer | Buffer[]) => {
      try {

        console.log("data",data.toString());

        const text:any = Buffer.isBuffer(data)
          ? data.toString('utf-8')
          : Array.isArray(data)
            ? Buffer.concat(data as Buffer[]).toString('utf-8')
            : typeof data === 'string'
              ? data
              : data.toString?.() ?? '';

        this.logger.log(`text: ${text}`);

        if(text.includes('SUBSCRIBE SUCCESS')){
          //종목 가져오기
          const json:any = JSON.parse(text);
          const stockCode = json.header.tr_key;
          const trId = json.header.tr_id;

          this.logger.log(`${trId} - ${stockCode} 종목 구독 성공`);
          //구독된 종목 목록에 추가
          this.subscribedStocks.set(stockCode, trId);
        }


         // keep-alive류 무시
        if (!text || text.includes('PINGPONG') || text.includes('JSON PARSING ERROR')) {
          return;
        }
        const { header: KISWebSocketHeader, body } = KISWebSocketParser.parseRawData(text);
        console.log("header",KISWebSocketHeader);
        console.log("body",body);
    
        
        this.handleMessage(KISWebSocketHeader.trId, body);

      } 
      catch (error) {
        this.logger.error('메시지 파싱 오류:', error.message, 'KisWebSocketService');
      }
    });

    // 연결 종료
    this.ws.on('close', (code: number, reason: Buffer) => {
      this.logger.warn(`WebSocket 연결 종료: ${code} - ${reason.toString()}`);
      this.handleDisconnection();
    });

    // 에러 발생
    this.ws.on('error', (error: Error) => {
      this.logger.error('WebSocket 에러:', error.message, 'KisWebSocketService');
      this.handleConnectionError(error);
    });
  }

  /**
   * 메시지 처리
   */
  private handleMessage(trId: string, body:any): void {
    try {
      
        // TR별 분기
        switch (trId) {
          //해외 주식 실시간 호가
          case KISTransactionID.KOREA_STOCK_REAL_TIME_ORDERBOOK:{ 
            console.log("HDFSASP0");
            this.handleOrderBookData(body as OverseasStockRealTimeQuote);
          }

          //해외 주식 실시간 체결가
          case KISTransactionID.OVERSEAS_STOCK_REAL_TIME_TRADE_DELAYED:{
            console.log("H0STCNT0");
            this.handleTradeData(body as OverseasStockRealTimeTrade);
          }

          default:
            this.logger.debug(`Unhandled TR: ${trId}`);
        }

    } catch (error) {
      this.logger.error('메시지 처리 오류:', error.message, 'KisWebSocketService');
    }
}

  /**
   * 체결 데이터 처리
   */
  private handleTradeData(data: OverseasStockRealTimeTrade): void {
    this.logger.debug('체결 데이터 수신');
    this.emit(EventEmitterType.TRADE, data);
  }

  /**
   * 호가 데이터 처리
   */
  private handleOrderBookData(data: OverseasStockRealTimeQuote): void {
    this.logger.debug('호가 데이터 수신');
    this.emit(EventEmitterType.ORDERBOOK, data);
  }

  /**
   * 주문 체결 데이터 처리
   */
  private handleOrderExecution(data: any): void {
    this.logger.debug('주문 체결 데이터 수신:', data);
    this.emit(EventEmitterType.ORDER_EXECUTION, {
      orderId: data.orderId,
      symbol: data.symbol,
      price: data.price,
      quantity: data.quantity,
      status: data.status,
      timestamp: data.timestamp,
    });
  }

  /**
   * 잔고 데이터 처리
   */
  private handleBalanceData(data: any): void {
    this.logger.debug('잔고 데이터 수신:', data);
    this.emit(EventEmitterType.BALANCE, {
      accountId: data.accountId,
      cash: data.cash,
      securities: data.securities,
      timestamp: data.timestamp,
    });
  }

  /**
   * 하트비트 응답 처리
   */
  private handleHeartbeat(): void {
    this.logger.debug('하트비트 응답 수신');
  }

   /**
   * 실시간 체결가 구독
   * @param trId 트레이딩 명령어 (예: "H0STCNT0")
   * @param stockCode 종목 코드 (예: "005930" for 삼성전자)
   */
   public async subscribeStockPrice(trId: string, stockCode: string): Promise<void> {
    // WebSocket 연결 상태 확인
    if (!this.isWebSocketConnected()) {
      this.logger.warn(`WebSocket이 연결되지 않았습니다. ${stockCode} 종목을 구독할 수 없습니다.`);
      return;
    }

    try {
      
      // 헤더 정보 설정
      const header = {
        approval_key: this.websocketToken,
        custtype: "P",        // 개인투자자
        tr_type: "1",         // 1:등록, 2:해제
        "content-type": "utf-8"
      };

      // 입력 데이터 설정
      const input = {
        tr_id: trId,
        tr_key: stockCode      // 구독할 종목 코드
      };

      // 요청 본문 구성
      const body = {
        input: input
      };

      // 전체 요청 구조
      const request = {
        header: header,
        body: body
      };

      // JSON 문자열로 변환
      const requestJson = JSON.stringify(request);

      this.logger.log(`${stockCode} 종목 구독 요청 전송: ${requestJson}`);
      this.sendMessage(requestJson);
      
    } catch (error) {
      this.logger.error(`${stockCode} 종목 구독 중 오류 발생:`, error);
      throw error;
    }
  }

  /**
   * 실시간 체결가 구독 해제
   * @param stockCode 종목 코드
   */
  public async unsubscribeStockPrice(stockCode: string): Promise<void> {
    if (!this.isWebSocketConnected()) {
      this.logger.warn(`WebSocket이 연결되지 않았습니다. ${stockCode} 종목을 구독 해제할 수 없습니다.`);
      return;
    }

    try {
      
      // 구독 해제 요청
      const request = {
        header: {
          approval_key: this.websocketToken,
          custtype: "P",
          tr_type: "2",        // 구독 해제
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
      
      // 구독된 종목 목록에서 제거
      this.subscribedStocks.delete(stockCode);
      
      this.logger.log(`${stockCode} 종목 구독 해제 완료`);
      
    } catch (error) {
      this.logger.error(`${stockCode} 종목 구독 해제 중 오류 발생:`, error);
      throw error;
    }
  }

  /**
   * 구독된 종목 목록 조회
   */
  public getSubscribedStocks(): Map<string, string> {
    return new Map(this.subscribedStocks);
  }

  /**
   * 특정 종목 구독 여부 확인
   */
  public isSubscribed(stockCode: string): boolean {
    return this.subscribedStocks.has(stockCode);
  }

  /**
   * 모든 종목 구독 해제
   */
  public async unsubscribeAllStocks(): Promise<void> {
    const stockCodes = Array.from(this.subscribedStocks.keys());
    
    for (const stockCode of stockCodes) {
      try {
        await this.unsubscribeStockPrice(stockCode);
      } catch (error) {
        this.logger.error(`${stockCode} 종목 구독 해제 실패:`, error);
      }
    }
    
    this.logger.log('모든 종목 구독 해제 완료');
  }




  /**
   * 하트비트 시작
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.isConnected) {
        try {
          this.ws.send(JSON.stringify({ type: 'ping' }));
        } catch (error) {
          this.logger.error('하트비트 전송 실패:', error);
        }
      }
    }, 30000); // 30초마다
  }

  /**
   * 하트비트 중지
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * 연결 해제 처리
   */
  private handleDisconnection(): void {
    this.isConnected = false;
    this.isConnecting = false;
    this.stopHeartbeat();
    this.emit(EventEmitterType.DISCONNECT);

    // 자동 재연결 시도
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect();
    } else {
      this.logger.error('최대 재연결 시도 횟수 초과');
      this.emit(EventEmitterType.MAX_RECONNECT_ATTEMPTS_REACHED);
    }
  }

  /**
   * 연결 에러 처리
   */
  private handleConnectionError(error: Error): void {
    this.logger.error('연결 에러:', error.message, 'KisWebSocketService');
    this.isConnecting = false;
    this.emit(EventEmitterType.ERROR, error);
  }

  /**
   * 재연결 스케줄링
   */
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectInterval * this.reconnectAttempts;
    
    this.logger.log(`${delay}ms 후 재연결 시도 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * WebSocket 연결 해제
   */
  async disconnect(): Promise<void> {
    this.logger.log('WebSocket 연결 해제');
    
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.isConnected = false;
    this.isConnecting = false;
  }

  /**
   * 연결 상태 확인
   */
  isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  /**
   * 메시지 전송
   */
  sendMessage(message: string): boolean {
    if (!this.ws || !this.isConnected) {
      this.logger.warn('WebSocket이 연결되지 않았습니다.');
      return false;
    }

    try {
      this.ws.send(message);
      return true;
    } catch (error) {
      this.logger.error('메시지 전송 실패:', error.message, 'KisWebSocketService');
      return false;
    }
  }

  /**
   * 주문 전송
   */
  sendOrder(order: any): boolean {
    const orderMessage = {
      type: 'order',
      ...order,
    };
    return this.sendMessage(orderMessage);
  }

  /**
   * 주문 취소
   */
  cancelOrder(orderId: string): boolean {
    const cancelMessage = {
      type: 'cancelOrder',
      orderId,
    };
    return this.sendMessage(JSON.stringify(cancelMessage));
  }

  /**
   * 연결 상태 모니터링 (Cron 작업)
   */
  @Cron(CronExpression.EVERY_MINUTE)
  monitorConnection(): void {
    if (!this.isConnected && !this.isConnecting) {
      this.logger.warn('WebSocket 연결이 끊어졌습니다. 재연결을 시도합니다.');
      this.connect();
    }
  }

  /**
   * 연결 상태 로깅 (Cron 작업)
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  logConnectionStatus(): void {
    this.logger.log(`WebSocket 연결 상태: ${this.isConnected ? '연결됨' : '연결 안됨'}`);
  }
} 