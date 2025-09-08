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
import { TradingSignal } from './trading-signal.entity';
import { BacktestResult } from './backtest-result.entity';
import { TradingStrategyConditions, AutoTradingConfig, SignalType } from '../shared/types/trading-strategy.types';

/**
 * 전략 타입 열거형
 */
export enum StrategyType {
  MOVING_AVERAGE = 'moving_average',    // 이동평균 전략
  RSI = 'rsi',                          // RSI 전략
  MACD = 'macd',                        // MACD 전략
  BOLLINGER_BANDS = 'bollinger_bands',  // 볼린저 밴드 전략
  CUSTOM = 'custom',                    // 사용자 정의 전략
}


/**
 * 전략 상태 열거형
 */
export enum StrategyStatus {
  ACTIVE = 'active',     // 활성 상태
  INACTIVE = 'inactive', // 비활성 상태
  PAUSED = 'paused',     // 일시정지 상태
}

/**
 * 자동매매 전략 엔티티
 * 사용자가 설정한 자동매매 전략 정보를 관리합니다.
 */
@Entity('trading_strategies')
export class TradingStrategy {
  /** 전략 고유 ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 전략 소유자 사용자 ID */
  @Column({ 
    name: 'userId',
    comment: '전략 소유자 사용자 ID'
  })
  userId: number;

  /** 전략 이름 */
  @Column({
    comment: '전략 이름'
  })
  name: string;

  /** 전략 설명 */
  @Column({ 
    type: 'text', 
    nullable: true,
    comment: '전략 설명'
  })
  description: string;

  /** 전략 타입 (이동평균, RSI, MACD 등) */
  @Column({
    type: 'enum',
    enum: StrategyType,
    default: StrategyType.MOVING_AVERAGE,
    comment: '전략 타입 (moving_average: 이동평균, rsi: RSI, macd: MACD, bollinger_bands: 볼린저밴드, custom: 사용자정의)'
  })
  type: StrategyType;

  /** 전략 상태 (활성/비활성/일시정지) */
  @Column({
    type: 'enum',
    enum: StrategyStatus,
    default: StrategyStatus.INACTIVE,
    comment: '전략 상태 (active: 활성, inactive: 비활성, paused: 일시정지)'
  })
  status: StrategyStatus;

  /** 거래 조건 설정 (JSON 형태로 저장) */
  @Column({ 
    type: 'json',
    comment: '거래 조건 설정 (기술적 지표, 가격 조건, 거래량 조건, 시간 조건 등을 JSON 형태로 저장)'
  })
  conditions: TradingStrategyConditions;

  /** 자동 거래 설정 */
  @Column({ 
    name: 'auto_trading', 
    type: 'json',
    comment: '자동 거래 설정 (활성화 여부, 최대 포지션 크기, 손절/익절 비율, 일일 최대 거래 횟수, 거래당 위험 비율 등을 JSON 형태로 저장)'
  })
  autoTrading: AutoTradingConfig;

  /** 백테스팅 결과 요약 (JSON 형태로 저장) */
  @Column({ 
    name: 'backtest_summary', 
    type: 'json', 
    nullable: true,
    comment: '백테스팅 결과 요약 (총 수익률, 연간 수익률, 최대 손실폭, 샤프 비율, 승률, 거래 횟수 등을 JSON 형태로 저장)'
  })
  backtestSummary?: {
    totalReturn: number;        // 총 수익률
    annualizedReturn: number;   // 연간 수익률
    maxDrawdown: number;        // 최대 손실폭
    sharpeRatio: number;        // 샤프 비율
    winRate: number;            // 승률
    totalTrades: number;        // 총 거래 횟수
    profitableTrades: number;   // 수익 거래 횟수
    averageWin: number;         // 평균 수익
    averageLoss: number;        // 평균 손실
    profitFactor: number;       // 수익 팩터
  };

  /** 마지막 실행 일시 */
  @Column({ 
    name: 'last_executed_at', 
    type: 'timestamp', 
    nullable: true,
    comment: '마지막 실행 일시'
  })
  lastExecutedAt: Date | null;

  /** 전략 생성 일시 */
  @CreateDateColumn({ 
    name: 'createdAt',
    comment: '전략 생성 일시'
  })
  createdAt: Date;

  /** 전략 수정 일시 */
  @UpdateDateColumn({ 
    name: 'updatedAt',
    comment: '전략 수정 일시'
  })
  updatedAt: Date;

  // 관계 설정
  /** 전략 소유자 */
  @ManyToOne(() => User, (user) => user.tradingStrategies)
  @JoinColumn({ name: 'userId' })
  user: User;

  /** 이 전략에서 생성된 거래 신호들 */
  @OneToMany(() => TradingSignal, (signal) => signal.strategy)
  signals: TradingSignal[];

  /** 이 전략의 백테스팅 결과들 */
  @OneToMany(() => BacktestResult, (result) => result.strategy)
  backtestResults: BacktestResult[];
} 