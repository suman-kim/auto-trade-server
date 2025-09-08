import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Portfolio } from './portfolio.entity';
import { Stock } from './stock.entity';

/**
 * 거래 타입 열거형
 */
export enum TransactionType {
  BUY = 'BUY',    // 매수 거래
  SELL = 'SELL'   // 매도 거래
}

/**
 * 거래 상태 열거형
 */
export enum TransactionStatus {
  PENDING = 'PENDING',     // 거래 대기 중
  COMPLETED = 'COMPLETED', // 거래 완료
  CANCELLED = 'CANCELLED', // 거래 취소
  FAILED = 'FAILED'        // 거래 실패
}

/**
 * 거래 내역 엔티티
 * 주식 매수/매도 거래 내역을 관리합니다.
 */
@Entity('transactions')
export class Transaction {
  /** 거래 고유 ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 거래를 수행한 사용자 ID */
  @Column({ 
    name: 'userId',
    comment: '거래를 수행한 사용자 ID'
  })
  userId: number;

  /** 거래가 속한 포트폴리오 ID */
  @Column({ 
    name: 'portfolioId',
    comment: '거래가 속한 포트폴리오 ID'
  })
  portfolioId: number;

  /** 거래된 주식의 ID */
  @Column({ 
    name: 'stockId',
    comment: '거래된 주식의 ID'
  })
  stockId: number;

  /** 거래 타입 (매수/매도) */
  @Column({ 
    name: 'transaction_type',
    comment: '거래 타입 (BUY: 매수, SELL: 매도)'
  })
  transactionType: 'BUY' | 'SELL';

  /** 거래 수량 (주식 개수) */
  @Column({
    comment: '거래 수량 (주식 개수)'
  })
  quantity: number;

  /** 주당 거래 가격 */
  @Column({ 
    name: 'price_per_share', 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    comment: '주당 거래 가격'
  })
  pricePerShare: number;

  /** 거래 총액 (수량 × 주당가격) */
  @Column({ 
    name: 'total_amount', 
    type: 'decimal', 
    precision: 15, 
    scale: 2,
    comment: '거래 총액 (수량 × 주당가격)'
  })
  totalAmount: number;

  /** 거래 실행 일시 */
  @Column({ 
    name: 'transaction_date', 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP',
    comment: '거래 실행 일시'
  })
  transactionDate: Date;

  /** 거래 상태 (대기/완료/취소/실패) */
  @Column({ 
    default: 'COMPLETED',
    comment: '거래 상태 (PENDING: 대기중, COMPLETED: 완료, CANCELLED: 취소, FAILED: 실패)'
  })
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';

  /** 거래 수수료 */
  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    default: 0,
    comment: '거래 수수료'
  })
  fees: number;

  /** 거래 메모 또는 참고사항 */
  @Column({ 
    type: 'text', 
    nullable: true,
    comment: '거래 메모 또는 참고사항'
  })
  notes: string;

  // 관계 설정
  /** 거래를 수행한 사용자 */
  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'userId' })
  user: User;

  /** 거래가 속한 포트폴리오 */
  @ManyToOne(() => Portfolio, (portfolio) => portfolio.transactions)
  @JoinColumn({ name: 'portfolioId' })
  portfolio: Portfolio;

  /** 거래된 주식 정보 */
  @ManyToOne(() => Stock)
  @JoinColumn({ name: 'stockId' })
  stock: Stock;

  /**
   * 거래가 매수인지 확인합니다.
   */
  isBuy(): boolean {
    return this.transactionType === TransactionType.BUY;
  }

  /**
   * 거래가 매도인지 확인합니다.
   */
  isSell(): boolean {
    return this.transactionType === TransactionType.SELL;
  }

  /**
   * 거래가 완료되었는지 확인합니다.
   */
  isCompleted(): boolean {
    return this.status === TransactionStatus.COMPLETED;
  }

  /**
   * 거래 총액(수수료 포함)을 계산합니다.
   */
  get totalWithFees(): number {
    return this.totalAmount + this.fees;
  }

  /**
   * 거래가 성공했는지 확인합니다.
   */
  isSuccessful(): boolean {
    return this.status === TransactionStatus.COMPLETED;
  }
} 