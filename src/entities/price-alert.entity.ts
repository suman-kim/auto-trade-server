import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Stock } from './stock.entity';

/**
 * 가격 알림 타입 열거형
 */
export enum PriceAlertType {
  ABOVE = 'ABOVE',  // 가격이 특정 수준 이상일 때 알림
  BELOW = 'BELOW'   // 가격이 특정 수준 이하일 때 알림
}

/**
 * 가격 알림 엔티티
 * 주식 가격이 특정 수준에 도달했을 때 알림을 보내는 설정을 관리합니다.
 */
@Entity('price_alerts')
export class PriceAlert {
  /** 가격 알림 고유 ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 알림을 설정한 사용자 ID */
  @Column({ 
    name: 'userId',
    comment: '알림을 설정한 사용자 ID'
  })
  userId: number;

  /** 알림을 설정한 주식 ID */
  @Column({ 
    name: 'stockId',
    comment: '알림을 설정한 주식 ID'
  })
  stockId: number;

  /** 알림 타입 (이상/이하) */
  @Column({ 
    name: 'alert_type',
    comment: '알림 타입 (ABOVE: 이상, BELOW: 이하)'
  })
  alertType: 'ABOVE' | 'BELOW';

  /** 목표 가격 (알림이 발생할 가격) */
  @Column({ 
    name: 'target_price', 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    comment: '목표 가격 (알림이 발생할 가격)'
  })
  targetPrice: number;

  /** 알림 활성화 상태 */
  @Column({ 
    name: 'is_active', 
    default: true,
    comment: '알림 활성화 상태 (true: 활성, false: 비활성)'
  })
  isActive: boolean;

  /** 알림 설정 생성 일시 */
  @CreateDateColumn({ 
    name: 'createdAt',
    comment: '알림 설정 생성 일시'
  })
  createdAt: Date;

  // 관계 설정
  /** 알림을 설정한 사용자 */
  @ManyToOne(() => User, (user) => user.priceAlerts)
  @JoinColumn({ name: 'userId' })
  user: User;

  /** 알림을 설정한 주식 */
  @ManyToOne(() => Stock)
  @JoinColumn({ name: 'stockId' })
  stock: Stock;

  /**
   * 알림이 활성화되어 있는지 확인합니다.
   */
  isAlertActive(): boolean {
    return this.isActive;
  }

  /**
   * 현재 가격이 알림 조건을 만족하는지 확인합니다.
   */
  isTriggered(currentPrice: number): boolean {
    if (!this.isActive) {
      return false;
    }

    if (this.alertType === PriceAlertType.ABOVE) {
      return currentPrice >= this.targetPrice;
    } else {
      return currentPrice <= this.targetPrice;
    }
  }

  /**
   * 알림이 위쪽 가격 알림인지 확인합니다.
   */
  isAboveAlert(): boolean {
    return this.alertType === PriceAlertType.ABOVE;
  }

  /**
   * 알림이 아래쪽 가격 알림인지 확인합니다.
   */
  isBelowAlert(): boolean {
    return this.alertType === PriceAlertType.BELOW;
  }

  /**
   * 알림을 비활성화합니다.
   */
  deactivate(): void {
    this.isActive = false;
  }

  /**
   * 알림을 활성화합니다.
   */
  activate(): void {
    this.isActive = true;
  }
} 