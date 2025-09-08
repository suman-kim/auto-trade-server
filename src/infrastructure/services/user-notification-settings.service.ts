import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserNotificationSettings } from '../../entities/user-notification-settings.entity';
import { User } from '../../entities/user.entity';
import { CreateNotificationSettingsDto, UpdateNotificationSettingsDto } from '../../dtos/notification.dto';

/**
 * 사용자 알림 설정 관리 서비스
 * 사용자별 알림 타입과 전송 방법 설정을 관리
 */
@Injectable()
export class UserNotificationSettingsService {
  private readonly logger = new Logger(UserNotificationSettingsService.name);

  constructor(
    @InjectRepository(UserNotificationSettings)
    private readonly settingsRepository: Repository<UserNotificationSettings>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 사용자의 알림 설정 조회
   */
  async getUserSettings(userId: number): Promise<UserNotificationSettings> {
    this.logger.debug(`사용자 ${userId}의 알림 설정 조회`);

    let settings = await this.settingsRepository.findOne({
      where: { userId },
    });

    if (!settings) {
      // 기본 설정 생성
      settings = await this.createDefaultSettings(userId);
    }

    return settings;
  }

  /**
   * 기본 알림 설정 생성
   */
  async createDefaultSettings(userId: number): Promise<UserNotificationSettings> {
    this.logger.debug(`사용자 ${userId}의 기본 알림 설정 생성`);

    const defaultSettings = new UserNotificationSettings();
    defaultSettings.userId = userId;
    defaultSettings.tradeExecuted = true;
    defaultSettings.priceAlert = true;
    defaultSettings.portfolioUpdate = true;
    defaultSettings.strategyTriggered = true;
    defaultSettings.systemAlert = true;
    defaultSettings.emailEnabled = true;
    defaultSettings.pushEnabled = false;
    defaultSettings.websocketEnabled = true;
    defaultSettings.emailAddress = '';
    defaultSettings.pushToken = '';

    return await this.settingsRepository.save(defaultSettings);
  }

  /**
   * 알림 설정 생성
   */
  async createSettings(
    userId: number,
    createDto: CreateNotificationSettingsDto,
  ): Promise<UserNotificationSettings> {
    this.logger.debug(`사용자 ${userId}의 알림 설정 생성`);

    // 사용자 존재 확인
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`사용자를 찾을 수 없습니다: ${userId}`);
    }

    // 기존 설정 확인
    const existingSettings = await this.settingsRepository.findOne({
      where: { userId },
    });

    if (existingSettings) {
      throw new Error(`사용자 ${userId}의 알림 설정이 이미 존재합니다`);
    }

    const settings = this.settingsRepository.create({
      userId,
      tradeExecuted: createDto.tradeExecuted?.enabled ?? true,
      priceAlert: createDto.priceAlert?.enabled ?? true,
      portfolioUpdate: createDto.portfolioUpdate?.enabled ?? true,
      strategyTriggered: createDto.strategyTriggered?.enabled ?? true,
      systemAlert: createDto.systemAlert?.enabled ?? true,
      emailEnabled: createDto.tradeExecuted?.email ?? true,
      pushEnabled: createDto.tradeExecuted?.push ?? false,
      websocketEnabled: createDto.tradeExecuted?.websocket ?? true,
    });

    const savedSettings = await this.settingsRepository.save(settings);
    this.logger.log(`사용자 ${userId}의 알림 설정 생성 완료`);
    
    return savedSettings;
  }

  /**
   * 알림 설정 업데이트
   */
  async updateSettings(
    userId: number,
    updateDto: UpdateNotificationSettingsDto,
  ): Promise<UserNotificationSettings> {
    this.logger.debug(`사용자 ${userId}의 알림 설정 업데이트`);

    const settings = await this.getUserSettings(userId);
    
    // 부분 업데이트 (엔티티 구조에 맞게 단순화)
    if (updateDto.tradeExecuted !== undefined) {
      settings.tradeExecuted = updateDto.tradeExecuted.enabled ?? settings.tradeExecuted;
    }
    if (updateDto.priceAlert !== undefined) {
      settings.priceAlert = updateDto.priceAlert.enabled ?? settings.priceAlert;
    }
    if (updateDto.portfolioUpdate !== undefined) {
      settings.portfolioUpdate = updateDto.portfolioUpdate.enabled ?? settings.portfolioUpdate;
    }
    if (updateDto.strategyTriggered !== undefined) {
      settings.strategyTriggered = updateDto.strategyTriggered.enabled ?? settings.strategyTriggered;
    }
    if (updateDto.systemAlert !== undefined) {
      settings.systemAlert = updateDto.systemAlert.enabled ?? settings.systemAlert;
    }

    const updatedSettings = await this.settingsRepository.save(settings);
    this.logger.log(`사용자 ${userId}의 알림 설정 업데이트 완료`);
    
    return updatedSettings;
  }

  /**
   * 특정 알림 타입 설정 업데이트
   */
  async updateNotificationType(
    userId: number,
    notificationType: string,
    enabled: boolean,
    deliveryMethods?: { email?: boolean; push?: boolean; websocket?: boolean },
  ): Promise<UserNotificationSettings> {
    this.logger.debug(`사용자 ${userId}의 ${notificationType} 알림 설정 업데이트`);

    const settings = await this.getUserSettings(userId);
    
    const updateData: any = {};
    updateData[notificationType] = {
      enabled,
      ...deliveryMethods,
    };

    return await this.updateSettings(userId, updateData);
  }

  /**
   * 알림 설정 삭제
   */
  async deleteSettings(userId: number): Promise<void> {
    this.logger.debug(`사용자 ${userId}의 알림 설정 삭제`);

    const settings = await this.settingsRepository.findOne({
      where: { userId },
    });

    if (settings) {
      await this.settingsRepository.remove(settings);
      this.logger.log(`사용자 ${userId}의 알림 설정 삭제 완료`);
    }
  }

  /**
   * 모든 사용자의 알림 설정 조회
   */
  async getAllSettings(): Promise<UserNotificationSettings[]> {
    this.logger.debug('모든 사용자의 알림 설정 조회');

    return await this.settingsRepository.find({
      relations: ['user'],
    });
  }

  /**
   * 특정 알림 타입이 활성화된 사용자들 조회
   */
  async getUsersWithNotificationEnabled(notificationType: string): Promise<User[]> {
    this.logger.debug(`${notificationType} 알림이 활성화된 사용자들 조회`);

    const settings = await this.settingsRepository.find({
      where: { [notificationType]: true },
    });

    // userId로 User 엔티티를 별도 조회
    const userIds = settings.map(setting => setting.userId);
    const users = await this.userRepository.find({
      where: { id: In(userIds) },
    });
    
    return users;
  }

  /**
   * 특정 전송 방법이 활성화된 사용자들 조회
   */
  async getUsersWithDeliveryMethodEnabled(notificationType: string, deliveryMethod: string): Promise<User[]> {
    this.logger.debug(`${notificationType} 알림의 ${deliveryMethod} 전송이 활성화된 사용자들 조회`);

    const settings = await this.settingsRepository.find({
      where: { [notificationType]: true, [`${deliveryMethod}Enabled`]: true },
    });

    // userId로 User 엔티티를 별도 조회
    const userIds = settings.map(setting => setting.userId);
    const users = await this.userRepository.find({
      where: { id: In(userIds) },
    });
    
    return users;
  }

  /**
   * 알림 설정 통계 조회
   */
  async getSettingsStatistics(): Promise<any> {
    this.logger.debug('알림 설정 통계 조회');

    const allSettings = await this.getAllSettings();
    
    const stats = {
      totalUsers: allSettings.length,
      notificationTypes: {
        tradeExecuted: { enabled: 0, disabled: 0 },
        priceAlert: { enabled: 0, disabled: 0 },
        portfolioUpdate: { enabled: 0, disabled: 0 },
        strategyTriggered: { enabled: 0, disabled: 0 },
        systemAlert: { enabled: 0, disabled: 0 },
      },
      deliveryMethods: {
        email: { enabled: 0, disabled: 0 },
        push: { enabled: 0, disabled: 0 },
        websocket: { enabled: 0, disabled: 0 },
      },
    };

    allSettings.forEach(setting => {
      // 알림 타입별 통계
      Object.keys(stats.notificationTypes).forEach(type => {
        const typeSettings = setting[type as keyof UserNotificationSettings] as any;
        if (typeSettings?.enabled) {
          stats.notificationTypes[type as keyof typeof stats.notificationTypes].enabled++;
        } else {
          stats.notificationTypes[type as keyof typeof stats.notificationTypes].disabled++;
        }
      });

      // 전송 방법별 통계
      Object.keys(stats.deliveryMethods).forEach(method => {
        let methodEnabled = false;
        Object.keys(stats.notificationTypes).forEach(type => {
          const typeSettings = setting[type as keyof UserNotificationSettings] as any;
          if (typeSettings?.enabled && typeSettings[method]) {
            methodEnabled = true;
          }
        });

        if (methodEnabled) {
          stats.deliveryMethods[method as keyof typeof stats.deliveryMethods].enabled++;
        } else {
          stats.deliveryMethods[method as keyof typeof stats.deliveryMethods].disabled++;
        }
      });
    });

    return stats;
  }

  /**
   * 알림 설정 검증
   */
  async validateSettings(settings: any): Promise<boolean> {
    this.logger.debug('알림 설정 검증');

    const requiredTypes = ['tradeExecuted', 'priceAlert', 'portfolioUpdate', 'strategyTriggered', 'systemAlert'];
    
    for (const type of requiredTypes) {
      if (!settings[type]) {
        this.logger.error(`필수 알림 타입이 누락되었습니다: ${type}`);
        return false;
      }

      const typeSettings = settings[type];
      if (typeof typeSettings.enabled !== 'boolean') {
        this.logger.error(`알림 타입 ${type}의 enabled 속성이 boolean이 아닙니다`);
        return false;
      }

      if (typeSettings.enabled) {
        const deliveryMethods = ['email', 'push', 'websocket'];
        let hasDeliveryMethod = false;

        for (const method of deliveryMethods) {
          if (typeSettings[method] === true) {
            hasDeliveryMethod = true;
            break;
          }
        }

        if (!hasDeliveryMethod) {
          this.logger.error(`알림 타입 ${type}이 활성화되었지만 전송 방법이 설정되지 않았습니다`);
          return false;
        }
      }
    }

    return true;
  }
} 