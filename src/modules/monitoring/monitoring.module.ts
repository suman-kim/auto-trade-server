import { Module } from '@nestjs/common';
import { MonitoringController } from './monitoring.controller';
import { PerformanceMonitorService } from '../../infrastructure/services/performance-monitor.service';
import { ErrorTrackingService } from '../../infrastructure/services/error-tracking.service';

/**
 * 모니터링 모듈
 * 성능 모니터링 및 시스템 상태 관리를 위한 모듈
 */
@Module({
  controllers: [MonitoringController],
  providers: [PerformanceMonitorService, ErrorTrackingService],
  exports: [PerformanceMonitorService, ErrorTrackingService],
})
export class MonitoringModule {} 