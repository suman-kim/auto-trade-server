import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TradingStrategy } from './trading-strategy.entity';

/**
 * 백테스팅 결과 엔티티
 * 자동매매 전략의 백테스팅 결과를 관리합니다.
 */
@Entity('backtest_results')
export class BacktestResult {
  /** 백테스팅 결과 고유 ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 백테스팅을 수행한 전략 ID */
  @Column({ 
    name: 'strategyId',
    comment: '백테스팅을 수행한 전략 ID'
  })
  strategyId: number;

  /** 백테스팅 결과 이름 */
  @Column({
    comment: '백테스팅 결과 이름'
  })
  name: string;

  /** 백테스팅 시작 날짜 */
  @Column({ 
    name: 'start_date', 
    type: 'date',
    comment: '백테스팅 시작 날짜'
  })
  startDate: Date;

  /** 백테스팅 종료 날짜 */
  @Column({ 
    name: 'end_date', 
    type: 'date',
    comment: '백테스팅 종료 날짜'
  })
  endDate: Date;

  /** 초기 자본금 */
  @Column({ 
    name: 'initial_capital', 
    type: 'decimal', 
    precision: 15, 
    scale: 2,
    comment: '초기 자본금'
  })
  initialCapital: number;

  /** 최종 자본금 */
  @Column({ 
    name: 'final_capital', 
    type: 'decimal', 
    precision: 15, 
    scale: 2,
    comment: '최종 자본금'
  })
  finalCapital: number;

  /** 총 수익률 (%) */
  @Column({ 
    name: 'total_return', 
    type: 'decimal', 
    precision: 8, 
    scale: 2,
    comment: '총 수익률 (%)'
  })
  totalReturn: number;

  /** 연간 수익률 (%) */
  @Column({ 
    name: 'annualized_return', 
    type: 'decimal', 
    precision: 8, 
    scale: 2, 
    nullable: true,
    comment: '연간 수익률 (%)'
  })
  annualizedReturn: number;

  /** 샤프 비율 (위험 대비 수익률) */
  @Column({ 
    name: 'sharpe_ratio', 
    type: 'decimal', 
    precision: 8, 
    scale: 2, 
    nullable: true,
    comment: '샤프 비율 (위험 대비 수익률)'
  })
  sharpeRatio: number;

  /** 최대 손실폭 (%) */
  @Column({ 
    name: 'max_drawdown', 
    type: 'decimal', 
    precision: 8, 
    scale: 2, 
    nullable: true,
    comment: '최대 손실폭 (%)'
  })
  maxDrawdown: number;

  /** 총 거래 횟수 */
  @Column({ 
    name: 'total_trades',
    comment: '총 거래 횟수'
  })
  totalTrades: number;

  /** 수익 거래 횟수 */
  @Column({ 
    name: 'winning_trades',
    comment: '수익 거래 횟수'
  })
  winningTrades: number;

  /** 손실 거래 횟수 */
  @Column({ 
    name: 'losing_trades',
    comment: '손실 거래 횟수'
  })
  losingTrades: number;

  /** 승률 (%) */
  @Column({ 
    name: 'win_rate', 
    type: 'decimal', 
    precision: 8, 
    scale: 2,
    comment: '승률 (%)'
  })
  winRate: number;

  /** 평균 수익 (%) */
  @Column({ 
    name: 'average_win', 
    type: 'decimal', 
    precision: 8, 
    scale: 2, 
    nullable: true,
    comment: '평균 수익 (%)'
  })
  averageWin: number;

  /** 평균 손실 (%) */
  @Column({ 
    name: 'average_loss', 
    type: 'decimal', 
    precision: 8, 
    scale: 2, 
    nullable: true,
    comment: '평균 손실 (%)'
  })
  averageLoss: number;

  /** 수익 팩터 (총 수익 / 총 손실) */
  @Column({ 
    name: 'profit_factor', 
    type: 'decimal', 
    precision: 8, 
    scale: 2, 
    nullable: true,
    comment: '수익 팩터 (총 수익 / 총 손실)'
  })
  profitFactor: number;

  /** 백테스팅 결과 생성 일시 */
  @CreateDateColumn({ 
    name: 'createdAt',
    comment: '백테스팅 결과 생성 일시'
  })
  createdAt: Date;

  // 관계 설정
  /** 백테스팅을 수행한 전략 */
  @ManyToOne(() => TradingStrategy, (strategy) => strategy.backtestResults)
  @JoinColumn({ name: 'strategyId' })
  strategy: TradingStrategy;
} 