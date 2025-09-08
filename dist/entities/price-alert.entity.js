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
exports.PriceAlert = exports.PriceAlertType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const stock_entity_1 = require("./stock.entity");
var PriceAlertType;
(function (PriceAlertType) {
    PriceAlertType["ABOVE"] = "ABOVE";
    PriceAlertType["BELOW"] = "BELOW";
})(PriceAlertType || (exports.PriceAlertType = PriceAlertType = {}));
let PriceAlert = class PriceAlert {
    id;
    userId;
    stockId;
    alertType;
    targetPrice;
    isActive;
    createdAt;
    user;
    stock;
    isAlertActive() {
        return this.isActive;
    }
    isTriggered(currentPrice) {
        if (!this.isActive) {
            return false;
        }
        if (this.alertType === PriceAlertType.ABOVE) {
            return currentPrice >= this.targetPrice;
        }
        else {
            return currentPrice <= this.targetPrice;
        }
    }
    isAboveAlert() {
        return this.alertType === PriceAlertType.ABOVE;
    }
    isBelowAlert() {
        return this.alertType === PriceAlertType.BELOW;
    }
    deactivate() {
        this.isActive = false;
    }
    activate() {
        this.isActive = true;
    }
};
exports.PriceAlert = PriceAlert;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PriceAlert.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'userId',
        comment: '알림을 설정한 사용자 ID'
    }),
    __metadata("design:type", Number)
], PriceAlert.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'stockId',
        comment: '알림을 설정한 주식 ID'
    }),
    __metadata("design:type", Number)
], PriceAlert.prototype, "stockId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'alert_type',
        comment: '알림 타입 (ABOVE: 이상, BELOW: 이하)'
    }),
    __metadata("design:type", String)
], PriceAlert.prototype, "alertType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'target_price',
        type: 'decimal',
        precision: 10,
        scale: 2,
        comment: '목표 가격 (알림이 발생할 가격)'
    }),
    __metadata("design:type", Number)
], PriceAlert.prototype, "targetPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_active',
        default: true,
        comment: '알림 활성화 상태 (true: 활성, false: 비활성)'
    }),
    __metadata("design:type", Boolean)
], PriceAlert.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'createdAt',
        comment: '알림 설정 생성 일시'
    }),
    __metadata("design:type", Date)
], PriceAlert.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.priceAlerts),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], PriceAlert.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_entity_1.Stock),
    (0, typeorm_1.JoinColumn)({ name: 'stockId' }),
    __metadata("design:type", stock_entity_1.Stock)
], PriceAlert.prototype, "stock", void 0);
exports.PriceAlert = PriceAlert = __decorate([
    (0, typeorm_1.Entity)('price_alerts')
], PriceAlert);
//# sourceMappingURL=price-alert.entity.js.map