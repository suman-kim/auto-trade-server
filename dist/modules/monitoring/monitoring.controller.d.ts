import { PerformanceMonitorService } from '../../infrastructure/services/performance-monitor.service';
import { ErrorTrackingService } from '../../infrastructure/services/error-tracking.service';
export declare class MonitoringController {
    private readonly performanceMonitor;
    private readonly errorTracking;
    constructor(performanceMonitor: PerformanceMonitorService, errorTracking: ErrorTrackingService);
    getMetrics(): any;
    generateReport(): any;
    getHealth(): {
        status: string;
        timestamp: string;
        system: {
            memory: any;
            cpu: any;
        };
        performance: {
            totalRequests: any;
            totalErrors: any;
            errorRate: number;
        };
    };
    getErrorStatistics(): any;
    getRecentErrors(): import("../../infrastructure/services/error-tracking.service").ErrorInfo[];
    generateErrorReport(): any;
}
