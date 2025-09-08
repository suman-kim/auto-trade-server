import { EventEmitter } from 'events';
export interface ErrorInfo {
    id: string;
    timestamp: Date;
    level: 'critical' | 'high' | 'medium' | 'low';
    type: string;
    message: string;
    stack?: string;
    module: string;
    userId?: string;
    requestId?: string;
    context?: any;
}
export declare class ErrorTrackingService extends EventEmitter {
    private readonly logger;
    private errors;
    private statistics;
    private notificationSettings;
    constructor();
    recordError(error: Error | string, level?: 'critical' | 'high' | 'medium' | 'low', module?: string, context?: any): void;
    private generateErrorId;
    private updateStatistics;
    private logError;
    private shouldSendNotification;
    private sendNotification;
    private sendEmailNotification;
    private sendSlackNotification;
    getErrorStatistics(): any;
    getRecentErrors(level?: string, limit?: number): ErrorInfo[];
    searchErrors(query: string, level?: string): ErrorInfo[];
    generateErrorReport(): any;
    private calculateErrorRate;
    private getTopErrorTypes;
    private getTopErrorModules;
    private generateRecommendations;
    updateNotificationSettings(settings: Partial<typeof this.notificationSettings>): void;
    clearErrors(): void;
    private initializeErrorTracking;
    private generateHourlyReport;
}
