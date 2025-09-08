export declare class UserNotificationSettings {
    id: number;
    userId: number;
    tradeExecuted: boolean;
    priceAlert: boolean;
    portfolioUpdate: boolean;
    strategyTriggered: boolean;
    systemAlert: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    websocketEnabled: boolean;
    emailAddress: string;
    pushToken: string;
    createdAt: Date;
    updatedAt: Date;
    isNotificationTypeEnabled(type: string): boolean;
    isDeliveryMethodEnabled(method: string): boolean;
    isAllNotificationsDisabled(): boolean;
    isAllDeliveryMethodsDisabled(): boolean;
}
