import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'events';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * 에러 정보 인터페이스
 */
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

/**
 * 에러 추적 서비스
 * 에러 로깅, 분류, 알림, 통계 기능을 제공
 */
@Injectable()
export class ErrorTrackingService extends EventEmitter {
  private readonly logger = new Logger(ErrorTrackingService.name);

  // 에러 저장소
  private errors = {
    critical: [] as ErrorInfo[],
    high: [] as ErrorInfo[],
    medium: [] as ErrorInfo[],
    low: [] as ErrorInfo[],
  };

  // 에러 통계
  private statistics = {
    totalErrors: 0,
    errorsByType: new Map<string, number>(),
    errorsByModule: new Map<string, number>(),
    errorsByHour: new Map<number, number>(),
  };

  // 알림 설정
  private notificationSettings = {
    critical: true,
    high: true,
    medium: false,
    low: false,
    emailNotifications: true,
    slackNotifications: false,
  };

  constructor() {
    super();
    this.initializeErrorTracking();
  }

  /**
   * 에러 기록
   */
  recordError(
    error: Error | string,
    level: 'critical' | 'high' | 'medium' | 'low' = 'medium',
    module: string = 'unknown',
    context?: any,
  ): void {
    const errorInfo: ErrorInfo = {
      id: this.generateErrorId(),
      timestamp: new Date(),
      level,
      type: error instanceof Error ? error.constructor.name : 'UnknownError',
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      module,
      context,
    };

    // 에러 저장
    this.errors[level].push(errorInfo);

    // 최근 1000개만 유지
    if (this.errors[level].length > 1000) {
      this.errors[level].shift();
    }

    // 통계 업데이트
    this.updateStatistics(errorInfo);

    // 로깅
    this.logError(errorInfo);

    // 알림 전송
    if (this.shouldSendNotification(level)) {
      this.sendNotification(errorInfo);
    }

    // 이벤트 발생
    this.emit('errorRecorded', errorInfo);
    this.emit(`error:${level}`, errorInfo);
  }

  /**
   * 에러 ID 생성
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 통계 업데이트
   */
  private updateStatistics(errorInfo: ErrorInfo): void {
    this.statistics.totalErrors++;

    // 타입별 통계
    const typeCount = this.statistics.errorsByType.get(errorInfo.type) || 0;
    this.statistics.errorsByType.set(errorInfo.type, typeCount + 1);

    // 모듈별 통계
    const moduleCount = this.statistics.errorsByModule.get(errorInfo.module) || 0;
    this.statistics.errorsByModule.set(errorInfo.module, moduleCount + 1);

    // 시간별 통계
    const hour = errorInfo.timestamp.getHours();
    const hourCount = this.statistics.errorsByHour.get(hour) || 0;
    this.statistics.errorsByHour.set(hour, hourCount + 1);
  }

  /**
   * 에러 로깅
   */
  private logError(errorInfo: ErrorInfo): void {
    const logMessage = `[${errorInfo.level.toUpperCase()}] ${errorInfo.module}: ${errorInfo.message}`;
    
    switch (errorInfo.level) {
      case 'critical':
        this.logger.error(logMessage, errorInfo.stack);
        break;
      case 'high':
        this.logger.error(logMessage);
        break;
      case 'medium':
        this.logger.warn(logMessage);
        break;
      case 'low':
        this.logger.debug(logMessage);
        break;
    }
  }

  /**
   * 알림 전송 여부 확인
   */
  private shouldSendNotification(level: string): boolean {
    return this.notificationSettings[level as keyof typeof this.notificationSettings] || false;
  }

  /**
   * 알림 전송
   */
  private async sendNotification(errorInfo: ErrorInfo): Promise<void> {
    const notification = {
      level: errorInfo.level,
      module: errorInfo.module,
      message: errorInfo.message,
      timestamp: errorInfo.timestamp,
      id: errorInfo.id,
    };

    // 이메일 알림
    if (this.notificationSettings.emailNotifications) {
      await this.sendEmailNotification(notification);
    }

    // Slack 알림
    if (this.notificationSettings.slackNotifications) {
      await this.sendSlackNotification(notification);
    }

    // WebSocket 알림
    this.emit('notification', notification);
  }

  /**
   * 이메일 알림 전송
   */
  private async sendEmailNotification(notification: any): Promise<void> {
    // 실제 구현에서는 이메일 서비스 사용
    this.logger.log(`이메일 알림 전송: ${notification.level} - ${notification.message}`);
  }

  /**
   * Slack 알림 전송
   */
  private async sendSlackNotification(notification: any): Promise<void> {
    // 실제 구현에서는 Slack API 사용
    this.logger.log(`Slack 알림 전송: ${notification.level} - ${notification.message}`);
  }

  /**
   * 에러 통계 조회
   */
  getErrorStatistics(): any {
    return {
      total: this.statistics.totalErrors,
      byLevel: {
        critical: this.errors.critical.length,
        high: this.errors.high.length,
        medium: this.errors.medium.length,
        low: this.errors.low.length,
      },
      byType: Object.fromEntries(this.statistics.errorsByType),
      byModule: Object.fromEntries(this.statistics.errorsByModule),
      byHour: Object.fromEntries(this.statistics.errorsByHour),
    };
  }

  /**
   * 최근 에러 조회
   */
  getRecentErrors(level?: string, limit: number = 50): ErrorInfo[] {
    if (level) {
      return this.errors[level as keyof typeof this.errors].slice(-limit);
    }

    // 모든 레벨의 에러를 시간순으로 정렬
    const allErrors = [
      ...this.errors.critical,
      ...this.errors.high,
      ...this.errors.medium,
      ...this.errors.low,
    ];

    return allErrors
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * 에러 검색
   */
  searchErrors(query: string, level?: string): ErrorInfo[] {
    const searchErrors = level ? this.errors[level as keyof typeof this.errors] : [
      ...this.errors.critical,
      ...this.errors.high,
      ...this.errors.medium,
      ...this.errors.low,
    ];

    return searchErrors.filter(error => 
      error.message.toLowerCase().includes(query.toLowerCase()) ||
      error.module.toLowerCase().includes(query.toLowerCase()) ||
      error.type.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * 에러 리포트 생성
   */
  generateErrorReport(): any {
    const stats = this.getErrorStatistics();
    const recentErrors = this.getRecentErrors(undefined, 10);

    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalErrors: stats.total,
        criticalErrors: stats.byLevel.critical,
        highErrors: stats.byLevel.high,
        errorRate: this.calculateErrorRate(),
      },
      topErrorTypes: this.getTopErrorTypes(5),
      topErrorModules: this.getTopErrorModules(5),
      recentErrors: recentErrors.map(error => ({
        id: error.id,
        level: error.level,
        module: error.module,
        message: error.message,
        timestamp: error.timestamp,
      })),
      recommendations: this.generateRecommendations(stats),
    };
  }

  /**
   * 에러율 계산
   */
  private calculateErrorRate(): number {
    // 실제 구현에서는 총 요청 수 대비 에러 수 계산
    return this.statistics.totalErrors > 0 ? (this.statistics.totalErrors / 1000) * 100 : 0;
  }

  /**
   * 상위 에러 타입 조회
   */
  private getTopErrorTypes(limit: number): Array<{ type: string; count: number }> {
    return Array.from(this.statistics.errorsByType.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([type, count]) => ({ type, count }));
  }

  /**
   * 상위 에러 모듈 조회
   */
  private getTopErrorModules(limit: number): Array<{ module: string; count: number }> {
    return Array.from(this.statistics.errorsByModule.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([module, count]) => ({ module, count }));
  }

  /**
   * 권장사항 생성
   */
  private generateRecommendations(stats: any): string[] {
    const recommendations: string[] = [];

    if (stats.byLevel.critical > 10) {
      recommendations.push('치명적 에러가 많습니다. 즉시 조치가 필요합니다.');
    }

    if (stats.byLevel.high > 50) {
      recommendations.push('높은 수준의 에러가 많습니다. 에러 처리 로직을 검토하세요.');
    }

    if (stats.total > 1000) {
      recommendations.push('전체 에러 수가 많습니다. 시스템 안정성을 점검하세요.');
    }

    return recommendations;
  }

  /**
   * 알림 설정 업데이트
   */
  updateNotificationSettings(settings: Partial<typeof this.notificationSettings>): void {
    this.notificationSettings = { ...this.notificationSettings, ...settings };
    this.logger.log('알림 설정 업데이트됨');
  }

  /**
   * 에러 데이터 초기화
   */
  clearErrors(): void {
    this.errors = {
      critical: [],
      high: [],
      medium: [],
      low: [],
    };
    this.statistics = {
      totalErrors: 0,
      errorsByType: new Map(),
      errorsByModule: new Map(),
      errorsByHour: new Map(),
    };
    this.logger.log('에러 데이터 초기화 완료');
  }

  /**
   * 에러 추적 초기화
   */
  private initializeErrorTracking(): void {
    this.logger.log('에러 추적 서비스 시작');

    // 이벤트 리스너 설정
    this.on('errorRecorded', (errorInfo: ErrorInfo) => {
      this.logger.debug(`에러 기록됨: ${errorInfo.level} - ${errorInfo.message}`);
    });

    this.on('notification', (notification: any) => {
      this.logger.log(`알림 전송됨: ${notification.level} - ${notification.message}`);
    });
  }

  /**
   * 정기적인 에러 리포트 생성 (Cron 작업)
   */
  @Cron(CronExpression.EVERY_HOUR)
  private generateHourlyReport(): void {
    const report = this.generateErrorReport();
    this.logger.log('시간별 에러 리포트 생성 완료', report.summary);
  }
} 