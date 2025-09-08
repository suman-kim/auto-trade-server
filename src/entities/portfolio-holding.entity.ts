import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { Stock } from './stock.entity';

/**
 * 포트폴리오 보유 주식 엔티티
 * 포트폴리오에 보유한 주식 정보를 관리합니다.
 */
@Entity('portfolio_holdings')
export class PortfolioHolding {
  /** 보유 주식 고유 ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 포트폴리오 ID */
  @Column({ 
    name: 'portfolioId',
    comment: '포트폴리오 ID'
  })
  portfolioId: number;

  /** 보유 주식 ID */
  @Column({ 
    name: 'stockId',
    comment: '보유 주식 ID'
  })
  stockId: number;

  /** 보유 주식 수량 */
  @Column({
    comment: '보유 주식 수량'
  })
  quantity: number;

  /** 평균 매수가 */
  @Column({ 
    name: 'average_price', 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    comment: '평균 매수가'
  })
  averagePrice: number;

  /** 총 투자 금액 (수량 × 평균 매수가) */
  @Column({ 
    name: 'total_invested', 
    type: 'decimal', 
    precision: 15, 
    scale: 2,
    comment: '총 투자 금액 (수량 × 평균 매수가)'
  })
  totalInvested: number;

  /** 보유 내역 생성 일시 */
  @CreateDateColumn({ 
    name: 'createdAt',
    comment: '보유 내역 생성 일시'
  })
  createdAt: Date;

  /** 보유 내역 수정 일시 */
  @UpdateDateColumn({ 
    name: 'updatedAt',
    comment: '보유 내역 수정 일시'
  })
  updatedAt: Date;

  // 관계 설정
  /** 소속 포트폴리오 */
  @ManyToOne(() => Portfolio, (portfolio) => portfolio.holdings)
  @JoinColumn({ name: 'portfolioId' })
  portfolio: Portfolio;

  /** 보유 주식 정보 */
  @ManyToOne(() => Stock)
  @JoinColumn({ name: 'stockId' })
  stock: Stock;

  /**
   * 현재 보유 주식의 시장 가치를 계산합니다.
   */
  get currentValue(): number {
    if (!this.stock || !this.stock.currentPrice) {
      return 0;
    }
    return this.quantity * this.stock.currentPrice;
  }

  /**
   * 보유 주식의 수익률을 계산합니다.
   */
  get returnRate(): number {
    if (this.totalInvested === 0) {
      return 0;
    }
    return ((this.currentValue - this.totalInvested) / this.totalInvested) * 100;
  }

  /**
   * 보유 주식의 수익 금액을 계산합니다.
   */
  get profitLoss(): number {
    return this.currentValue - this.totalInvested;
  }

  /**
   * 보유 주식이 수익을 내고 있는지 확인합니다.
   */
  isProfitable(): boolean {
    return this.currentValue > this.totalInvested;
  }
} 