import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { PortfolioHolding } from './portfolio-holding.entity';
import { Transaction } from './transaction.entity';
import { TradingSignal } from './trading-signal.entity';
import { PriceAlert } from './price-alert.entity';

/**
 * 주식 엔티티
 * 주식 정보를 관리합니다. 현재는 테슬라(TSLA) 주식만 지원합니다.
 */
@Entity('stocks')
export class Stock {
  /** 주식 고유 ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 주식 심볼 (예: TSLA, AAPL) */
  @Column({ 
    unique: true, 
    length: 20,
    comment: '주식 심볼 (예: TSLA, AAPL)'
  })
  symbol: string;

  /** 회사명 */
  @Column({ 
    name: 'company_name', 
    length: 255,
    comment: '회사명'
  })
  companyName: string;

  /** 주식명 (간단한 이름) */
  @Column({ 
    length: 100, 
    nullable: true,
    comment: '주식명 (간단한 이름)'
  })
  name: string;

  /** 섹터 (예: Technology, Healthcare) */
  @Column({ 
    length: 100, 
    nullable: true,
    comment: '섹터 (예: Technology, Healthcare)'
  })
  sector: string;

  /** 산업 분야 */
  @Column({ 
    length: 100, 
    nullable: true,
    comment: '산업 분야'
  })
  industry: string;

  /** 거래소 (예: NASDAQ, NYSE) */
  @Column({ 
    length: 50, 
    nullable: true,
    comment: '거래소 (예: NASDAQ, NYSE)'
  })
  exchange: string;

  /** 통화 (예: USD, KRW) */
  @Column({ 
    length: 10, 
    nullable: true,
    comment: '통화 (예: USD, KRW)'
  })
  currency: string;

  /** 현재 주가 */
  @Column({ 
    name: 'current_price', 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    nullable: true,
    comment: '현재 주가'
  })
  currentPrice: number;

  /** 전일 종가 */
  @Column({ 
    name: 'previous_close', 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    nullable: true,
    comment: '전일 종가'
  })
  previousClose: number;

  /** 당일 고가 */
  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    nullable: true,
    comment: '당일 고가'
  })
  high: number;

  /** 당일 저가 */
  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    nullable: true,
    comment: '당일 저가'
  })
  low: number;

  /** 매수 1호가 */
  @Column({   
    name: 'bid_price', 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    nullable: true,
    comment: '매수 1호가'
  })
  bidPrice: number;

  /** 매도 1호가 */
  @Column({ 
    name: 'ask_price', 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    nullable: true,
    comment: '매도 1호가'
  })
  askPrice: number;

  /** 거래량 */
  @Column({ 
    type: 'bigint', 
    nullable: true,
    comment: '거래량'
  })
  volume: number;

  /** 시가총액 */
  @Column({ 
    name: 'market_cap', 
    type: 'decimal', 
    precision: 20, 
    scale: 2, 
    nullable: true,
    comment: '시가총액'
  })
  marketCap: number;

  /** PER (주가수익비율) */
  @Column({ 
    name: 'pe_ratio', 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    nullable: true,
    comment: 'PER (주가수익비율)'
  })
  peRatio: number;

  /** 배당수익률 */
  @Column({ 
    name: 'dividend_yield', 
    type: 'decimal', 
    precision: 5, 
    scale: 2, 
    nullable: true,
    comment: '배당수익률 (%)'
  })
  dividendYield: number;

  /** 야간 종목코드 */
  @Column({ 
    name: 'kis_night_code', 
    length: 20, 
    nullable: true,
    comment: '야간 종목코드'
  })
  kisNightCode: string;

  /** 주간 종목코드 */
  @Column({ 
    name: 'kis_day_code', 
    length: 20, 
    nullable: true,
    comment: '주간 종목코드'
  })
  kisDayCode: string;


  /** 마지막 업데이트 일시 */
  @CreateDateColumn({ 
    name: 'last_updated',
    comment: '마지막 업데이트 일시'
  })
  lastUpdated: Date;

  // 관계 정의
  /** 이 주식을 보유한 포트폴리오 내역 */
  @OneToMany(() => PortfolioHolding, holding => holding.stock)
  portfolioHoldings: PortfolioHolding[];

  /** 이 주식과 관련된 거래 내역 */
  @OneToMany(() => Transaction, transaction => transaction.stock)
  transactions: Transaction[];

  /** 이 주식에 대한 거래 신호 */
  @OneToMany(() => TradingSignal, signal => signal.stock)
  tradingSignals: TradingSignal[];

  /** 이 주식에 대한 가격 알림 */
  @OneToMany(() => PriceAlert, alert => alert.stock)
  priceAlerts: PriceAlert[];

  /**
   * 주식 가격 변화율을 계산합니다.
   */
  get priceChange(): number {
    if (!this.currentPrice || !this.previousClose) {
      return 0;
    }
    return ((this.currentPrice - this.previousClose) / this.previousClose) * 100;
  }

  /**
   * 주식 가격 변화 방향을 반환합니다.
   */
  get priceChangeDirection(): 'up' | 'down' | 'unchanged' {
    if (!this.currentPrice || !this.previousClose) {
      return 'unchanged';
    }
    if (this.currentPrice > this.previousClose) {
      return 'up';
    }
    if (this.currentPrice < this.previousClose) {
      return 'down';
    }
    return 'unchanged';
  }

  /**
   * 주식이 활성 상태인지 확인합니다.
   */
  isActive(): boolean {
    return this.currentPrice !== null && this.currentPrice > 0;
  }
} 