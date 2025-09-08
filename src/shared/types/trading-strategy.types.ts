/**
 * 거래 전략 관련 타입 정의
 */

/**
 * RSI 설정
 */
export interface RsiConfig {
  /** RSI 계산 기간 */
  period: number;
  /** 과매도 기준값 */
  oversold: number;
  /** 과매수 기준값 */
  overbought: number;
}

/**
 * 이동평균 설정
 */
export interface MovingAverageConfig {
  /** 단기 이동평균 기간 */
  shortPeriod: number;
  /** 장기 이동평균 기간 */
  longPeriod: number;
  /** 이동평균 타입 */
  type: 'sma' | 'ema';
}

/**
 * MACD 설정
 */
export interface MacdConfig {
  /** 빠른 이동평균 기간 */
  fastPeriod: number;
  /** 느린 이동평균 기간 */
  slowPeriod: number;
  /** 신호선 기간 */
  signalPeriod: number;
}

/**
 * 볼린저 밴드 설정
 */
export interface BollingerBandsConfig {
  /** 이동평균 기간 */
  period: number;
  /** 표준편차 배수 */
  standardDeviations: number;
}

/**
 * 기술적 지표 설정
 */
export interface TechnicalIndicatorsConfig {
  /** RSI 설정 */
  rsi?: RsiConfig;
  /** 이동평균 설정 */
  movingAverage?: MovingAverageConfig;
  /** MACD 설정 */
  macd?: MacdConfig;
  /** 볼린저 밴드 설정 */
  bollingerBands?: BollingerBandsConfig;
  /** 거래량 이동평균 설정 */
  volumeMA?: {
    period: number;
  };
}

/**
 * 가격 조건
 */
export interface PriceConditions {
  /** 최소 가격 */
  minPrice?: number;
  /** 최대 가격 */
  maxPrice?: number;
  /** 가격 변화율 조건 */
  priceChangePercent?: number;
}

/**
 * 거래량 조건
 */
export interface VolumeConditions {
  /** 최소 거래량 */
  minVolume?: number;
  /** 거래량 변화율 조건 */
  volumeChangePercent?: number;
}

/**
 * 거래 시간 설정
 */
export interface TradingHours {
  /** 거래 시작 시간 (예: "09:30") */
  start: string;
  /** 거래 종료 시간 (예: "16:00") */
  end: string;
}

/**
 * 시간 조건
 */
export interface TimeConditions {
  /** 거래 시간 */
  tradingHours?: TradingHours;
  /** 주말 거래 제외 여부 */
  excludeWeekends?: boolean;
}

/**
 * 거래 전략 조건
 */
export interface TradingStrategyConditions {
  /** 기술적 지표 설정 */
  indicators?: TechnicalIndicatorsConfig;
  /** 가격 조건 */
  priceConditions?: PriceConditions;
  /** 거래량 조건 */
  volumeConditions?: VolumeConditions;
  /** 시간 조건 */
  timeConditions?: TimeConditions;
}

/**
 * 자동매매 설정
 */
export interface AutoTradingConfig {
  /** 자동매매 활성화 여부 */
  enabled: boolean;
  /** 일일 최대 거래 횟수 */
  maxDailyTrades: number;
  /** 최대 포지션 크기 */
  maxPositionSize: number;
  /** 거래당 위험 비율 (%) */
  riskPerTrade: number;
  /** 최소 신뢰도 */
  minConfidence: number;
  /** 손절 비율 (%) */
  stopLoss: number;
  /** 익절 비율 (%) */
  takeProfit: number;
}

/**
 * 거래 신호 타입
 */
export enum SignalType {
  BUY = 'BUY',
  SELL = 'SELL',
  HOLD = 'HOLD',
}

/**
 * 전략 상태
 */
export enum StrategyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused',
}

/**
 * 전략 타입
 */
export enum StrategyType {
  MOMENTUM = 'momentum',
  MEAN_REVERSION = 'mean_reversion',
  BREAKOUT = 'breakout',
  SCALPING = 'scalping',
  SWING = 'swing',
}

/**
 * 기술적 지표 계산 결과
 */
export interface TechnicalIndicatorsResult {
  /** RSI 값 */
  rsi?: number;
  /** 단기 이동평균 */
  shortMA?: number;
  /** 장기 이동평균 */
  longMA?: number;
  /** MACD 값 */
  macd?: {
    macd: number;
    signal: number;
    histogram: number;
  };
  /** 볼린저 밴드 */
  bollingerBands?: {
    upper: number;
    middle: number;
    lower: number;
  };
  /** 거래량 이동평균 */
  volumeMA?: number;
}

/**
 * 신호 생성 결과
 */
export interface SignalGenerationResult {
  /** 신호 타입 */
  signalType: SignalType;
  /** 신뢰도 (0-1) */
  confidence: number;
  /** 신호 생성 이유 */
  reason?: string;
}

/**
 * 주문 검증 결과
 */
export interface OrderValidationResult {
  /** 검증 통과 여부 */
  isValid: boolean;
  /** 실패 이유 */
  reason?: string;
  /** 조정된 수량 */
  adjustedQuantity?: number;
}
