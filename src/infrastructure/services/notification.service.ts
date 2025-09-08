import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter } from 'events';
import { Notification } from '../../entities/notification.entity';
import { UserNotificationSettings } from '../../entities/user-notification-settings.entity';
import { User } from '../../entities/user.entity';
import { CreateNotificationDto, SendNotificationDto } from '../../dtos/notification.dto';
import { NotificationType, NotificationStatus, DeliveryMethod } from '../../entities/notification.entity';
import { EmailService } from './email.service';
import { NotificationTemplateService } from './notification-template.service';

/**
 * 알림 서비스
 * 다양한 이벤트에 따른 알림을 생성, 저장, 전송하는 기능을 제공
 */
@Injectable()
export class NotificationService extends EventEmitter {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(UserNotificationSettings)
    private readonly userNotificationSettingsRepository: Repository<UserNotificationSettings>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly templateService: NotificationTemplateService,
  ) {
    super();
    this.setupEventListeners();
  }

  /**
   * 이벤트 리스너 설정
   */
  private setupEventListeners(): void {
    this.on('tradeExecuted', (data) => {
      this.handleTradeExecuted(data);
    });

    this.on('priceAlert', (data) => {
      this.handlePriceAlert(data);
    });

    this.on('portfolioUpdate', (data) => {
      this.handlePortfolioUpdate(data);
    });

    this.on('strategyTriggered', (data) => {
      this.handleStrategyTriggered(data);
    });

    this.on('systemAlert', (data) => {
      this.handleSystemAlert(data);
    });
  }

  /**
   * 알림 생성 및 저장
   */
  async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    try {
      const notification = this.notificationRepository.create({
        ...createNotificationDto,
        status: NotificationStatus.PENDING,
        createdAt: new Date(),
      });

      const savedNotification = await this.notificationRepository.save(notification);
      this.logger.log(`알림 생성 완료: ${savedNotification.id} - ${savedNotification.type}`);

      // 알림 전송 이벤트 발생
      this.emit('notificationCreated', savedNotification);

      return savedNotification;
    } catch (error) {
      this.logger.error(`알림 생성 실패: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 사용자별 알림 전송
   */
  async sendNotificationToUser(userId: number, sendNotificationDto: SendNotificationDto): Promise<void> {
    try {
      // 사용자 알림 설정 확인
      const userSettings = await this.getUserNotificationSettings(userId);
      if (!userSettings) {
        this.logger.warn(`사용자 알림 설정을 찾을 수 없음: ${userId}`);
        return;
      }

      // 알림 타입이 활성화되어 있는지 확인
      if (!this.isNotificationTypeEnabled(userSettings, sendNotificationDto.type)) {
        this.logger.debug(`알림 타입이 비활성화됨: ${userId} - ${sendNotificationDto.type}`);
        return;
      }

      // 알림 생성
      const notification = await this.createNotification({
        userId,
        type: sendNotificationDto.type,
        title: sendNotificationDto.title,
        message: sendNotificationDto.message,
        data: sendNotificationDto.data,
        priority: sendNotificationDto.priority || 'medium',
      });

      // 활성화된 전송 방법으로 알림 전송
      await this.sendNotificationByMethods(notification, userSettings);

    } catch (error) {
      this.logger.error(`사용자 알림 전송 실패: ${userId} - ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 다중 사용자에게 알림 전송
   */
  async sendNotificationToUsers(userIds: number[], sendNotificationDto: SendNotificationDto): Promise<void> {
    const promises = userIds.map(userId => 
      this.sendNotificationToUser(userId, sendNotificationDto)
    );

    try {
      await Promise.allSettled(promises);
      this.logger.log(`${userIds.length}명의 사용자에게 알림 전송 완료`);
    } catch (error) {
      this.logger.error(`다중 사용자 알림 전송 실패: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 알림 상태 업데이트
   */
  async updateNotificationStatus(notificationId: number, status: NotificationStatus): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.findOne({ where: { id: notificationId } });
      if (!notification) {
        throw new Error(`알림을 찾을 수 없음: ${notificationId}`);
      }

      notification.status = status;
      notification.updatedAt = new Date();

      const updatedNotification = await this.notificationRepository.save(notification);
      this.logger.log(`알림 상태 업데이트: ${notificationId} - ${status}`);

      return updatedNotification;
    } catch (error) {
      this.logger.error(`알림 상태 업데이트 실패: ${notificationId} - ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 사용자 알림 목록 조회
   */
  async getUserNotifications(userId: number, limit: number = 50, offset: number = 0): Promise<Notification[]> {
    try {
      const notifications = await this.notificationRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      });

      return notifications;
    } catch (error) {
      this.logger.error(`사용자 알림 조회 실패: ${userId} - ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 읽지 않은 알림 개수 조회
   */
  async getUnreadNotificationCount(userId: number): Promise<number> {
    try {
      const count = await this.notificationRepository.count({
        where: { 
          userId, 
          status: NotificationStatus.PENDING 
        },
      });

      return count;
    } catch (error) {
      this.logger.error(`읽지 않은 알림 개수 조회 실패: ${userId} - ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 알림 읽음 처리
   */
  async markNotificationAsRead(notificationId: number): Promise<void> {
    try {
      await this.updateNotificationStatus(notificationId, NotificationStatus.READ);
    } catch (error) {
      this.logger.error(`알림 읽음 처리 실패: ${notificationId} - ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 사용자 알림 설정 조회
   */
  private async getUserNotificationSettings(userId: number): Promise<UserNotificationSettings | null> {
    try {
      return await this.userNotificationSettingsRepository.findOne({
        where: { userId },
      });
    } catch (error) {
      this.logger.error(`사용자 알림 설정 조회 실패: ${userId} - ${error.message}`, error.stack);
      return null;
    }
  }

  /**
   * 알림 타입 활성화 여부 확인
   */
  private isNotificationTypeEnabled(settings: UserNotificationSettings, type: NotificationType): boolean {
    switch (type) {
      case NotificationType.TRADE_EXECUTED:
        return settings.tradeExecuted;
      case NotificationType.PRICE_ALERT:
        return settings.priceAlert;
      case NotificationType.PORTFOLIO_UPDATE:
        return settings.portfolioUpdate;
      case NotificationType.STRATEGY_TRIGGERED:
        return settings.strategyTriggered;
      case NotificationType.SYSTEM_ALERT:
        return settings.systemAlert;
      default:
        return false;
    }
  }

  /**
   * 활성화된 전송 방법으로 알림 전송 (재시도 메커니즘 포함)
   */
  private async sendNotificationByMethods(notification: Notification, settings: UserNotificationSettings): Promise<void> {
    const maxRetries = 3;
    const retryDelay = 1000; // 1초

    const sendWithRetry = async (sendMethod: () => Promise<void>, methodName: string): Promise<void> => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          await sendMethod();
          this.logger.log(`${methodName} 전송 성공: ${notification.id} (시도 ${attempt})`);
          return;
        } catch (error) {
          this.logger.warn(`${methodName} 전송 실패: ${notification.id} (시도 ${attempt}/${maxRetries}) - ${error.message}`);
          
          if (attempt === maxRetries) {
            throw error;
          }
          
          // 재시도 전 대기
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        }
      }
    };

    const promises: Promise<void>[] = [];

    // 이메일 알림
    if (settings.emailEnabled) {
      promises.push(
        sendWithRetry(
          () => this.sendEmailNotification(notification),
          '이메일'
        )
      );
    }

    // 푸시 알림
    if (settings.pushEnabled) {
      promises.push(
        sendWithRetry(
          () => this.sendPushNotification(notification),
          '푸시'
        )
      );
    }

    // WebSocket 알림
    if (settings.websocketEnabled) {
      promises.push(
        sendWithRetry(
          () => this.sendWebSocketNotification(notification),
          'WebSocket'
        )
      );
    }

    try {
      await Promise.allSettled(promises);
      await this.updateNotificationStatus(notification.id, NotificationStatus.SENT);
      this.logger.log(`알림 전송 완료: ${notification.id}`);
    } catch (error) {
      this.logger.error(`알림 전송 실패: ${notification.id} - ${error.message}`, error.stack);
      await this.updateNotificationStatus(notification.id, NotificationStatus.FAILED);
    }
  }

  /**
   * 이메일 알림 전송
   */
  private async sendEmailNotification(notification: Notification): Promise<void> {
    try {
      // 사용자 정보 조회
      const user = await this.userRepository.findOne({ where: { id: notification.userId } });
      if (!user || !user.email) {
        this.logger.warn(`사용자 이메일을 찾을 수 없음: ${notification.userId}`);
        return;
      }

      // 이메일 전송
      await this.emailService.sendNotificationEmail(user.email, notification, {
        name: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
      });

      this.logger.log(`이메일 알림 전송 완료: ${notification.id} - ${user.email}`);
      
    } catch (error) {
      this.logger.error(`이메일 알림 전송 실패: ${notification.id} - ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 푸시 알림 전송
   */
  private async sendPushNotification(notification: Notification): Promise<void> {
    try {
      // TODO: 실제 푸시 알림 서비스 연동 (Firebase, OneSignal 등)
      this.logger.log(`푸시 알림 전송: ${notification.id} - ${notification.title}`);
      
      // 임시 구현: 로그만 출력
      console.log(`[PUSH] To: User ${notification.userId}`);
      console.log(`[PUSH] Title: ${notification.title}`);
      console.log(`[PUSH] Body: ${notification.message}`);
      
    } catch (error) {
      this.logger.error(`푸시 알림 전송 실패: ${notification.id} - ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * WebSocket 알림 전송
   */
  private async sendWebSocketNotification(notification: Notification): Promise<void> {
    try {
      // WebSocket Gateway를 통한 실시간 알림 전송
      // TradingWebSocketGateway 의존성을 제거하고 WebSocket 알림 전송을 선택적으로 처리하도록 수정
      // 실제 WebSocket 구현이 필요합니다.
      this.logger.log(`WebSocket 알림 전송: ${notification.id} - 사용자 ${notification.userId}`);
      
    } catch (error) {
      this.logger.error(`WebSocket 알림 전송 실패: ${notification.id} - ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 거래 실행 알림 처리
   */
  private async handleTradeExecuted(data: any): Promise<void> {
    const { userId, tradeData } = data;
    
    const template = this.templateService.generateTradeExecutedTemplate(tradeData);
    const formatted = this.templateService.formatNotificationMessage(template, 'TRADE_EXECUTED', 'high');
    
    await this.sendNotificationToUser(userId, {
      userIds: [userId],
      type: NotificationType.TRADE_EXECUTED,
      title: formatted.title,
      message: formatted.message,
      data: tradeData,
      priority: 'high',
    });
  }

  /**
   * 가격 알림 처리
   */
  private async handlePriceAlert(data: any): Promise<void> {
    const { userId, alertData } = data;
    
    const template = this.templateService.generatePriceAlertTemplate(alertData);
    const formatted = this.templateService.formatNotificationMessage(template, 'PRICE_ALERT', 'medium');
    
    await this.sendNotificationToUser(userId, {
      userIds: [userId],
      type: NotificationType.PRICE_ALERT,
      title: formatted.title,
      message: formatted.message,
      data: alertData,
      priority: 'medium',
    });
  }

  /**
   * 포트폴리오 업데이트 알림 처리
   */
  private async handlePortfolioUpdate(data: any): Promise<void> {
    const { userId, portfolioData } = data;
    
    const template = this.templateService.generatePortfolioUpdateTemplate(portfolioData);
    const formatted = this.templateService.formatNotificationMessage(template, 'PORTFOLIO_UPDATE', 'medium');
    
    await this.sendNotificationToUser(userId, {
      userIds: [userId],
      type: NotificationType.PORTFOLIO_UPDATE,
      title: formatted.title,
      message: formatted.message,
      data: portfolioData,
      priority: 'medium',
    });
  }

  /**
   * 전략 실행 알림 처리
   */
  private async handleStrategyTriggered(data: any): Promise<void> {
    const { userId, strategyData } = data;
    
    const template = this.templateService.generateStrategyTriggeredTemplate(strategyData);
    const formatted = this.templateService.formatNotificationMessage(template, 'STRATEGY_TRIGGERED', 'high');
    
    await this.sendNotificationToUser(userId, {
      userIds: [userId],
      type: NotificationType.STRATEGY_TRIGGERED,
      title: formatted.title,
      message: formatted.message,
      data: strategyData,
      priority: 'high',
    });
  }

  /**
   * 시스템 알림 처리
   */
  private async handleSystemAlert(data: any): Promise<void> {
    const { userIds, alertData } = data;
    
    const template = this.templateService.generateSystemAlertTemplate(alertData);
    const formatted = this.templateService.formatNotificationMessage(template, 'SYSTEM_ALERT', alertData.priority || 'medium');
    
    await this.sendNotificationToUsers(userIds, {
      userIds: userIds,
      type: NotificationType.SYSTEM_ALERT,
      title: formatted.title,
      message: formatted.message,
      data: alertData,
      priority: alertData.priority || 'medium',
    });
  }

  /**
   * 알림 통계 조회
   */
  async getNotificationStatistics(userId: number): Promise<any> {
    try {
      const [total, pending, sent, failed] = await Promise.all([
        this.notificationRepository.count({ where: { userId } }),
        this.notificationRepository.count({ where: { userId, status: NotificationStatus.PENDING } }),
        this.notificationRepository.count({ where: { userId, status: NotificationStatus.SENT } }),
        this.notificationRepository.count({ where: { userId, status: NotificationStatus.FAILED } }),
      ]);

      return {
        total,
        pending,
        sent,
        failed,
        successRate: total > 0 ? (sent / total) * 100 : 0,
      };
    } catch (error) {
      this.logger.error(`알림 통계 조회 실패: ${userId} - ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 오래된 알림 정리
   */
  async cleanupOldNotifications(daysToKeep: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await this.notificationRepository.delete({
        createdAt: { $lt: cutoffDate } as any,
        status: NotificationStatus.READ,
      });

      this.logger.log(`${result.affected}개의 오래된 알림 정리 완료`);
      return result.affected || 0;
    } catch (error) {
      this.logger.error(`오래된 알림 정리 실패: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 실패한 알림 재전송
   */
  async retryFailedNotifications(): Promise<number> {
    try {
      const failedNotifications = await this.notificationRepository.find({
        where: { status: NotificationStatus.FAILED },
        relations: ['user'],
      });

      let retryCount = 0;
      for (const notification of failedNotifications) {
        try {
          const userSettings = await this.getUserNotificationSettings(notification.userId);
          if (userSettings) {
            await this.sendNotificationByMethods(notification, userSettings);
            retryCount++;
          }
        } catch (error) {
          this.logger.error(`알림 재전송 실패: ${notification.id} - ${error.message}`);
        }
      }

      this.logger.log(`${retryCount}개의 실패한 알림 재전송 완료`);
      return retryCount;
    } catch (error) {
      this.logger.error(`실패한 알림 재전송 실패: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 알림 통계 대시보드 데이터
   */
  async getNotificationDashboardData(): Promise<any> {
    try {
      const [
        totalNotifications,
        pendingNotifications,
        sentNotifications,
        failedNotifications,
        todayNotifications,
        weeklyNotifications,
      ] = await Promise.all([
        this.notificationRepository.count(),
        this.notificationRepository.count({ where: { status: NotificationStatus.PENDING } }),
        this.notificationRepository.count({ where: { status: NotificationStatus.SENT } }),
        this.notificationRepository.count({ where: { status: NotificationStatus.FAILED } }),
        this.notificationRepository.count({
          where: {
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } as any,
          },
        }),
        this.notificationRepository.count({
          where: {
            createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) } as any,
          },
        }),
      ]);

      return {
        total: totalNotifications,
        pending: pendingNotifications,
        sent: sentNotifications,
        failed: failedNotifications,
        today: todayNotifications,
        weekly: weeklyNotifications,
        successRate: totalNotifications > 0 ? (sentNotifications / totalNotifications) * 100 : 0,
        failureRate: totalNotifications > 0 ? (failedNotifications / totalNotifications) * 100 : 0,
      };
    } catch (error) {
      this.logger.error(`알림 대시보드 데이터 조회 실패: ${error.message}`, error.stack);
      throw error;
    }
  }
} 