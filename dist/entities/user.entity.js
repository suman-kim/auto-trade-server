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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const portfolio_entity_1 = require("./portfolio.entity");
const transaction_entity_1 = require("./transaction.entity");
const trading_strategy_entity_1 = require("./trading-strategy.entity");
const notification_entity_1 = require("./notification.entity");
const price_alert_entity_1 = require("./price-alert.entity");
let User = class User {
    id;
    email;
    passwordHash;
    firstName;
    lastName;
    isActive;
    createdAt;
    updatedAt;
    kisAccountNumber;
    kisDemoAccountNumber;
    portfolios;
    transactions;
    tradingStrategies;
    notifications;
    priceAlerts;
    get fullName() {
        return `${this.firstName || ''} ${this.lastName || ''}`.trim();
    }
    isUserActive() {
        return this.isActive;
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true,
        comment: '사용자 이메일 주소 (로그인 ID로 사용)'
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'password_hash',
        comment: '암호화된 비밀번호 해시 (bcrypt 사용)'
    }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'first_name',
        nullable: true,
        comment: '사용자 이름'
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'last_name',
        nullable: true,
        comment: '사용자 성'
    }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_active',
        default: true,
        comment: '사용자 계정 활성화 상태 (true: 활성, false: 비활성)'
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'createdAt',
        comment: '계정 생성 일시'
    }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updatedAt',
        comment: '계정 정보 수정 일시'
    }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'kis_account_number',
        nullable: true,
        comment: '한국투자증권 계좌번호'
    }),
    __metadata("design:type", String)
], User.prototype, "kisAccountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'kis_mock_account_number',
        nullable: true,
        comment: '한국투자증권 모의 계좌번호'
    }),
    __metadata("design:type", String)
], User.prototype, "kisDemoAccountNumber", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => portfolio_entity_1.Portfolio, (portfolio) => portfolio.user),
    __metadata("design:type", Array)
], User.prototype, "portfolios", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transaction_entity_1.Transaction, (transaction) => transaction.user),
    __metadata("design:type", Array)
], User.prototype, "transactions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => trading_strategy_entity_1.TradingStrategy, (strategy) => strategy.user),
    __metadata("design:type", Array)
], User.prototype, "tradingStrategies", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (notification) => notification.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => price_alert_entity_1.PriceAlert, (priceAlert) => priceAlert.user),
    __metadata("design:type", Array)
], User.prototype, "priceAlerts", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map