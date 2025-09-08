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
var ErrorTrackingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorTrackingService = void 0;
const common_1 = require("@nestjs/common");
const events_1 = require("events");
const schedule_1 = require("@nestjs/schedule");
let ErrorTrackingService = ErrorTrackingService_1 = class ErrorTrackingService extends events_1.EventEmitter {
    logger = new common_1.Logger(ErrorTrackingService_1.name);
    errors = {
        critical: [],
        high: [],
        medium: [],
        low: [],
    };
    statistics = {
        totalErrors: 0,
        errorsByType: new Map(),
        errorsByModule: new Map(),
        errorsByHour: new Map(),
    };
    notificationSettings = {
        critical: true,
        high: true,
        medium: false,
        low: false,
        emailNotifications: true,
        slackNotifications: false,
    };
    constructor() {
        super();
        this.initializeErrorTracking();
    }
    recordError(error, level = 'medium', module = 'unknown', context) {
        const errorInfo = {
            id: this.generateErrorId(),
            timestamp: new Date(),
            level,
            type: error instanceof Error ? error.constructor.name : 'UnknownError',
            message: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            module,
            context,
        };
        this.errors[level].push(errorInfo);
        if (this.errors[level].length > 1000) {
            this.errors[level].shift();
        }
        this.updateStatistics(errorInfo);
        this.logError(errorInfo);
        if (this.shouldSendNotification(level)) {
            this.sendNotification(errorInfo);
        }
        this.emit('errorRecorded', errorInfo);
        this.emit(`error:${level}`, errorInfo);
    }
    generateErrorId() {
        return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    updateStatistics(errorInfo) {
        this.statistics.totalErrors++;
        const typeCount = this.statistics.errorsByType.get(errorInfo.type) || 0;
        this.statistics.errorsByType.set(errorInfo.type, typeCount + 1);
        const moduleCount = this.statistics.errorsByModule.get(errorInfo.module) || 0;
        this.statistics.errorsByModule.set(errorInfo.module, moduleCount + 1);
        const hour = errorInfo.timestamp.getHours();
        const hourCount = this.statistics.errorsByHour.get(hour) || 0;
        this.statistics.errorsByHour.set(hour, hourCount + 1);
    }
    logError(errorInfo) {
        const logMessage = `[${errorInfo.level.toUpperCase()}] ${errorInfo.module}: ${errorInfo.message}`;
        switch (errorInfo.level) {
            case 'critical':
                this.logger.error(logMessage, errorInfo.stack);
                break;
            case 'high':
                this.logger.error(logMessage);
                break;
            case 'medium':
                this.logger.warn(logMessage);
                break;
            case 'low':
                this.logger.debug(logMessage);
                break;
        }
    }
    shouldSendNotification(level) {
        return this.notificationSettings[level] || false;
    }
    async sendNotification(errorInfo) {
        const notification = {
            level: errorInfo.level,
            module: errorInfo.module,
            message: errorInfo.message,
            timestamp: errorInfo.timestamp,
            id: errorInfo.id,
        };
        if (this.notificationSettings.emailNotifications) {
            await this.sendEmailNotification(notification);
        }
        if (this.notificationSettings.slackNotifications) {
            await this.sendSlackNotification(notification);
        }
        this.emit('notification', notification);
    }
    async sendEmailNotification(notification) {
        this.logger.log(`이메일 알림 전송: ${notification.level} - ${notification.message}`);
    }
    async sendSlackNotification(notification) {
        this.logger.log(`Slack 알림 전송: ${notification.level} - ${notification.message}`);
    }
    getErrorStatistics() {
        return {
            total: this.statistics.totalErrors,
            byLevel: {
                critical: this.errors.critical.length,
                high: this.errors.high.length,
                medium: this.errors.medium.length,
                low: this.errors.low.length,
            },
            byType: Object.fromEntries(this.statistics.errorsByType),
            byModule: Object.fromEntries(this.statistics.errorsByModule),
            byHour: Object.fromEntries(this.statistics.errorsByHour),
        };
    }
    getRecentErrors(level, limit = 50) {
        if (level) {
            return this.errors[level].slice(-limit);
        }
        const allErrors = [
            ...this.errors.critical,
            ...this.errors.high,
            ...this.errors.medium,
            ...this.errors.low,
        ];
        return allErrors
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);
    }
    searchErrors(query, level) {
        const searchErrors = level ? this.errors[level] : [
            ...this.errors.critical,
            ...this.errors.high,
            ...this.errors.medium,
            ...this.errors.low,
        ];
        return searchErrors.filter(error => error.message.toLowerCase().includes(query.toLowerCase()) ||
            error.module.toLowerCase().includes(query.toLowerCase()) ||
            error.type.toLowerCase().includes(query.toLowerCase()));
    }
    generateErrorReport() {
        const stats = this.getErrorStatistics();
        const recentErrors = this.getRecentErrors(undefined, 10);
        return {
            timestamp: new Date().toISOString(),
            summary: {
                totalErrors: stats.total,
                criticalErrors: stats.byLevel.critical,
                highErrors: stats.byLevel.high,
                errorRate: this.calculateErrorRate(),
            },
            topErrorTypes: this.getTopErrorTypes(5),
            topErrorModules: this.getTopErrorModules(5),
            recentErrors: recentErrors.map(error => ({
                id: error.id,
                level: error.level,
                module: error.module,
                message: error.message,
                timestamp: error.timestamp,
            })),
            recommendations: this.generateRecommendations(stats),
        };
    }
    calculateErrorRate() {
        return this.statistics.totalErrors > 0 ? (this.statistics.totalErrors / 1000) * 100 : 0;
    }
    getTopErrorTypes(limit) {
        return Array.from(this.statistics.errorsByType.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([type, count]) => ({ type, count }));
    }
    getTopErrorModules(limit) {
        return Array.from(this.statistics.errorsByModule.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([module, count]) => ({ module, count }));
    }
    generateRecommendations(stats) {
        const recommendations = [];
        if (stats.byLevel.critical > 10) {
            recommendations.push('치명적 에러가 많습니다. 즉시 조치가 필요합니다.');
        }
        if (stats.byLevel.high > 50) {
            recommendations.push('높은 수준의 에러가 많습니다. 에러 처리 로직을 검토하세요.');
        }
        if (stats.total > 1000) {
            recommendations.push('전체 에러 수가 많습니다. 시스템 안정성을 점검하세요.');
        }
        return recommendations;
    }
    updateNotificationSettings(settings) {
        this.notificationSettings = { ...this.notificationSettings, ...settings };
        this.logger.log('알림 설정 업데이트됨');
    }
    clearErrors() {
        this.errors = {
            critical: [],
            high: [],
            medium: [],
            low: [],
        };
        this.statistics = {
            totalErrors: 0,
            errorsByType: new Map(),
            errorsByModule: new Map(),
            errorsByHour: new Map(),
        };
        this.logger.log('에러 데이터 초기화 완료');
    }
    initializeErrorTracking() {
        this.logger.log('에러 추적 서비스 시작');
        this.on('errorRecorded', (errorInfo) => {
            this.logger.debug(`에러 기록됨: ${errorInfo.level} - ${errorInfo.message}`);
        });
        this.on('notification', (notification) => {
            this.logger.log(`알림 전송됨: ${notification.level} - ${notification.message}`);
        });
    }
    generateHourlyReport() {
        const report = this.generateErrorReport();
        this.logger.log('시간별 에러 리포트 생성 완료', report.summary);
    }
};
exports.ErrorTrackingService = ErrorTrackingService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErrorTrackingService.prototype, "generateHourlyReport", null);
exports.ErrorTrackingService = ErrorTrackingService = ErrorTrackingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ErrorTrackingService);
//# sourceMappingURL=error-tracking.service.js.map