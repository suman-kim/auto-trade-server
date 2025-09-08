import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PerformanceMonitorService } from '../services/performance-monitor.service';

/**
 * 성능 모니터링 인터셉터
 * API 응답 시간을 측정하고 성능 모니터링 서비스에 기록
 */
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  constructor(private readonly performanceMonitor: PerformanceMonitorService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    // 엔드포인트 식별
    const endpoint = `${request.method} ${request.route?.path || request.url}`;

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - startTime;
          this.performanceMonitor.recordApiResponseTime(endpoint, responseTime);
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          this.performanceMonitor.recordApiResponseTime(endpoint, responseTime);
          this.performanceMonitor.recordError();
        },
      }),
    );
  }
} 