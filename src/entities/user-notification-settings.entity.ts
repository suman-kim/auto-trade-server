import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 사용자 알림 설정 엔티티
 * 사용자별로 알림 타입과 전송 방법을 설정할 수 있습니다.
 */
@Entity('user_notification_settings')
export class UserNotificationSettings {
  /** 설정 고유 ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 사용자 ID */
  @Column({ 
    name: 'userId',
    comment: '사용자 ID'
  })
  userId: number;

  // 알림 타입별 설정
  /** 거래 실행 알림 활성화 */
  @Column({ 
    name: 'trade_executed', 
    default: true,
    comment: '거래 실행 알림 활성화 (true: 활성, false: 비활성)'
  })
  tradeExecuted: boolean;

  /** 가격 알림 활성화 */
  @Column({ 
    name: 'price_alert', 
    default: true,
    comment: '가격 알림 활성화 (true: 활성, false: 비활성)'
  })
  priceAlert: boolean;

  /** 포트폴리오 업데이트 알림 활성화 */
  @Column({ 
    name: 'portfolio_update', 
    default: true,
    comment: '포트폴리오 업데이트 알림 활성화 (true: 활성, false: 비활성)'
  })
  portfolioUpdate: boolean;

  /** 전략 실행 알림 활성화 */
  @Column({ 
    name: 'strategy_triggered', 
    default: true,
    comment: '전략 실행 알림 활성화 (true: 활성, false: 비활성)'
  })
  strategyTriggered: boolean;

  /** 시스템 알림 활성화 */
  @Column({ 
    name: 'system_alert', 
    default: true,
    comment: '시스템 알림 활성화 (true: 활성, false: 비활성)'
  })
  systemAlert: boolean;

  // 전송 방법별 설정
  /** 이메일 알림 활성화 */
  @Column({ 
    name: 'email_enabled', 
    default: true,
    comment: '이메일 알림 활성화 (true: 활성, false: 비활성)'
  })
  emailEnabled: boolean;

  /** 푸시 알림 활성화 */
  @Column({ 
    name: 'push_enabled', 
    default: true,
    comment: '푸시 알림 활성화 (true: 활성, false: 비활성)'
  })
  pushEnabled: boolean;

  /** 웹소켓 알림 활성화 */
  @Column({ 
    name: 'websocket_enabled', 
    default: true,
    comment: '웹소켓 알림 활성화 (true: 활성, false: 비활성)'
  })
  websocketEnabled: boolean;

  /** 이메일 주소 */
  @Column({ 
    name: 'email_address', 
    nullable: true,
    comment: '이메일 주소 (알림 수신용)'
  })
  emailAddress: string;

  /** 푸시 토큰 */
  @Column({ 
    name: 'push_token', 
    nullable: true,
    comment: '푸시 알림 토큰'
  })
  pushToken: string;

  /** 설정 생성 일시 */
  @CreateDateColumn({ 
    name: 'createdAt',
    comment: '설정 생성 일시'
  })
  createdAt: Date;

  /** 설정 수정 일시 */
  @UpdateDateColumn({ 
    name: 'updatedAt',
    comment: '설정 수정 일시'
  })
  updatedAt: Date;


  /**
   * 특정 알림 타입이 활성화되어 있는지 확인합니다.
   */
  isNotificationTypeEnabled(type: string): boolean {
    switch (type) {
      case 'TRADE_EXECUTED':
        return this.tradeExecuted;
      case 'PRICE_ALERT':
        return this.priceAlert;
      case 'PORTFOLIO_UPDATE':
        return this.portfolioUpdate;
      case 'STRATEGY_TRIGGERED':
        return this.strategyTriggered;
      case 'SYSTEM_ALERT':
        return this.systemAlert;
      default:
        return false;
    }
  }

  /**
   * 특정 전송 방법이 활성화되어 있는지 확인합니다.
   */
  isDeliveryMethodEnabled(method: string): boolean {
    switch (method) {
      case 'email':
        return this.emailEnabled;
      case 'push':
        return this.pushEnabled;
      case 'websocket':
        return this.websocketEnabled;
      default:
        return false;
    }
  }

  /**
   * 모든 알림이 비활성화되어 있는지 확인합니다.
   */
  isAllNotificationsDisabled(): boolean {
    return !this.tradeExecuted && 
           !this.priceAlert && 
           !this.portfolioUpdate && 
           !this.strategyTriggered && 
           !this.systemAlert;
  }

  /**
   * 모든 전송 방법이 비활성화되어 있는지 확인합니다.
   */
  isAllDeliveryMethodsDisabled(): boolean {
    return !this.emailEnabled && 
           !this.pushEnabled && 
           !this.websocketEnabled;
  }
} 