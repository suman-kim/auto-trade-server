export declare class NotificationTemplateService {
    generateTradeExecutedTemplate(data: any): {
        title: string;
        message: string;
    };
    generatePriceAlertTemplate(data: any): {
        title: string;
        message: string;
    };
    generatePortfolioUpdateTemplate(data: any): {
        title: string;
        message: string;
    };
    generateStrategyTriggeredTemplate(data: any): {
        title: string;
        message: string;
    };
    generateSystemAlertTemplate(data: any): {
        title: string;
        message: string;
    };
    generateOrderExecutionTemplate(data: any): {
        title: string;
        message: string;
    };
    generateOrderCancellationTemplate(data: any): {
        title: string;
        message: string;
    };
    generateInsufficientBalanceTemplate(data: any): {
        title: string;
        message: string;
    };
    generateLoginAlertTemplate(data: any): {
        title: string;
        message: string;
    };
    generateSecurityAlertTemplate(data: any): {
        title: string;
        message: string;
    };
    generatePerformanceAlertTemplate(data: any): {
        title: string;
        message: string;
    };
    generateGeneralNotificationTemplate(data: any): {
        title: string;
        message: string;
    };
    addPriorityEmoji(title: string, priority: string): string;
    addTypeEmoji(title: string, type: string): string;
    formatNotificationMessage(template: {
        title: string;
        message: string;
    }, type: string, priority: string): {
        title: string;
        message: string;
    };
}
