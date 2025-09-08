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
exports.Notification = exports.DeliveryMethod = exports.NotificationStatus = exports.NotificationType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var NotificationType;
(function (NotificationType) {
    NotificationType["TRADE_EXECUTED"] = "TRADE_EXECUTED";
    NotificationType["PRICE_ALERT"] = "PRICE_ALERT";
    NotificationType["PORTFOLIO_UPDATE"] = "PORTFOLIO_UPDATE";
    NotificationType["STRATEGY_TRIGGERED"] = "STRATEGY_TRIGGERED";
    NotificationType["SYSTEM_ALERT"] = "SYSTEM_ALERT";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["PENDING"] = "PENDING";
    NotificationStatus["SENT"] = "SENT";
    NotificationStatus["READ"] = "READ";
    NotificationStatus["FAILED"] = "FAILED";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
var DeliveryMethod;
(function (DeliveryMethod) {
    DeliveryMethod["EMAIL"] = "EMAIL";
    DeliveryMethod["PUSH"] = "PUSH";
    DeliveryMethod["WEBSOCKET"] = "WEBSOCKET";
})(DeliveryMethod || (exports.DeliveryMethod = DeliveryMethod = {}));
let Notification = class Notification {
    id;
    userId;
    type;
    title;
    message;
    status;
    priority;
    data;
    isRead;
    createdAt;
    updatedAt;
    user;
    isNotificationRead() {
        return this.isRead;
    }
    markAsRead() {
        this.isRead = true;
    }
    isRecent() {
        const now = new Date();
        const timeDiff = now.getTime() - this.createdAt.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        return hoursDiff <= 24;
    }
    isUrgent() {
        return this.type === NotificationType.SYSTEM_ALERT ||
            this.type === NotificationType.PRICE_ALERT;
    }
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'userId',
        comment: '알림을 받을 사용자 ID'
    }),
    __metadata("design:type", Number)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '알림 타입 (TRADE_EXECUTED, PRICE_ALERT, PORTFOLIO_UPDATE, STRATEGY_TRIGGERED, SYSTEM_ALERT)'
    }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '알림 제목'
    }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        comment: '알림 내용'
    }),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NotificationStatus,
        default: NotificationStatus.PENDING,
        comment: '알림 상태 (PENDING: 대기중, SENT: 발송완료, READ: 읽음, FAILED: 발송실패)'
    }),
    __metadata("design:type", String)
], Notification.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 'medium',
        comment: '알림 우선순위 (low, medium, high)'
    }),
    __metadata("design:type", String)
], Notification.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'json',
        nullable: true,
        comment: '알림 추가 데이터 (JSON 형태)'
    }),
    __metadata("design:type", Object)
], Notification.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_read',
        default: false,
        comment: '알림 읽음 여부 (true: 읽음, false: 안읽음)'
    }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'createdAt',
        comment: '알림 생성 일시'
    }),
    __metadata("design:type", Date)
], Notification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updatedAt',
        comment: '알림 수정 일시'
    }),
    __metadata("design:type", Date)
], Notification.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.notifications),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Notification.prototype, "user", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notifications')
], Notification);
//# sourceMappingURL=notification.entity.js.map