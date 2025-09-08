import { NotificationType, NotificationStatus } from '../entities/notification.entity';
export declare class CreateNotificationDto {
    userId: number;
    type: NotificationType;
    title: string;
    message: string;
    status?: NotificationStatus;
    priority?: string;
    data?: any;
}
export declare class NotificationResponseDto {
    id: number;
    userId: number;
    type: NotificationType;
    title: string;
    message: string;
    status: NotificationStatus;
    priority: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
    isUrgent: boolean;
    isRecent: boolean;
}
export declare class UpdateNotificationDto {
    isRead?: boolean;
    status?: NotificationStatus;
}
export declare class NotificationFilterDto {
    type?: NotificationType;
    isRead?: boolean;
    page?: number;
    limit?: number;
}
export declare class NotificationStatsDto {
    totalCount: number;
    unreadCount: number;
    urgentCount: number;
    recentCount: number;
    typeStats: Record<NotificationType, number>;
}
export declare class NotificationStatisticsDto extends NotificationStatsDto {
}
export declare class CreateNotificationSettingsDto {
    tradeExecuted?: {
        enabled: boolean;
        email: boolean;
        push: boolean;
        websocket: boolean;
    };
    priceAlert?: {
        enabled: boolean;
        email: boolean;
        push: boolean;
        websocket: boolean;
    };
    portfolioUpdate?: {
        enabled: boolean;
        email: boolean;
        push: boolean;
        websocket: boolean;
    };
    strategyTriggered?: {
        enabled: boolean;
        email: boolean;
        push: boolean;
        websocket: boolean;
    };
    systemAlert?: {
        enabled: boolean;
        email: boolean;
        push: boolean;
        websocket: boolean;
    };
}
export declare class UpdateNotificationSettingsDto {
    tradeExecuted?: {
        enabled?: boolean;
        email?: boolean;
        push?: boolean;
        websocket?: boolean;
    };
    priceAlert?: {
        enabled?: boolean;
        email?: boolean;
        push?: boolean;
        websocket?: boolean;
    };
    portfolioUpdate?: {
        enabled?: boolean;
        email?: boolean;
        push?: boolean;
        websocket?: boolean;
    };
    strategyTriggered?: {
        enabled?: boolean;
        email?: boolean;
        push?: boolean;
        websocket?: boolean;
    };
    systemAlert?: {
        enabled?: boolean;
        email?: boolean;
        push?: boolean;
        websocket?: boolean;
    };
}
export declare class NotificationSettingsDto {
    tradeExecuted?: boolean;
    priceAlert?: boolean;
    portfolioUpdate?: boolean;
    strategyTriggered?: boolean;
    systemAlert?: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    websocketEnabled?: boolean;
}
export declare class SendNotificationDto {
    userIds: number[];
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
    priority?: string;
    sendImmediately?: boolean;
}
export declare class FilterNotificationsDto {
    type?: NotificationType;
    isRead?: boolean;
    status?: NotificationStatus;
    page?: number;
    limit?: number;
}
