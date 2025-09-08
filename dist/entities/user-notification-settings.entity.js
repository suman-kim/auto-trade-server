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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotificationSettings = void 0;
const typeorm_1 = require("typeorm");
let UserNotificationSettings = class UserNotificationSettings {
    id;
    userId;
    tradeExecuted;
    priceAlert;
    portfolioUpdate;
    strategyTriggered;
    systemAlert;
    emailEnabled;
    pushEnabled;
    websocketEnabled;
    emailAddress;
    pushToken;
    createdAt;
    updatedAt;
    isNotificationTypeEnabled(type) {
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
    isDeliveryMethodEnabled(method) {
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
    isAllNotificationsDisabled() {
        return !this.tradeExecuted &&
            !this.priceAlert &&
            !this.portfolioUpdate &&
            !this.strategyTriggered &&
            !this.systemAlert;
    }
    isAllDeliveryMethodsDisabled() {
        return !this.emailEnabled &&
            !this.pushEnabled &&
            !this.websocketEnabled;
    }
};
exports.UserNotificationSettings = UserNotificationSettings;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserNotificationSettings.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'userId',
        comment: '사용자 ID'
    }),
    __metadata("design:type", Number)
], UserNotificationSettings.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'trade_executed',
        default: true,
        comment: '거래 실행 알림 활성화 (true: 활성, false: 비활성)'
    }),
    __metadata("design:type", Boolean)
], UserNotificationSettings.prototype, "tradeExecuted", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'price_alert',
        default: true,
        comment: '가격 알림 활성화 (true: 활성, false: 비활성)'
    }),
    __metadata("design:type", Boolean)
], UserNotificationSettings.prototype, "priceAlert", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'portfolio_update',
        default: true,
        comment: '포트폴리오 업데이트 알림 활성화 (true: 활성, false: 비활성)'
    }),
    __metadata("design:type", Boolean)
], UserNotificationSettings.prototype, "portfolioUpdate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'strategy_triggered',
        default: true,
        comment: '전략 실행 알림 활성화 (true: 활성, false: 비활성)'
    }),
    __metadata("design:type", Boolean)
], UserNotificationSettings.prototype, "strategyTriggered", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'system_alert',
        default: true,
        comment: '시스템 알림 활성화 (true: 활성, false: 비활성)'
    }),
    __metadata("design:type", Boolean)
], UserNotificationSettings.prototype, "systemAlert", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'email_enabled',
        default: true,
        comment: '이메일 알림 활성화 (true: 활성, false: 비활성)'
    }),
    __metadata("design:type", Boolean)
], UserNotificationSettings.prototype, "emailEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'push_enabled',
        default: true,
        comment: '푸시 알림 활성화 (true: 활성, false: 비활성)'
    }),
    __metadata("design:type", Boolean)
], UserNotificationSettings.prototype, "pushEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'websocket_enabled',
        default: true,
        comment: '웹소켓 알림 활성화 (true: 활성, false: 비활성)'
    }),
    __metadata("design:type", Boolean)
], UserNotificationSettings.prototype, "websocketEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'email_address',
        nullable: true,
        comment: '이메일 주소 (알림 수신용)'
    }),
    __metadata("design:type", String)
], UserNotificationSettings.prototype, "emailAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'push_token',
        nullable: true,
        comment: '푸시 알림 토큰'
    }),
    __metadata("design:type", String)
], UserNotificationSettings.prototype, "pushToken", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'createdAt',
        comment: '설정 생성 일시'
    }),
    __metadata("design:type", Date)
], UserNotificationSettings.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updatedAt',
        comment: '설정 수정 일시'
    }),
    __metadata("design:type", Date)
], UserNotificationSettings.prototype, "updatedAt", void 0);
exports.UserNotificationSettings = UserNotificationSettings = __decorate([
    (0, typeorm_1.Entity)('user_notification_settings')
], UserNotificationSettings);
//# sourceMappingURL=user-notification-settings.entity.js.map