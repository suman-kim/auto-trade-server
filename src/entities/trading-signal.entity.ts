import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TradingStrategy } from './trading-strategy.entity';
import { Stock } from './stock.entity';
import { SignalType } from '../shared/types/trading-strategy.types';

/**
 * 거래 신호 엔티티
 * 자동매매 전략에서 생성된 거래 신호를 관리합니다.
 */
@Entity('trading_signals')
export class TradingSignal {
  /** 거래 신호 고유 ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 신호를 생성한 전략 ID */
  @Column({ 
    name: 'strategyId',
    comment: '신호를 생성한 전략 ID'
  })
  strategyId: number;

  /** 신호가 발생한 주식 ID */
  @Column({ 
    name: 'stockId',
    comment: '신호가 발생한 주식 ID'
  })
  stockId: number;

  /** 신호 타입 (매수/매도/보유) */
  @Column({ 
    name: 'signal_type',
    comment: '신호 타입 (BUY: 매수, SELL: 매도, HOLD: 보유)'
  })
  signalType: SignalType;

  /** 신호 신뢰도 (0.0000 ~ 1.0000) */
  @Column({ 
    type: 'decimal', 
    precision: 5, 
    scale: 4,
    comment: '신호 신뢰도 (0.0000 ~ 1.0000, 높을수록 신뢰도 높음)'
  })
  confidence: number;

  /** 신호 발생 시점의 주가 */
  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    comment: '신호 발생 시점의 주가'
  })
  price: number;

  /** 신호 발생 시점의 거래량 */
  @Column({ 
    nullable: true,
    comment: '신호 발생 시점의 거래량'
  })
  volume: number;

  /** 신호 생성에 사용된 기술적 지표 값들 (JSON) */
  @Column({ 
    type: 'json', 
    nullable: true,
    comment: '신호 생성에 사용된 기술적 지표 값들 (JSON 형태)'
  })
  indicators: any;

  /** 신호 실행 여부 */
  @Column({ 
    default: false,
    comment: '신호 실행 여부 (true: 실행됨, false: 미실행)'
  })
  executed: boolean;

  /** 신호 실행 일시 */
  @Column({ 
    name: 'executed_at', 
    type: 'timestamp', 
    nullable: true,
    comment: '신호 실행 일시'
  })
  executedAt: Date | null;

  /** 신호 생성 일시 */
  @CreateDateColumn({ 
    name: 'createdAt',
    comment: '신호 생성 일시'
  })
  createdAt: Date;

  // 관계 설정
  /** 신호를 생성한 전략 */
  @ManyToOne(() => TradingStrategy, (strategy) => strategy.signals)
  @JoinColumn({ name: 'strategyId' })
  strategy: TradingStrategy;

  /** 신호가 발생한 주식 */
  @ManyToOne(() => Stock)
  @JoinColumn({ name: 'stockId' })
  stock: Stock;
} 