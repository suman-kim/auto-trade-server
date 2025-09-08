import { Controller, Get, UseGuards } from '@nestjs/common';
import { PerformanceMonitorService } from '../../infrastructure/services/performance-monitor.service';
import { ErrorTrackingService } from '../../infrastructure/services/error-tracking.service';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * 모니터링 컨트롤러
 * 성능 메트릭 및 시스템 상태 조회
 */
@ApiTags('monitoring')
@Controller('monitoring')
export class MonitoringController {
  constructor(
    private readonly performanceMonitor: PerformanceMonitorService,
    private readonly errorTracking: ErrorTrackingService,
  ) {}

  /**
   * 성능 메트릭 조회
   */
  @Get('metrics')
  @ApiOperation({ summary: '성능 메트릭 조회', description: '현재 시스템의 성능 메트릭을 조회합니다.' })
  @ApiResponse({ status: 200, description: '성능 메트릭 조회 성공' })
  getMetrics() {
    return this.performanceMonitor.getMetrics();
  }

  /**
   * 성능 리포트 생성
   */
  @Get('report')
  generateReport() {
    return this.performanceMonitor.generatePerformanceReport();
  }

  /**
   * 시스템 상태 조회
   */
  @Get('health')
  getHealth() {
    const metrics = this.performanceMonitor.getMetrics();
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      system: {
        memory: metrics.system.memory,
        cpu: metrics.system.cpu,
      },
      performance: {
        totalRequests: metrics.requests.total,
        totalErrors: metrics.errors.total,
        errorRate: metrics.requests.total > 0 ? (metrics.errors.total / metrics.requests.total) * 100 : 0,
      },
    };
  }

  /**
   * 에러 통계 조회
   */
  @Get('errors/statistics')
  getErrorStatistics() {
    return this.errorTracking.getErrorStatistics();
  }

  /**
   * 최근 에러 조회
   */
  @Get('errors/recent')
  getRecentErrors() {
    return this.errorTracking.getRecentErrors();
  }

  /**
   * 에러 리포트 생성
   */
  @Get('errors/report')
  generateErrorReport() {
    return this.errorTracking.generateErrorReport();
  }
} 