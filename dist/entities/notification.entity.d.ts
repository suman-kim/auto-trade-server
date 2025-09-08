import { User } from './user.entity';
export declare enum NotificationType {
    TRADE_EXECUTED = "TRADE_EXECUTED",
    PRICE_ALERT = "PRICE_ALERT",
    PORTFOLIO_UPDATE = "PORTFOLIO_UPDATE",
    STRATEGY_TRIGGERED = "STRATEGY_TRIGGERED",
    SYSTEM_ALERT = "SYSTEM_ALERT"
}
export declare enum NotificationStatus {
    PENDING = "PENDING",
    SENT = "SENT",
    READ = "READ",
    FAILED = "FAILED"
}
export declare enum DeliveryMethod {
    EMAIL = "EMAIL",
    PUSH = "PUSH",
    WEBSOCKET = "WEBSOCKET"
}
export declare class Notification {
    id: number;
    userId: number;
    type: string;
    title: string;
    message: string;
    status: NotificationStatus;
    priority: string;
    data: any;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    isNotificationRead(): boolean;
    markAsRead(): void;
    isRecent(): boolean;
    isUrgent(): boolean;
}
