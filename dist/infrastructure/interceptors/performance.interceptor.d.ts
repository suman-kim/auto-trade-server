import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PerformanceMonitorService } from '../services/performance-monitor.service';
export declare class PerformanceInterceptor implements NestInterceptor {
    private readonly performanceMonitor;
    constructor(performanceMonitor: PerformanceMonitorService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
