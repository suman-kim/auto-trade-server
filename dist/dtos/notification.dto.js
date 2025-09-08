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
exports.FilterNotificationsDto = exports.SendNotificationDto = exports.NotificationSettingsDto = exports.UpdateNotificationSettingsDto = exports.CreateNotificationSettingsDto = exports.NotificationStatisticsDto = exports.NotificationStatsDto = exports.NotificationFilterDto = exports.UpdateNotificationDto = exports.NotificationResponseDto = exports.CreateNotificationDto = void 0;
const class_validator_1 = require("class-validator");
const notification_entity_1 = require("../entities/notification.entity");
class CreateNotificationDto {
    userId;
    type;
    title;
    message;
    status;
    priority;
    data;
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateNotificationDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationStatus),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateNotificationDto.prototype, "data", void 0);
class NotificationResponseDto {
    id;
    userId;
    type;
    title;
    message;
    status;
    priority;
    isRead;
    createdAt;
    updatedAt;
    isUrgent;
    isRecent;
}
exports.NotificationResponseDto = NotificationResponseDto;
class UpdateNotificationDto {
    isRead;
    status;
}
exports.UpdateNotificationDto = UpdateNotificationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNotificationDto.prototype, "isRead", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationStatus),
    __metadata("design:type", String)
], UpdateNotificationDto.prototype, "status", void 0);
class NotificationFilterDto {
    type;
    isRead;
    page = 1;
    limit = 20;
}
exports.NotificationFilterDto = NotificationFilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationType),
    __metadata("design:type", String)
], NotificationFilterDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationFilterDto.prototype, "isRead", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], NotificationFilterDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], NotificationFilterDto.prototype, "limit", void 0);
class NotificationStatsDto {
    totalCount;
    unreadCount;
    urgentCount;
    recentCount;
    typeStats;
}
exports.NotificationStatsDto = NotificationStatsDto;
class NotificationStatisticsDto extends NotificationStatsDto {
}
exports.NotificationStatisticsDto = NotificationStatisticsDto;
class CreateNotificationSettingsDto {
    tradeExecuted;
    priceAlert;
    portfolioUpdate;
    strategyTriggered;
    systemAlert;
}
exports.CreateNotificationSettingsDto = CreateNotificationSettingsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateNotificationSettingsDto.prototype, "tradeExecuted", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateNotificationSettingsDto.prototype, "priceAlert", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateNotificationSettingsDto.prototype, "portfolioUpdate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateNotificationSettingsDto.prototype, "strategyTriggered", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateNotificationSettingsDto.prototype, "systemAlert", void 0);
class UpdateNotificationSettingsDto {
    tradeExecuted;
    priceAlert;
    portfolioUpdate;
    strategyTriggered;
    systemAlert;
}
exports.UpdateNotificationSettingsDto = UpdateNotificationSettingsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateNotificationSettingsDto.prototype, "tradeExecuted", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateNotificationSettingsDto.prototype, "priceAlert", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateNotificationSettingsDto.prototype, "portfolioUpdate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateNotificationSettingsDto.prototype, "strategyTriggered", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateNotificationSettingsDto.prototype, "systemAlert", void 0);
class NotificationSettingsDto {
    tradeExecuted = true;
    priceAlert = true;
    portfolioUpdate = true;
    strategyTriggered = true;
    systemAlert = true;
    emailEnabled = true;
    pushEnabled = true;
    websocketEnabled = true;
}
exports.NotificationSettingsDto = NotificationSettingsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationSettingsDto.prototype, "tradeExecuted", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationSettingsDto.prototype, "priceAlert", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationSettingsDto.prototype, "portfolioUpdate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationSettingsDto.prototype, "strategyTriggered", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationSettingsDto.prototype, "systemAlert", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationSettingsDto.prototype, "emailEnabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationSettingsDto.prototype, "pushEnabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationSettingsDto.prototype, "websocketEnabled", void 0);
class SendNotificationDto {
    userIds;
    type;
    title;
    message;
    data;
    priority;
    sendImmediately = true;
}
exports.SendNotificationDto = SendNotificationDto;
__decorate([
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], SendNotificationDto.prototype, "userIds", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SendNotificationDto.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SendNotificationDto.prototype, "sendImmediately", void 0);
class FilterNotificationsDto {
    type;
    isRead;
    status;
    page = 1;
    limit = 20;
}
exports.FilterNotificationsDto = FilterNotificationsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationType),
    __metadata("design:type", String)
], FilterNotificationsDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FilterNotificationsDto.prototype, "isRead", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationStatus),
    __metadata("design:type", String)
], FilterNotificationsDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FilterNotificationsDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FilterNotificationsDto.prototype, "limit", void 0);
//# sourceMappingURL=notification.dto.js.map