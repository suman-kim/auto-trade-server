"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateService = void 0;
const common_1 = require("@nestjs/common");
let NotificationTemplateService = class NotificationTemplateService {
    generateTradeExecutedTemplate(data) {
        const { symbol, quantity, side, price, totalAmount } = data;
        const action = side === 'BUY' ? '매수' : '매도';
        return {
            title: '거래 실행 완료',
            message: `${symbol} ${quantity}주 ${action} 완료\n가격: ${price?.toLocaleString()}원\n총 거래금액: ${totalAmount?.toLocaleString()}원`,
        };
    }
    generatePriceAlertTemplate(data) {
        const { symbol, price, condition, previousPrice } = data;
        const changeText = previousPrice
            ? `(${price > previousPrice ? '상승' : '하락'} ${Math.abs(price - previousPrice).toLocaleString()}원)`
            : '';
        return {
            title: '가격 알림',
            message: `${symbol} 가격이 ${condition} ${price.toLocaleString()}원에 도달했습니다. ${changeText}`,
        };
    }
    generatePortfolioUpdateTemplate(data) {
        const { totalValue, changePercent, changeAmount } = data;
        const changeType = changePercent > 0 ? '상승' : '하락';
        return {
            title: '포트폴리오 업데이트',
            message: `포트폴리오 가치가 ${changePercent}% ${changeType}했습니다.\n총 가치: ${totalValue?.toLocaleString()}원\n변화금액: ${changeAmount?.toLocaleString()}원`,
        };
    }
    generateStrategyTriggeredTemplate(data) {
        const { strategyName, action, symbol, reason } = data;
        return {
            title: '자동 거래 전략 실행',
            message: `${strategyName} 전략이 실행되어 ${action} 신호를 생성했습니다.\n대상: ${symbol}${reason ? `\n이유: ${reason}` : ''}`,
        };
    }
    generateSystemAlertTemplate(data) {
        const { message, level, module } = data;
        return {
            title: '시스템 알림',
            message: `${module} 모듈에서 ${level} 레벨 알림이 발생했습니다.\n${message}`,
        };
    }
    generateOrderExecutionTemplate(data) {
        const { symbol, side, quantity, price, orderType } = data;
        const action = side === 'BUY' ? '매수' : '매도';
        return {
            title: '주문 체결',
            message: `${symbol} ${action} 주문이 체결되었습니다.\n수량: ${quantity}주\n가격: ${price?.toLocaleString()}원\n주문유형: ${orderType}`,
        };
    }
    generateOrderCancellationTemplate(data) {
        const { symbol, orderId, reason } = data;
        return {
            title: '주문 취소',
            message: `${symbol} 주문이 취소되었습니다.\n주문번호: ${orderId}${reason ? `\n취소사유: ${reason}` : ''}`,
        };
    }
    generateInsufficientBalanceTemplate(data) {
        const { requiredAmount, availableAmount, symbol } = data;
        return {
            title: '잔고 부족',
            message: `${symbol} 거래에 필요한 잔고가 부족합니다.\n필요금액: ${requiredAmount?.toLocaleString()}원\n보유금액: ${availableAmount?.toLocaleString()}원`,
        };
    }
    generateLoginAlertTemplate(data) {
        const { location, device, timestamp } = data;
        return {
            title: '새로운 로그인',
            message: `새로운 기기에서 로그인이 감지되었습니다.\n위치: ${location}\n기기: ${device}\n시간: ${new Date(timestamp).toLocaleString('ko-KR')}`,
        };
    }
    generateSecurityAlertTemplate(data) {
        const { event, description, severity } = data;
        return {
            title: '보안 알림',
            message: `${event} 이벤트가 발생했습니다.\n${description}\n심각도: ${severity}`,
        };
    }
    generatePerformanceAlertTemplate(data) {
        const { metric, value, threshold, component } = data;
        return {
            title: '성능 알림',
            message: `${component}의 ${metric}이 임계값을 초과했습니다.\n현재값: ${value}\n임계값: ${threshold}`,
        };
    }
    generateGeneralNotificationTemplate(data) {
        const { title, message, priority } = data;
        return {
            title: title || '알림',
            message: message || '새로운 알림이 있습니다.',
        };
    }
    addPriorityEmoji(title, priority) {
        const emojiMap = {
            high: '🔴',
            medium: '🟡',
            low: '🟢',
        };
        const emoji = emojiMap[priority] || '📢';
        return `${emoji} ${title}`;
    }
    addTypeEmoji(title, type) {
        const emojiMap = {
            TRADE_EXECUTED: '💰',
            PRICE_ALERT: '📈',
            PORTFOLIO_UPDATE: '📊',
            STRATEGY_TRIGGERED: '🤖',
            SYSTEM_ALERT: '⚠️',
            ORDER_EXECUTION: '✅',
            ORDER_CANCELLATION: '❌',
            INSUFFICIENT_BALANCE: '💸',
            LOGIN_ALERT: '🔐',
            SECURITY_ALERT: '🚨',
            PERFORMANCE_ALERT: '⚡',
        };
        const emoji = emojiMap[type] || '📢';
        return `${emoji} ${title}`;
    }
    formatNotificationMessage(template, type, priority) {
        const formattedTitle = this.addTypeEmoji(this.addPriorityEmoji(template.title, priority), type);
        return {
            title: formattedTitle,
            message: template.message,
        };
    }
};
exports.NotificationTemplateService = NotificationTemplateService;
exports.NotificationTemplateService = NotificationTemplateService = __decorate([
    (0, common_1.Injectable)()
], NotificationTemplateService);
//# sourceMappingURL=notification-template.service.js.map