import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { Transaction } from './transaction.entity';
import { TradingStrategy } from './trading-strategy.entity';
import { Notification } from './notification.entity';
import { PriceAlert } from './price-alert.entity';

/**
 * 사용자 엔티티
 * 주식 자동매매 시스템의 사용자 정보를 관리합니다.
 */
@Entity('users')
export class User {
  /** 사용자 고유 ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 사용자 이메일 주소 (로그인 ID로 사용) */
  @Column({ 
    unique: true,
    comment: '사용자 이메일 주소 (로그인 ID로 사용)'
  })
  email: string;

  /** 암호화된 비밀번호 해시 */
  @Column({ 
    name: 'password_hash',
    comment: '암호화된 비밀번호 해시 (bcrypt 사용)'
  })
  passwordHash: string;

  /** 사용자 이름 */
  @Column({ 
    name: 'first_name', 
    nullable: true,
    comment: '사용자 이름'
  })
  firstName: string;

  /** 사용자 성 */
  @Column({ 
    name: 'last_name', 
    nullable: true,
    comment: '사용자 성'
  })
  lastName: string;

  /** 사용자 계정 활성화 상태 */
  @Column({ 
    name: 'is_active', 
    default: true,
    comment: '사용자 계정 활성화 상태 (true: 활성, false: 비활성)'
  })
  isActive: boolean;

  /** 계정 생성 일시 */
  @CreateDateColumn({ 
    name: 'createdAt',
    comment: '계정 생성 일시'
  })
  createdAt: Date;

  /** 계정 정보 수정 일시 */
  @UpdateDateColumn({ 
    name: 'updatedAt',
    comment: '계정 정보 수정 일시'
  })
  updatedAt: Date;

  /** 한국투자증권 계좌번호 */
  @Column({
    name: 'kis_account_number',
    nullable: true,
    comment: '한국투자증권 계좌번호'
  })
  kisAccountNumber: string;

  /** 한국투자증권 모의 계좌번호 */
  @Column({
    name: 'kis_mock_account_number',
    nullable: true,
    comment: '한국투자증권 모의 계좌번호'
  })
  kisDemoAccountNumber: string; 

  // 관계 설정
  /** 사용자가 보유한 포트폴리오 목록 */
  @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
  portfolios: Portfolio[];

  /** 사용자가 수행한 거래 내역 목록 */
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  /** 사용자가 설정한 자동매매 전략 목록 */
  @OneToMany(() => TradingStrategy, (strategy) => strategy.user)
  tradingStrategies: TradingStrategy[];

  /** 사용자가 받은 알림 목록 */
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  /** 사용자가 설정한 가격 알림 목록 */
  @OneToMany(() => PriceAlert, (priceAlert) => priceAlert.user)
  priceAlerts: PriceAlert[];

  /**
   * 사용자의 전체 이름을 반환합니다.
   */
  get fullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }

  /**
   * 사용자가 활성 상태인지 확인합니다.
   */
  isUserActive(): boolean {
    return this.isActive;
  }
} 