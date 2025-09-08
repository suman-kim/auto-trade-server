import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { PortfolioHolding } from './portfolio-holding.entity';
import { Transaction } from './transaction.entity';

/**
 * 포트폴리오 엔티티
 * 사용자의 주식 포트폴리오 정보를 관리합니다.
 */
@Entity('portfolios')
export class Portfolio {
  /** 포트폴리오 고유 ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 포트폴리오 소유자 사용자 ID */
  @Column({ 
    name: 'userId',
    comment: '포트폴리오 소유자 사용자 ID'
  })
  userId: number;

  /** 포트폴리오 이름 */
  @Column({
    comment: '포트폴리오 이름'
  })
  name: string;

  /** 포트폴리오 설명 */
  @Column({ 
    type: 'text', 
    nullable: true,
    comment: '포트폴리오 설명'
  })
  description: string;

  /** 포트폴리오 총 가치 (현재 시장 가치) */
  // @Column({ 
  //   name: 'total_value', 
  //   type: 'decimal', 
  //   precision: 15, 
  //   scale: 2, 
  //   default: 0,
  //   comment: '포트폴리오 총 가치 (현재 시장 가치)'
  // })
  // totalValue: number;


  /** 외화 매입 금액1 */
  @Column({
    name: 'foreign_purchase_amount1',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
    comment: '외화 매입 금액1'
  })
  foreignPurchaseAmount1: number;

  /** 총 평가 손익 금액 */
  @Column({
    name: 'total_evaluation_profit',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
    comment: '총 평가 손익 금액'
  })
  totalEvaluationProfitAmount: number;

  /** 총 수익률 */
  @Column({
    name: 'total_profit_rate',
    type: 'decimal',
    precision: 15, // 전체 자릿수 (정수부 + 소수부)
    scale: 2, // 소수점 이하 자릿수
    default: 0,
    comment: '총 수익률'
  })
  totalProfitRate: number;

  /** 외화 매수 금액 합계1 */
  @Column({
    name: 'foreign_purchase_amount_sum1',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
    comment: '외화 매수 금액 합계1'
  })
  foreignPurchaseAmountSum1: number;

  /** 외화 매수 금액 합계2 */
  @Column({
    name: 'foreign_purchase_amount_sum2',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
    comment: '외화 매수 금액 합계2'
  })
  foreignPurchaseAmountSum2: number;


  /** 포트폴리오 생성 일시 */
  @CreateDateColumn({ 
    name: 'createdAt',
    comment: '포트폴리오 생성 일시'
  })
  createdAt: Date;

  /** 포트폴리오 정보 수정 일시 */
  @UpdateDateColumn({ 
    name: 'updatedAt',
    comment: '포트폴리오 정보 수정 일시'
  })
  updatedAt: Date;

  // 관계 설정
  /** 포트폴리오 소유자 */
  @ManyToOne(() => User, (user) => user.portfolios)
  @JoinColumn({ name: 'userId' })
  user: User;

  /** 포트폴리오에 포함된 주식 보유 내역 */
  @OneToMany(() => PortfolioHolding, (holding) => holding.portfolio)
  holdings: PortfolioHolding[];

  /** 포트폴리오에서 발생한 거래 내역 */
  @OneToMany(() => Transaction, (transaction) => transaction.portfolio)
  transactions: Transaction[];

  /**
   * 포트폴리오의 총 투자 금액을 계산합니다.
   */
  get totalInvested(): number {
    if (!this.holdings) {
      return 0;
    }
    return this.holdings.reduce((total, holding) => total + holding.totalInvested, 0);
  }
} 