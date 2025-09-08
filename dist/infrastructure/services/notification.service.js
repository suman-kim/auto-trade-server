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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const events_1 = require("events");
const notification_entity_1 = require("../../entities/notification.entity");
const user_notification_settings_entity_1 = require("../../entities/user-notification-settings.entity");
const user_entity_1 = require("../../entities/user.entity");
const notification_entity_2 = require("../../entities/notification.entity");
const email_service_1 = require("./email.service");
const notification_template_service_1 = require("./notification-template.service");
let NotificationService = NotificationService_1 = class NotificationService extends events_1.EventEmitter {
    notificationRepository;
    userNotificationSettingsRepository;
    userRepository;
    emailService;
    templateService;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(notificationRepository, userNotificationSettingsRepository, userRepository, emailService, templateService) {
        super();
        this.notificationRepository = notificationRepository;
        this.userNotificationSettingsRepository = userNotificationSettingsRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.templateService = templateService;
        this.setupEventListeners();
    }
    setupEventListeners() {
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
    async createNotification(createNotificationDto) {
        try {
            const notification = this.notificationRepository.create({
                ...createNotificationDto,
                status: notification_entity_2.NotificationStatus.PENDING,
                createdAt: new Date(),
            });
            const savedNotification = await this.notificationRepository.save(notification);
            this.logger.log(`알림 생성 완료: ${savedNotification.id} - ${savedNotification.type}`);
            this.emit('notificationCreated', savedNotification);
            return savedNotification;
        }
        catch (error) {
            this.logger.error(`알림 생성 실패: ${error.message}`, error.stack);
            throw error;
        }
    }
    async sendNotificationToUser(userId, sendNotificationDto) {
        try {
            const userSettings = await this.getUserNotificationSettings(userId);
            if (!userSettings) {
                this.logger.warn(`사용자 알림 설정을 찾을 수 없음: ${userId}`);
                return;
            }
            if (!this.isNotificationTypeEnabled(userSettings, sendNotificationDto.type)) {
                this.logger.debug(`알림 타입이 비활성화됨: ${userId} - ${sendNotificationDto.type}`);
                return;
            }
            const notification = await this.createNotification({
                userId,
                type: sendNotificationDto.type,
                title: sendNotificationDto.title,
                message: sendNotificationDto.message,
                data: sendNotificationDto.data,
                priority: sendNotificationDto.priority || 'medium',
            });
            await this.sendNotificationByMethods(notification, userSettings);
        }
        catch (error) {
            this.logger.error(`사용자 알림 전송 실패: ${userId} - ${error.message}`, error.stack);
            throw error;
        }
    }
    async sendNotificationToUsers(userIds, sendNotificationDto) {
        const promises = userIds.map(userId => this.sendNotificationToUser(userId, sendNotificationDto));
        try {
            await Promise.allSettled(promises);
            this.logger.log(`${userIds.length}명의 사용자에게 알림 전송 완료`);
        }
        catch (error) {
            this.logger.error(`다중 사용자 알림 전송 실패: ${error.message}`, error.stack);
            throw error;
        }
    }
    async updateNotificationStatus(notificationId, status) {
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
        }
        catch (error) {
            this.logger.error(`알림 상태 업데이트 실패: ${notificationId} - ${error.message}`, error.stack);
            throw error;
        }
    }
    async getUserNotifications(userId, limit = 50, offset = 0) {
        try {
            const notifications = await this.notificationRepository.find({
                where: { userId },
                order: { createdAt: 'DESC' },
                take: limit,
                skip: offset,
            });
            return notifications;
        }
        catch (error) {
            this.logger.error(`사용자 알림 조회 실패: ${userId} - ${error.message}`, error.stack);
            throw error;
        }
    }
    async getUnreadNotificationCount(userId) {
        try {
            const count = await this.notificationRepository.count({
                where: {
                    userId,
                    status: notification_entity_2.NotificationStatus.PENDING
                },
            });
            return count;
        }
        catch (error) {
            this.logger.error(`읽지 않은 알림 개수 조회 실패: ${userId} - ${error.message}`, error.stack);
            throw error;
        }
    }
    async markNotificationAsRead(notificationId) {
        try {
            await this.updateNotificationStatus(notificationId, notification_entity_2.NotificationStatus.READ);
        }
        catch (error) {
            this.logger.error(`알림 읽음 처리 실패: ${notificationId} - ${error.message}`, error.stack);
            throw error;
        }
    }
    async getUserNotificationSettings(userId) {
        try {
            return await this.userNotificationSettingsRepository.findOne({
                where: { userId },
            });
        }
        catch (error) {
            this.logger.error(`사용자 알림 설정 조회 실패: ${userId} - ${error.message}`, error.stack);
            return null;
        }
    }
    isNotificationTypeEnabled(settings, type) {
        switch (type) {
            case notification_entity_2.NotificationType.TRADE_EXECUTED:
                return settings.tradeExecuted;
            case notification_entity_2.NotificationType.PRICE_ALERT:
                return settings.priceAlert;
            case notification_entity_2.NotificationType.PORTFOLIO_UPDATE:
                return settings.portfolioUpdate;
            case notification_entity_2.NotificationType.STRATEGY_TRIGGERED:
                return settings.strategyTriggered;
            case notification_entity_2.NotificationType.SYSTEM_ALERT:
                return settings.systemAlert;
            default:
                return false;
        }
    }
    async sendNotificationByMethods(notification, settings) {
        const maxRetries = 3;
        const retryDelay = 1000;
        const sendWithRetry = async (sendMethod, methodName) => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    await sendMethod();
                    this.logger.log(`${methodName} 전송 성공: ${notification.id} (시도 ${attempt})`);
                    return;
                }
                catch (error) {
                    this.logger.warn(`${methodName} 전송 실패: ${notification.id} (시도 ${attempt}/${maxRetries}) - ${error.message}`);
                    if (attempt === maxRetries) {
                        throw error;
                    }
                    await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
                }
            }
        };
        const promises = [];
        if (settings.emailEnabled) {
            promises.push(sendWithRetry(() => this.sendEmailNotification(notification), '이메일'));
        }
        if (settings.pushEnabled) {
            promises.push(sendWithRetry(() => this.sendPushNotification(notification), '푸시'));
        }
        if (settings.websocketEnabled) {
            promises.push(sendWithRetry(() => this.sendWebSocketNotification(notification), 'WebSocket'));
        }
        try {
            await Promise.allSettled(promises);
            await this.updateNotificationStatus(notification.id, notification_entity_2.NotificationStatus.SENT);
            this.logger.log(`알림 전송 완료: ${notification.id}`);
        }
        catch (error) {
            this.logger.error(`알림 전송 실패: ${notification.id} - ${error.message}`, error.stack);
            await this.updateNotificationStatus(notification.id, notification_entity_2.NotificationStatus.FAILED);
        }
    }
    async sendEmailNotification(notification) {
        try {
            const user = await this.userRepository.findOne({ where: { id: notification.userId } });
            if (!user || !user.email) {
                this.logger.warn(`사용자 이메일을 찾을 수 없음: ${notification.userId}`);
                return;
            }
            await this.emailService.sendNotificationEmail(user.email, notification, {
                name: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
                email: user.email,
            });
            this.logger.log(`이메일 알림 전송 완료: ${notification.id} - ${user.email}`);
        }
        catch (error) {
            this.logger.error(`이메일 알림 전송 실패: ${notification.id} - ${error.message}`, error.stack);
            throw error;
        }
    }
    async sendPushNotification(notification) {
        try {
            this.logger.log(`푸시 알림 전송: ${notification.id} - ${notification.title}`);
            console.log(`[PUSH] To: User ${notification.userId}`);
            console.log(`[PUSH] Title: ${notification.title}`);
            console.log(`[PUSH] Body: ${notification.message}`);
        }
        catch (error) {
            this.logger.error(`푸시 알림 전송 실패: ${notification.id} - ${error.message}`, error.stack);
            throw error;
        }
    }
    async sendWebSocketNotification(notification) {
        try {
            this.logger.log(`WebSocket 알림 전송: ${notification.id} - 사용자 ${notification.userId}`);
        }
        catch (error) {
            this.logger.error(`WebSocket 알림 전송 실패: ${notification.id} - ${error.message}`, error.stack);
            throw error;
        }
    }
    async handleTradeExecuted(data) {
        const { userId, tradeData } = data;
        const template = this.templateService.generateTradeExecutedTemplate(tradeData);
        const formatted = this.templateService.formatNotificationMessage(template, 'TRADE_EXECUTED', 'high');
        await this.sendNotificationToUser(userId, {
            userIds: [userId],
            type: notification_entity_2.NotificationType.TRADE_EXECUTED,
            title: formatted.title,
            message: formatted.message,
            data: tradeData,
            priority: 'high',
        });
    }
    async handlePriceAlert(data) {
        const { userId, alertData } = data;
        const template = this.templateService.generatePriceAlertTemplate(alertData);
        const formatted = this.templateService.formatNotificationMessage(template, 'PRICE_ALERT', 'medium');
        await this.sendNotificationToUser(userId, {
            userIds: [userId],
            type: notification_entity_2.NotificationType.PRICE_ALERT,
            title: formatted.title,
            message: formatted.message,
            data: alertData,
            priority: 'medium',
        });
    }
    async handlePortfolioUpdate(data) {
        const { userId, portfolioData } = data;
        const template = this.templateService.generatePortfolioUpdateTemplate(portfolioData);
        const formatted = this.templateService.formatNotificationMessage(template, 'PORTFOLIO_UPDATE', 'medium');
        await this.sendNotificationToUser(userId, {
            userIds: [userId],
            type: notification_entity_2.NotificationType.PORTFOLIO_UPDATE,
            title: formatted.title,
            message: formatted.message,
            data: portfolioData,
            priority: 'medium',
        });
    }
    async handleStrategyTriggered(data) {
        const { userId, strategyData } = data;
        const template = this.templateService.generateStrategyTriggeredTemplate(strategyData);
        const formatted = this.templateService.formatNotificationMessage(template, 'STRATEGY_TRIGGERED', 'high');
        await this.sendNotificationToUser(userId, {
            userIds: [userId],
            type: notification_entity_2.NotificationType.STRATEGY_TRIGGERED,
            title: formatted.title,
            message: formatted.message,
            data: strategyData,
            priority: 'high',
        });
    }
    async handleSystemAlert(data) {
        const { userIds, alertData } = data;
        const template = this.templateService.generateSystemAlertTemplate(alertData);
        const formatted = this.templateService.formatNotificationMessage(template, 'SYSTEM_ALERT', alertData.priority || 'medium');
        await this.sendNotificationToUsers(userIds, {
            userIds: userIds,
            type: notification_entity_2.NotificationType.SYSTEM_ALERT,
            title: formatted.title,
            message: formatted.message,
            data: alertData,
            priority: alertData.priority || 'medium',
        });
    }
    async getNotificationStatistics(userId) {
        try {
            const [total, pending, sent, failed] = await Promise.all([
                this.notificationRepository.count({ where: { userId } }),
                this.notificationRepository.count({ where: { userId, status: notification_entity_2.NotificationStatus.PENDING } }),
                this.notificationRepository.count({ where: { userId, status: notification_entity_2.NotificationStatus.SENT } }),
                this.notificationRepository.count({ where: { userId, status: notification_entity_2.NotificationStatus.FAILED } }),
            ]);
            return {
                total,
                pending,
                sent,
                failed,
                successRate: total > 0 ? (sent / total) * 100 : 0,
            };
        }
        catch (error) {
            this.logger.error(`알림 통계 조회 실패: ${userId} - ${error.message}`, error.stack);
            throw error;
        }
    }
    async cleanupOldNotifications(daysToKeep = 30) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
            const result = await this.notificationRepository.delete({
                createdAt: { $lt: cutoffDate },
                status: notification_entity_2.NotificationStatus.READ,
            });
            this.logger.log(`${result.affected}개의 오래된 알림 정리 완료`);
            return result.affected || 0;
        }
        catch (error) {
            this.logger.error(`오래된 알림 정리 실패: ${error.message}`, error.stack);
            throw error;
        }
    }
    async retryFailedNotifications() {
        try {
            const failedNotifications = await this.notificationRepository.find({
                where: { status: notification_entity_2.NotificationStatus.FAILED },
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
                }
                catch (error) {
                    this.logger.error(`알림 재전송 실패: ${notification.id} - ${error.message}`);
                }
            }
            this.logger.log(`${retryCount}개의 실패한 알림 재전송 완료`);
            return retryCount;
        }
        catch (error) {
            this.logger.error(`실패한 알림 재전송 실패: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getNotificationDashboardData() {
        try {
            const [totalNotifications, pendingNotifications, sentNotifications, failedNotifications, todayNotifications, weeklyNotifications,] = await Promise.all([
                this.notificationRepository.count(),
                this.notificationRepository.count({ where: { status: notification_entity_2.NotificationStatus.PENDING } }),
                this.notificationRepository.count({ where: { status: notification_entity_2.NotificationStatus.SENT } }),
                this.notificationRepository.count({ where: { status: notification_entity_2.NotificationStatus.FAILED } }),
                this.notificationRepository.count({
                    where: {
                        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                    },
                }),
                this.notificationRepository.count({
                    where: {
                        createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) },
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
        }
        catch (error) {
            this.logger.error(`알림 대시보드 데이터 조회 실패: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_notification_settings_entity_1.UserNotificationSettings)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService,
        notification_template_service_1.NotificationTemplateService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map