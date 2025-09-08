import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsObject } from 'class-validator';
import { NotificationType, NotificationStatus } from '../entities/notification.entity';

/**
 * 알림 생성 DTO
 */
export class CreateNotificationDto {
  /** 알림을 받을 사용자 ID */
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  /** 알림 타입 */
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  /** 알림 제목 */
  @IsString()
  @IsNotEmpty()
  title: string;

  /** 알림 내용 */
  @IsString()
  @IsNotEmpty()
  message: string;

  /** 알림 상태 */
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  /** 알림 우선순위 */
  @IsOptional()
  @IsString()
  priority?: string;

  /** 알림 추가 데이터 */
  @IsOptional()
  @IsObject()
  data?: any;
}

/**
 * 알림 응답 DTO
 */
export class NotificationResponseDto {
  /** 알림 고유 ID */
  id: number;

  /** 알림을 받을 사용자 ID */
  userId: number;

  /** 알림 타입 */
  type: NotificationType;

  /** 알림 제목 */
  title: string;

  /** 알림 내용 */
  message: string;

  /** 알림 상태 */
  status: NotificationStatus;

  /** 알림 우선순위 */
  priority: string;

  /** 알림 읽음 여부 */
  isRead: boolean;

  /** 알림 생성 일시 */
  createdAt: Date;

  /** 알림 수정 일시 */
  updatedAt: Date;

  /** 알림이 긴급한지 여부 */
  isUrgent: boolean;

  /** 알림이 최근에 생성되었는지 여부 */
  isRecent: boolean;
}

/**
 * 알림 업데이트 DTO
 */
export class UpdateNotificationDto {
  /** 알림 읽음 여부 */
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  /** 알림 상태 */
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;
}

/**
 * 알림 조회 필터 DTO
 */
export class NotificationFilterDto {
  /** 알림 타입 필터 */
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  /** 읽음 여부 필터 */
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  /** 페이지 번호 */
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  /** 페이지 크기 */
  @IsOptional()
  @IsNumber()
  limit?: number = 20;
}

/**
 * 알림 통계 DTO
 */
export class NotificationStatsDto {
  /** 전체 알림 수 */
  totalCount: number;

  /** 읽지 않은 알림 수 */
  unreadCount: number;

  /** 긴급 알림 수 */
  urgentCount: number;

  /** 최근 24시간 알림 수 */
  recentCount: number;

  /** 알림 타입별 통계 */
  typeStats: Record<NotificationType, number>;
}

/**
 * 알림 통계 DTO (기존 호환성용 alias)
 */
export class NotificationStatisticsDto extends NotificationStatsDto {}

/**
 * 알림 설정 생성 DTO
 */
export class CreateNotificationSettingsDto {
  /** 거래 실행 알림 설정 */
  @IsOptional()
  tradeExecuted?: {
    enabled: boolean;
    email: boolean;
    push: boolean;
    websocket: boolean;
  };

  /** 가격 알림 설정 */
  @IsOptional()
  priceAlert?: {
    enabled: boolean;
    email: boolean;
    push: boolean;
    websocket: boolean;
  };

  /** 포트폴리오 업데이트 알림 설정 */
  @IsOptional()
  portfolioUpdate?: {
    enabled: boolean;
    email: boolean;
    push: boolean;
    websocket: boolean;
  };

  /** 전략 실행 알림 설정 */
  @IsOptional()
  strategyTriggered?: {
    enabled: boolean;
    email: boolean;
    push: boolean;
    websocket: boolean;
  };

  /** 시스템 알림 설정 */
  @IsOptional()
  systemAlert?: {
    enabled: boolean;
    email: boolean;
    push: boolean;
    websocket: boolean;
  };
}

/**
 * 알림 설정 업데이트 DTO
 */
export class UpdateNotificationSettingsDto {
  /** 거래 실행 알림 설정 */
  @IsOptional()
  tradeExecuted?: {
    enabled?: boolean;
    email?: boolean;
    push?: boolean;
    websocket?: boolean;
  };

  /** 가격 알림 설정 */
  @IsOptional()
  priceAlert?: {
    enabled?: boolean;
    email?: boolean;
    push?: boolean;
    websocket?: boolean;
  };

  /** 포트폴리오 업데이트 알림 설정 */
  @IsOptional()
  portfolioUpdate?: {
    enabled?: boolean;
    email?: boolean;
    push?: boolean;
    websocket?: boolean;
  };

  /** 전략 실행 알림 설정 */
  @IsOptional()
  strategyTriggered?: {
    enabled?: boolean;
    email?: boolean;
    push?: boolean;
    websocket?: boolean;
  };

  /** 시스템 알림 설정 */
  @IsOptional()
  systemAlert?: {
    enabled?: boolean;
    email?: boolean;
    push?: boolean;
    websocket?: boolean;
  };
}

/**
 * 알림 설정 DTO (기존 호환성용)
 */
export class NotificationSettingsDto {
  /** 거래 실행 알림 활성화 */
  @IsOptional()
  @IsBoolean()
  tradeExecuted?: boolean = true;

  /** 가격 알림 활성화 */
  @IsOptional()
  @IsBoolean()
  priceAlert?: boolean = true;

  /** 포트폴리오 업데이트 알림 활성화 */
  @IsOptional()
  @IsBoolean()
  portfolioUpdate?: boolean = true;

  /** 전략 실행 알림 활성화 */
  @IsOptional()
  @IsBoolean()
  strategyTriggered?: boolean = true;

  /** 시스템 알림 활성화 */
  @IsOptional()
  @IsBoolean()
  systemAlert?: boolean = true;

  /** 이메일 알림 활성화 */
  @IsOptional()
  @IsBoolean()
  emailEnabled?: boolean = true;

  /** 푸시 알림 활성화 */
  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean = true;

  /** 웹소켓 알림 활성화 */
  @IsOptional()
  @IsBoolean()
  websocketEnabled?: boolean = true;
}

/**
 * 알림 전송 요청 DTO
 */
export class SendNotificationDto {
  /** 알림을 받을 사용자 ID들 */
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  userIds: number[];

  /** 알림 타입 */
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  /** 알림 제목 */
  @IsString()
  @IsNotEmpty()
  title: string;

  /** 알림 내용 */
  @IsString()
  @IsNotEmpty()
  message: string;

  /** 알림 추가 데이터 */
  @IsOptional()
  @IsObject()
  data?: any;

  /** 알림 우선순위 */
  @IsOptional()
  @IsString()
  priority?: string;

  /** 즉시 전송 여부 */
  @IsOptional()
  @IsBoolean()
  sendImmediately?: boolean = true;
}

/**
 * 알림 필터링 DTO (누락된 export)
 */
export class FilterNotificationsDto {
  /** 알림 타입 필터 */
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  /** 읽음 여부 필터 */
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  /** 상태 필터 */
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  /** 페이지 번호 */
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  /** 페이지 크기 */
  @IsOptional()
  @IsNumber()
  limit?: number = 20;
} 