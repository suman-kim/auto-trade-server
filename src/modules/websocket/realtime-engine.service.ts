import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from '../../entities/stock.entity';
import { Transaction } from '../../entities/transaction.entity';
import { Portfolio } from '../../entities/portfolio.entity';
import { TradingStrategy, StrategyStatus } from '../../entities/trading-strategy.entity';
import { TradingSignal } from '../../entities/trading-signal.entity';
import { KisWebSocketService } from '../../infrastructure/external/kis-websocket.service';
import { OverseasStockRealTimeQuote,OverseasStockRealTimeTrade } from '../../infrastructure/external/dto/response/ws-response.dto';
import { EventEmitterType } from '../../shared/types/common-type';
import { KisSchedules } from '../../infrastructure/external/kis-schedules';
import { OverseasStockCurrentPriceResponse,OverseasStockHoldingResponse,OverseasStockHoldingItem,OverseasStockHoldingSummary } from '../../infrastructure/external/dto/response/response.dto';
import { TechnicalIndicatorsService } from '../../infrastructure/services/technical-indicators.service';
import { TradingStrategiesService } from '../trading-strategies/trading-strategies.service';
import { KisApiService } from '../../infrastructure/external/kis-api.service';
import { TransactionsService } from '../transactions/transactions.service';
import { StocksService } from '../stocks/stocks.service';
import { PortfoliosService } from '../portfolios/portfolios.service';
import { TechnicalIndicatorsResult, SignalGenerationResult, SignalType } from '../../shared/types/trading-strategy.types';
import { UsersService } from '../users/users.service';
import { User } from '../../entities/user.entity';
import { OrderService } from '../order/order.service';
/**
 * 실시간 데이터 처리 서비스
 * 한국투자증권 WebSocket 혹은 API 에서 받은 이벤트를 처리하는 서비스 
 */
@Injectable()
export class RealtimeEngineService {
  private readonly logger = new Logger(RealtimeEngineService.name);

  constructor(
    private readonly kisWebSocketService: KisWebSocketService,
    private readonly kisSchedules: KisSchedules,
    private readonly technicalIndicatorsService: TechnicalIndicatorsService,
    private readonly tradingStrategiesService: TradingStrategiesService,
    private readonly kisApiService: KisApiService,
    private readonly transactionsService: TransactionsService,
    private readonly stocksService: StocksService,
    private readonly portfoliosService: PortfoliosService,
    private readonly userService: UsersService,
    private readonly orderService: OrderService,
  ) {
    this.setupEventListeners();
  }

  /**
   * 한국 투자 증권 WebSocket 이벤트 리스너 설정
   */
  private setupEventListeners(): void {

    // 실전 체결 데이터 이벤트
    this.kisWebSocketService.on(EventEmitterType.TRADE, async (data:OverseasStockRealTimeTrade) => {
      console.log('체결 데이터 수신', data);
      await this.processTradeData(data);
    });

    // 모의 체결 데이터 이벤트
    this.kisSchedules.on(EventEmitterType.TRADE, async (data:OverseasStockCurrentPriceResponse) => {
      console.log('체결 데이터 수신', data);
      await this.processTradeData(data);
    });

    // 잔고 데이터 이벤트
    this.kisSchedules.on(EventEmitterType.BALANCE, async (data:{userId:number,data:OverseasStockHoldingResponse}) => {
      console.log('잔고 데이터 수신', data);
      await this.processBalanceData(data.userId, data.data);
    });


  }

  /**
   * 체결 데이터 처리
   */
  public async processTradeData(data: OverseasStockRealTimeTrade|OverseasStockCurrentPriceResponse): Promise<void> {
    try {
      this.logger.debug('체결 데이터 처리:', data);

      let stockCode: string; //종목코드
      let currentPrice: number; //현재가
      let highPrice: number | null = null; //고가
      let lowPrice: number | null = null;
      let volume: number; //거래량

      // 데이터 타입에 따라 다른 처리 로직 적용
      if (this.isOverseasStockRealTimeTrade(data)) {
        const realTimeTrade = data as OverseasStockRealTimeTrade;
        stockCode = realTimeTrade.stockCode;
        currentPrice = realTimeTrade.currentPrice;
        highPrice = realTimeTrade.highPrice;
        lowPrice = realTimeTrade.lowPrice;
        volume = realTimeTrade.totalVolume;
      } 
      else {
        // API에서 받은 현재가 데이터 처리
        const currentPriceData = data as OverseasStockCurrentPriceResponse;
        stockCode = currentPriceData.rsym.substring(currentPriceData.rsym.length - 4);
        currentPrice = parseInt(currentPriceData.last);
        volume = parseInt(currentPriceData.tvol);
      }

      // 주식 가격 정보 업데이트
      await this.stocksService.updateStockPriceInfo(stockCode, currentPrice, highPrice, lowPrice, volume);
      // 주식 정보 조회
      const stock = await this.stocksService.getStockInfo(stockCode);
      if (!stock) {
        this.logger.warn(`주식 정보를 찾을 수 없습니다: ${stockCode}`);
        return;
      }

      // 활성화된 거래 전략들 조회
      const activeStrategies:TradingStrategy[] = await this.tradingStrategiesService.getActiveStrategies();
      
      // 각 전략에 대해 신호 생성 및 실행
      for (const strategy of activeStrategies) {
        try {

          //기술적 지표 계산
          const indicators = await this.technicalIndicatorsService.calculateAllIndicators(stock.id, strategy.conditions?.indicators || {});
          this.logger.debug(`기술적 지표 계산: ${JSON.stringify(indicators)}`);

          //해당 사용자 찾기
          const user:User = await this.userService.findById(strategy.userId);

          //전략 실행 후 신호 생성 
          const signal:TradingSignal|null = await this.tradingStrategiesService.executeStrategy(strategy, user, stock, currentPrice, volume, indicators);

          if (signal) {
            //자동매매가 활성화된 경우
            if (strategy.autoTrading?.enabled) {
                await this.orderService.executeOrder(strategy, stock, signal);
                
            }
          }

        } 
        catch (error) {
          this.logger.error(`전략 실행 오류 (${strategy.name}):`, error);
        }
      }

    } catch (error) {
      this.logger.error('체결 데이터 처리 오류:', error);
    }
  }

  /**
   * 데이터가 실시간 체결 데이터인지 확인하는 타입 가드
   */
  private isOverseasStockRealTimeTrade(data: any):boolean {
    // 실시간 체결 데이터에만 있는 속성으로 구분
    if(data.hasOwnProperty('stockCode')) {
      return true;
    }
    return false;
  }


  // /**
  //  * 호가 데이터 처리
  //  */
  // public async processOrderBookData(data: OverseasStockRealTimeQuote): Promise<void> {
  //   try {
  //     this.logger.debug('호가 데이터 처리:', data);

  //     // 주식 정보에 호가 데이터 업데이트
  //     // await this.updateStockOrderBook(data.stockCode, data.bidPriceDollar, data.askPriceDollar);

  //     this.logger.debug(`${data.stockCode} 호가 데이터 처리 완료`);

  //   } catch (error) {
  //     this.logger.error('호가 데이터 처리 오류:', error);
  //   }
  // }

  // /**
  //  * 주문 체결 데이터 처리
  //  */
  // public async processOrderExecutionData(data: any): Promise<void> {
  //   try {
  //     this.logger.debug('주문 체결 데이터 처리:', data);

  //     // 주문 상태 업데이트
  //     await this.updateOrderStatus(data.orderId, data.status, data.price, data.quantity, data.timestamp);

  //     // 포트폴리오 업데이트 (체결된 경우)
  //     if (data.status === '체결') {
  //       await this.updatePortfolioAfterExecution(data);
  //     }

  //     this.logger.debug(`주문 ${data.orderId} 체결 데이터 처리 완료`);

  //   } catch (error) {
  //     this.logger.error('주문 체결 데이터 처리 오류:', error);
  //   }
  // }

  /**
   * 잔고 데이터 처리
   */
  private async processBalanceData(userId:number,data:OverseasStockHoldingResponse): Promise<void> {
    try {
      //포트폴리오 조회
      const portfolios = await this.portfoliosService.getUserPortfolios(userId);
      for(const portfolio of portfolios){
        console.log('포트폴리오 조회',portfolio);
        //포트폴리오 업데이트
        this.portfoliosService.updatePortfolioFromKis(userId,portfolio.id,data);

        
        for(const outputItem of data.output1){
          this.portfoliosService.updateHolding(userId,portfolio.id,outputItem);
        }

      }

      this.logger.debug('잔고 데이터 처리:', data);

      // 포트폴리오 잔고 업데이트
      //await this.updatePortfolioBalance(data.accountId, data.cash, data.securities, data.timestamp);

      //this.logger.debug(`계좌 ${data.accountId} 잔고 데이터 처리 완료`);

    } catch (error) {
      this.logger.error('잔고 데이터 처리 오류:', error);
    }
  }

  // /**
  //  * 주문 상태 업데이트
  //  */
  // private async updateOrderStatus(orderId: string, status: string, price: number, quantity: number, timestamp: string): Promise<void> {
  //   try {
  //     // 실제 구현에서는 orderId로 거래를 찾아야 합니다.
  //     // 현재는 로깅만 수행
  //     this.logger.debug(`주문 ${orderId} 상태 업데이트: ${status}, 가격: ${price}, 수량: ${quantity}`);

  //   } catch (error) {
  //     this.logger.error('주문 상태 업데이트 오류:', error);
  //   }
  // }

  // /**
  //  * 주문 체결 후 포트폴리오 업데이트
  //  */
  // private async updatePortfolioAfterExecution(data: any): Promise<void> {
  //   try {
  //     // 사용자의 포트폴리오 찾기 (실제로는 orderId로 사용자 정보를 찾아야 함)
  //     const portfolios = await this.portfoliosService.getAllPortfolios();
      
  //     for (const portfolio of portfolios) {
  //       // 포트폴리오 보유 주식 업데이트
  //       await this.updatePortfolioHoldings(portfolio, data);
  //     }

  //   } catch (error) {
  //     this.logger.error('포트폴리오 업데이트 오류:', error);
  //   }
  // }

  // /**
  //  * 포트폴리오 보유 주식 업데이트
  //  */
  // private async updatePortfolioHoldings(portfolio: Portfolio, data: any): Promise<void> {
  //   try {
  //     // 포트폴리오 보유 주식 정보 업데이트 로직
  //     // 실제 구현에서는 PortfolioHolding 엔티티를 사용해야 함
  //     this.logger.debug(`포트폴리오 ${portfolio.id} 보유 주식 업데이트`);

  //   } catch (error) {
  //     this.logger.error('포트폴리오 보유 주식 업데이트 오류:', error);
  //   }
  // }

  // /**
  //  * 포트폴리오 잔고 업데이트
  //  */
  // private async updatePortfolioBalance(accountId: string, cash: number, securities: any[], timestamp: string): Promise<void> {
  //   try {
  //     // 실제 구현에서는 accountId로 포트폴리오를 찾아야 합니다.
  //     // 현재는 로깅만 수행
  //     this.logger.debug(`계좌 ${accountId} 잔고 업데이트: 현금 ${cash}, 유가증권 ${securities.length}개`);

  //   } catch (error) {
  //     this.logger.error('포트폴리오 잔고 업데이트 오류:', error);
  //   }
  // }

} 