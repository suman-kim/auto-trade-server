import { EventEmitter } from 'events';
export declare class PerformanceMonitorService extends EventEmitter {
    private readonly logger;
    private metrics;
    private readonly thresholds;
    constructor();
    recordApiResponseTime(endpoint: string, responseTime: number): void;
    recordDatabaseQueryTime(query: string, queryTime: number): void;
    recordError(): void;
    updateActiveConnections(count: number): void;
    private monitorSystemResources;
    private getCpuUsage;
    getMetrics(): any;
    private calculateAverage;
    generatePerformanceReport(): any;
    private generateAlerts;
    private generateRecommendations;
    private startMonitoring;
    resetMetrics(): void;
}
