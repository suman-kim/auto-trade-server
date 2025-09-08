import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

/**
 * 알림 타입 열거형
 */
export enum NotificationType {
  TRADE_EXECUTED = 'TRADE_EXECUTED',       // 거래 실행 알림
  PRICE_ALERT = 'PRICE_ALERT',             // 가격 알림
  PORTFOLIO_UPDATE = 'PORTFOLIO_UPDATE',   // 포트폴리오 업데이트 알림
  STRATEGY_TRIGGERED = 'STRATEGY_TRIGGERED', // 전략 실행 알림
  SYSTEM_ALERT = 'SYSTEM_ALERT'            // 시스템 알림
}

/**
 * 알림 상태 열거형
 */
export enum NotificationStatus {
  PENDING = 'PENDING',     // 대기 중
  SENT = 'SENT',          // 발송 완료
  READ = 'READ',          // 읽음
  FAILED = 'FAILED'       // 발송 실패
}

/**
 * 배송 방법 열거형
 */
export enum DeliveryMethod {
  EMAIL = 'EMAIL',         // 이메일
  PUSH = 'PUSH',          // 푸시 알림
  WEBSOCKET = 'WEBSOCKET'  // 웹소켓
}

/**
 * 알림 엔티티
 * 사용자에게 전송되는 알림을 관리합니다.
 */
@Entity('notifications')
export class Notification {
  /** 알림 고유 ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 알림을 받을 사용자 ID */
  @Column({ 
    name: 'userId',
    comment: '알림을 받을 사용자 ID'
  })
  userId: number;

  /** 알림 타입 */
  @Column({
    comment: '알림 타입 (TRADE_EXECUTED, PRICE_ALERT, PORTFOLIO_UPDATE, STRATEGY_TRIGGERED, SYSTEM_ALERT)'
  })
  type: string;

  /** 알림 제목 */
  @Column({
    comment: '알림 제목'
  })
  title: string;

  /** 알림 내용 */
  @Column({ 
    type: 'text',
    comment: '알림 내용'
  })
  message: string;

  /** 알림 상태 */
  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
    comment: '알림 상태 (PENDING: 대기중, SENT: 발송완료, READ: 읽음, FAILED: 발송실패)'
  })
  status: NotificationStatus;

  /** 알림 우선순위 */
  @Column({ 
    default: 'medium',
    comment: '알림 우선순위 (low, medium, high)'
  })
  priority: string;

  /** 알림 추가 데이터 (JSON) */
  @Column({ 
    type: 'json', 
    nullable: true,
    comment: '알림 추가 데이터 (JSON 형태)'
  })
  data: any;

  /** 알림 읽음 여부 */
  @Column({ 
    name: 'is_read', 
    default: false,
    comment: '알림 읽음 여부 (true: 읽음, false: 안읽음)'
  })
  isRead: boolean;

  /** 알림 생성 일시 */
  @CreateDateColumn({ 
    name: 'createdAt',
    comment: '알림 생성 일시'
  })
  createdAt: Date;

  /** 알림 수정 일시 */
  @UpdateDateColumn({ 
    name: 'updatedAt',
    comment: '알림 수정 일시'
  })
  updatedAt: Date;

  // 관계 설정
  /** 알림을 받은 사용자 */
  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * 알림이 읽혔는지 확인합니다.
   */
  isNotificationRead(): boolean {
    return this.isRead;
  }

  /**
   * 알림을 읽음 상태로 표시합니다.
   */
  markAsRead(): void {
    this.isRead = true;
  }

  /**
   * 알림이 최근에 생성되었는지 확인합니다 (24시간 이내).
   */
  isRecent(): boolean {
    const now = new Date();
    const timeDiff = now.getTime() - this.createdAt.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    return hoursDiff <= 24;
  }

  /**
   * 알림이 긴급한지 확인합니다.
   */
  isUrgent(): boolean {
    return this.type === NotificationType.SYSTEM_ALERT || 
           this.type === NotificationType.PRICE_ALERT;
  }
} 