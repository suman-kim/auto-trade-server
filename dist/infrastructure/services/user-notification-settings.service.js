"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UserNotificationSettingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotificationSettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_notification_settings_entity_1 = require("../../entities/user-notification-settings.entity");
const user_entity_1 = require("../../entities/user.entity");
let UserNotificationSettingsService = UserNotificationSettingsService_1 = class UserNotificationSettingsService {
    settingsRepository;
    userRepository;
    logger = new common_1.Logger(UserNotificationSettingsService_1.name);
    constructor(settingsRepository, userRepository) {
        this.settingsRepository = settingsRepository;
        this.userRepository = userRepository;
    }
    async getUserSettings(userId) {
        this.logger.debug(`사용자 ${userId}의 알림 설정 조회`);
        let settings = await this.settingsRepository.findOne({
            where: { userId },
        });
        if (!settings) {
            settings = await this.createDefaultSettings(userId);
        }
        return settings;
    }
    async createDefaultSettings(userId) {
        this.logger.debug(`사용자 ${userId}의 기본 알림 설정 생성`);
        const defaultSettings = new user_notification_settings_entity_1.UserNotificationSettings();
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
    async createSettings(userId, createDto) {
        this.logger.debug(`사용자 ${userId}의 알림 설정 생성`);
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`사용자를 찾을 수 없습니다: ${userId}`);
        }
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
    async updateSettings(userId, updateDto) {
        this.logger.debug(`사용자 ${userId}의 알림 설정 업데이트`);
        const settings = await this.getUserSettings(userId);
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
    async updateNotificationType(userId, notificationType, enabled, deliveryMethods) {
        this.logger.debug(`사용자 ${userId}의 ${notificationType} 알림 설정 업데이트`);
        const settings = await this.getUserSettings(userId);
        const updateData = {};
        updateData[notificationType] = {
            enabled,
            ...deliveryMethods,
        };
        return await this.updateSettings(userId, updateData);
    }
    async deleteSettings(userId) {
        this.logger.debug(`사용자 ${userId}의 알림 설정 삭제`);
        const settings = await this.settingsRepository.findOne({
            where: { userId },
        });
        if (settings) {
            await this.settingsRepository.remove(settings);
            this.logger.log(`사용자 ${userId}의 알림 설정 삭제 완료`);
        }
    }
    async getAllSettings() {
        this.logger.debug('모든 사용자의 알림 설정 조회');
        return await this.settingsRepository.find({
            relations: ['user'],
        });
    }
    async getUsersWithNotificationEnabled(notificationType) {
        this.logger.debug(`${notificationType} 알림이 활성화된 사용자들 조회`);
        const settings = await this.settingsRepository.find({
            where: { [notificationType]: true },
        });
        const userIds = settings.map(setting => setting.userId);
        const users = await this.userRepository.find({
            where: { id: (0, typeorm_2.In)(userIds) },
        });
        return users;
    }
    async getUsersWithDeliveryMethodEnabled(notificationType, deliveryMethod) {
        this.logger.debug(`${notificationType} 알림의 ${deliveryMethod} 전송이 활성화된 사용자들 조회`);
        const settings = await this.settingsRepository.find({
            where: { [notificationType]: true, [`${deliveryMethod}Enabled`]: true },
        });
        const userIds = settings.map(setting => setting.userId);
        const users = await this.userRepository.find({
            where: { id: (0, typeorm_2.In)(userIds) },
        });
        return users;
    }
    async getSettingsStatistics() {
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
            Object.keys(stats.notificationTypes).forEach(type => {
                const typeSettings = setting[type];
                if (typeSettings?.enabled) {
                    stats.notificationTypes[type].enabled++;
                }
                else {
                    stats.notificationTypes[type].disabled++;
                }
            });
            Object.keys(stats.deliveryMethods).forEach(method => {
                let methodEnabled = false;
                Object.keys(stats.notificationTypes).forEach(type => {
                    const typeSettings = setting[type];
                    if (typeSettings?.enabled && typeSettings[method]) {
                        methodEnabled = true;
                    }
                });
                if (methodEnabled) {
                    stats.deliveryMethods[method].enabled++;
                }
                else {
                    stats.deliveryMethods[method].disabled++;
                }
            });
        });
        return stats;
    }
    async validateSettings(settings) {
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
};
exports.UserNotificationSettingsService = UserNotificationSettingsService;
exports.UserNotificationSettingsService = UserNotificationSettingsService = UserNotificationSettingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_notification_settings_entity_1.UserNotificationSettings)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserNotificationSettingsService);
//# sourceMappingURL=user-notification-settings.service.js.map