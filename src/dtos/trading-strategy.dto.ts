import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsObject, ValidateNested, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { StrategyType, StrategyStatus, SignalType } from '../shared/types/trading-strategy.types';


// ============================================================================
// 기술적 지표 조건 DTO 클래스들
// ============================================================================

/**
 * RSI (Relative Strength Index) 조건 설정 DTO
 * RSI는 주가의 상대적 강도를 측정하는 기술적 지표입니다.
 * 0-100 사이의 값을 가지며, 30 이하는 과매도, 70 이상은 과매수로 판단합니다.
 */
export class RsiConditionDto {
  /** RSI 계산 기간 (일) - 보통 14일을 사용 */
  @IsNumber()
  @Min(1)
  @Max(100)
  period: number;

  /** 과매도 기준값 (%) - 이 값 이하일 때 매수 신호 */
  @IsNumber()
  @Min(0)
  @Max(100)
  oversold: number;

  /** 과매수 기준값 (%) - 이 값 이상일 때 매도 신호 */
  @IsNumber()
  @Min(0)
  @Max(100)
  overbought: number;
}

/**
 * 이동평균 조건 설정 DTO
 * 이동평균은 주가의 추세를 파악하는 기본적인 기술적 지표입니다.
 * 단기 이동평균이 장기 이동평균을 상향돌파할 때 매수 신호가 발생합니다.
 */
export class MovingAverageConditionDto {
  /** 단기 이동평균 기간 (일) - 보통 5, 10, 20일 사용 */
  @IsNumber()
  @Min(1)
  @Max(200)
  shortPeriod: number;

  /** 장기 이동평균 기간 (일) - 보통 20, 50, 200일 사용 */
  @IsNumber()
  @Min(1)
  @Max(200)
  longPeriod: number;

  /** 이동평균 타입 - 'sma': 단순이동평균, 'ema': 지수이동평균 */
  @IsString()
  type: 'sma' | 'ema';
}

/**
 * MACD (Moving Average Convergence Divergence) 조건 설정 DTO
 * MACD는 두 개의 이동평균선의 차이를 이용한 추세 추종 지표입니다.
 * MACD 선이 신호선을 상향돌파할 때 매수 신호가 발생합니다.
 */
export class MacdConditionDto {
  /** 빠른 이동평균 기간 (일) - 보통 12일 사용 */
  @IsNumber()
  @Min(1)
  @Max(50)
  fastPeriod: number;

  /** 느린 이동평균 기간 (일) - 보통 26일 사용 */
  @IsNumber()
  @Min(1)
  @Max(100)
  slowPeriod: number;

  /** 신호선 기간 (일) - 보통 9일 사용 */
  @IsNumber()
  @Min(1)
  @Max(50)
  signalPeriod: number;
}

/**
 * 볼린저 밴드 조건 설정 DTO
 * 볼린저 밴드는 이동평균을 중심으로 표준편차를 이용해 밴드를 만드는 지표입니다.
 * 가격이 하단 밴드에 닿으면 매수, 상단 밴드에 닿으면 매도 신호가 발생합니다.
 */
export class BollingerBandsConditionDto {
  /** 이동평균 기간 (일) - 보통 20일 사용 */
  @IsNumber()
  @Min(1)
  @Max(100)
  period: number;

  /** 표준편차 배수 - 보통 2배 사용 (상단/하단 밴드의 폭 결정) */
  @IsNumber()
  @Min(0.1)
  @Max(5)
  standardDeviations: number;
}

/**
 * 모든 기술적 지표 조건을 포함하는 DTO
 * 각 지표는 선택적으로 설정할 수 있으며, 설정된 지표만 계산됩니다.
 */
export class IndicatorConditionsDto {
  /** RSI 조건 설정 (선택사항) */
  @IsOptional()
  @ValidateNested()
  @Type(() => RsiConditionDto)
  rsi?: RsiConditionDto;

  /** 이동평균 조건 설정 (선택사항) */
  @IsOptional()
  @ValidateNested()
  @Type(() => MovingAverageConditionDto)
  movingAverage?: MovingAverageConditionDto;

  /** MACD 조건 설정 (선택사항) */
  @IsOptional()
  @ValidateNested()
  @Type(() => MacdConditionDto)
  macd?: MacdConditionDto;

  /** 볼린저 밴드 조건 설정 (선택사항) */
  @IsOptional()
  @ValidateNested()
  @Type(() => BollingerBandsConditionDto)
  bollingerBands?: BollingerBandsConditionDto;
}

// ============================================================================
// 거래 시간 및 조건 DTO 클래스들
// ============================================================================

/**
 * 거래 시간 설정 DTO
 * 자동매매가 실행될 수 있는 시간대를 설정합니다.
 */
export class TradingHoursDto {
  /** 거래 시작 시간 (24시간 형식: "09:30") */
  @IsString()
  start: string;

  /** 거래 종료 시간 (24시간 형식: "16:00") */
  @IsString()
  end: string;
}

/**
 * 가격 조건 설정 DTO
 * 주가가 특정 범위 내에 있을 때만 거래를 실행하도록 제한합니다.
 */
export class PriceConditionsDto {
  /** 최소 거래 가격 (달러) - 이 가격 이하에서는 거래하지 않음 */
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  /** 최대 거래 가격 (달러) - 이 가격 이상에서는 거래하지 않음 */
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  /** 가격 변화율 조건 (%) - 급격한 가격 변동 시 거래 제한 */
  @IsOptional()
  @IsNumber()
  @Min(-100)
  @Max(100)
  priceChangePercent?: number;
}

/**
 * 거래량 조건 설정 DTO
 * 거래량이 특정 기준을 만족할 때만 거래를 실행합니다.
 */
export class VolumeConditionsDto {
  /** 최소 거래량 (주식 수) - 유동성이 낮은 주식 거래 제한 */
  @IsOptional()
  @IsNumber()
  @Min(0)
  minVolume?: number;

  /** 거래량 변화율 조건 (%) - 거래량 급증/급감 시 거래 제한 */
  @IsOptional()
  @IsNumber()
  @Min(-100)
  @Max(1000)
  volumeChangePercent?: number;
}

/**
 * 시간 조건 설정 DTO
 * 거래 실행 가능한 시간과 요일을 제한합니다.
 */
export class TimeConditionsDto {
  /** 거래 가능 시간대 설정 */
  @IsOptional()
  @ValidateNested()
  @Type(() => TradingHoursDto)
  tradingHours?: TradingHoursDto;

  /** 주말 거래 제외 여부 - true: 주말 거래 안함, false: 주말도 거래 */
  @IsOptional()
  @IsBoolean()
  excludeWeekends?: boolean;
}

// ============================================================================
// 자동매매 설정 DTO 클래스
// ============================================================================

/**
 * 자동매매 설정 DTO
 * 전략의 자동 실행과 관련된 모든 설정을 포함합니다.
 */
export class AutoTradingDto {
  /** 자동매매 활성화 여부 - true: 자동 실행, false: 수동 실행만 */
  @IsBoolean()
  enabled: boolean;

  /** 최대 포지션 크기 (달러) - 한 번에 투자할 수 있는 최대 금액 */
  @IsNumber()
  @Min(0)
  maxPositionSize: number;

  /** 손절 비율 (%) - 주가가 이 비율만큼 하락하면 자동으로 매도 */
  @IsNumber()
  @Min(0)
  @Max(100)
  stopLoss: number;

  /** 익절 비율 (%) - 주가가 이 비율만큼 상승하면 자동으로 매도 */
  @IsNumber()
  @Min(0)
  @Max(100)
  takeProfit: number;

  /** 일일 최대 거래 횟수 - 하루에 실행할 수 있는 최대 거래 수 */
  @IsNumber()
  @Min(1)
  @Max(100)
  maxDailyTrades: number;

  /** 거래당 위험 비율 (%) - 한 번의 거래에서 잃을 수 있는 최대 비율 */
  @IsNumber()
  @Min(0)
  @Max(100)
  riskPerTrade: number;
}

// ============================================================================
// 거래 조건 통합 DTO 클래스
// ============================================================================

/**
 * 모든 거래 조건을 통합하는 DTO
 * 기술적 지표, 가격, 거래량, 시간 조건을 하나로 묶어서 관리합니다.
 */
export class TradingConditionsDto {
  /** 기술적 지표 조건 설정 (RSI, 이동평균, MACD, 볼린저 밴드) */
  @IsOptional()
  @ValidateNested()
  @Type(() => IndicatorConditionsDto)
  indicators?: IndicatorConditionsDto;

  /** 가격 조건 설정 (최소/최대 가격, 변화율) */
  @IsOptional()
  @ValidateNested()
  @Type(() => PriceConditionsDto)
  priceConditions?: PriceConditionsDto;

  /** 거래량 조건 설정 (최소 거래량, 변화율) */
  @IsOptional()
  @ValidateNested()
  @Type(() => VolumeConditionsDto)
  volumeConditions?: VolumeConditionsDto;

  /** 시간 조건 설정 (거래 시간, 주말 제외) */
  @IsOptional()
  @ValidateNested()
  @Type(() => TimeConditionsDto)
  timeConditions?: TimeConditionsDto;
}

// ============================================================================
// 전략 생성 및 수정 DTO 클래스들
// ============================================================================

/**
 * 새로운 거래 전략을 생성할 때 사용하는 DTO
 * 전략의 모든 필수 정보와 선택적 설정을 포함합니다.
 */
export class CreateTradingStrategyDto {
  /** 전략 이름 - 사용자가 쉽게 구분할 수 있는 고유한 이름 */
  @IsString()
  name: string;

  /** 전략 설명 - 전략의 목적과 동작 방식에 대한 상세 설명 */
  @IsOptional()
  @IsString()
  description?: string;

  /** 전략 타입 - 이동평균, RSI, MACD, 볼린저 밴드, 사용자 정의 중 선택 */
  @IsEnum(StrategyType)
  type: StrategyType;

  /** 거래 조건 설정 - 기술적 지표, 가격, 거래량, 시간 조건을 모두 포함 */
  @ValidateNested()
  @Type(() => TradingConditionsDto)
  conditions: TradingConditionsDto;

  /** 자동매매 설정 - 자동 실행 여부와 위험 관리 설정 */
  @ValidateNested()
  @Type(() => AutoTradingDto)
  autoTrading: AutoTradingDto;
}

/**
 * 기존 거래 전략을 수정할 때 사용하는 DTO
 * 모든 필드가 선택사항이므로 변경하고 싶은 부분만 전송하면 됩니다.
 */
export class UpdateTradingStrategyDto {
  /** 전략 이름 수정 (선택사항) */
  @IsOptional()
  @IsString()
  name?: string;

  /** 전략 설명 수정 (선택사항) */
  @IsOptional()
  @IsString()
  description?: string;

  /** 전략 타입 수정 (선택사항) */
  @IsOptional()
  @IsEnum(StrategyType)
  type?: StrategyType;

  /** 거래 조건 수정 (선택사항) */
  @IsOptional()
  @ValidateNested()
  @Type(() => TradingConditionsDto)
  conditions?: TradingConditionsDto;

  /** 자동매매 설정 수정 (선택사항) */
  @IsOptional()
  @ValidateNested()
  @Type(() => AutoTradingDto)
  autoTrading?: AutoTradingDto;

  /** 전략 상태 수정 (선택사항) - 활성/비활성/일시정지 */
  @IsOptional()
  @IsEnum(StrategyStatus)
  status?: StrategyStatus;
}

/**
 * 전략 상태만 변경할 때 사용하는 DTO
 * 전략의 활성화/비활성화/일시정지를 빠르게 전환할 때 사용합니다.
 */
export class UpdateStrategyStatusDto {
  /** 변경할 전략 상태 - active: 활성, inactive: 비활성, paused: 일시정지 */
  @IsEnum(StrategyStatus)
  status: StrategyStatus;
}

// ============================================================================
// 백테스팅 관련 DTO 클래스들
// ============================================================================

/**
 * 전략 백테스팅을 요청할 때 사용하는 DTO
 * 과거 데이터를 사용해서 전략의 성과를 시뮬레이션합니다.
 */
export class BacktestRequestDto {
  /** 백테스팅 이름 - 결과를 구분하기 위한 고유한 이름 */
  @IsString()
  name: string;

  /** 백테스팅 시작 날짜 (YYYY-MM-DD 형식) */
  @IsString()
  startDate: string;

  /** 백테스팅 종료 날짜 (YYYY-MM-DD 형식) */
  @IsString()
  endDate: string;

  /** 초기 자본금 (달러) - 백테스팅 시작 시 투자할 금액 */
  @IsNumber()
  @Min(0)
  initialCapital: number;

  /** 특정 주식 심볼 목록 (선택사항) - 지정하지 않으면 모든 주식에 대해 백테스팅 */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stockSymbols?: string[];
}

// ============================================================================
// 거래 신호 및 결과 DTO 클래스들
// ============================================================================

/**
 * 거래 신호 정보를 전달하는 DTO
 * 전략에서 생성된 매수/매도 신호의 상세 정보를 포함합니다.
 */
export class TradingSignalDto {
  /** 신호 고유 ID */
  @IsNumber()
  id: number;

  /** 신호 타입 - BUY: 매수, SELL: 매도, HOLD: 보유 */
  @IsEnum(SignalType)
  signalType: SignalType;

  /** 주식 심볼 (예: AAPL, GOOGL) */
  @IsString()
  stockSymbol: string;

  /** 신호 발생 시점의 주가 (달러) */
  @IsNumber()
  price: number;

  /** 신호 발생 시점의 거래량 (주식 수) */
  @IsNumber()
  volume: number;

  /** 신호 생성에 사용된 기술적 지표 값들 (선택사항) */
  @IsOptional()
  @IsObject()
  indicators?: {
    /** RSI 값 (0-100) */
    rsi?: number;
    /** 이동평균 값들 */
    movingAverage?: {
      short: number;  // 단기 이동평균
      long: number;   // 장기 이동평균
    };
    /** MACD 값들 */
    macd?: {
      macd: number;      // MACD 선
      signal: number;    // 신호선
      histogram: number; // 히스토그램
    };
    /** 볼린저 밴드 값들 */
    bollingerBands?: {
      upper: number;   // 상단 밴드
      middle: number;  // 중간 밴드 (이동평균)
      lower: number;   // 하단 밴드
    };
  };

  /** 신호 발생 이유 (선택사항) - 어떤 조건에 의해 신호가 생성되었는지 설명 */
  @IsOptional()
  @IsString()
  reason?: string;

  /** 신호 신뢰도 (0-100%) - 신호의 정확도를 나타내는 지표 */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  confidence?: number;

  /** 신호 실행 여부 - true: 실제 거래로 실행됨, false: 아직 실행되지 않음 */
  @IsBoolean()
  executed: boolean;

  /** 신호 생성 시간 (ISO 8601 형식) */
  @IsString()
  createdAt: string;
}

/**
 * 백테스팅 결과를 전달하는 DTO
 * 전략의 과거 성과와 수익성 지표를 포함합니다.
 */
export class BacktestResultDto {
  /** 결과 고유 ID */
  @IsNumber()
  id: number;

  /** 백테스팅 이름 */
  @IsString()
  name: string;

  /** 백테스팅 시작 날짜 */
  @IsString()
  startDate: string;

  /** 백테스팅 종료 날짜 */
  @IsString()
  endDate: string;

  /** 총 수익률 (%) - 백테스팅 기간 동안의 전체 수익률 */
  @IsNumber()
  totalReturn: number;

  /** 연간 수익률 (%) - 1년 기준으로 환산한 수익률 */
  @IsNumber()
  annualizedReturn: number;

  /** 최대 낙폭 (%) - 백테스팅 기간 동안의 최대 손실 비율 */
  @IsNumber()
  maxDrawdown: number;

  /** 샤프 비율 - 위험 대비 수익률을 나타내는 지표 (높을수록 좋음) */
  @IsNumber()
  sharpeRatio: number;

  /** 승률 (%) - 전체 거래 중 수익이 난 거래의 비율 */
  @IsNumber()
  winRate: number;

  /** 총 거래 횟수 */
  @IsNumber()
  totalTrades: number;

  /** 수익 거래 횟수 */
  @IsNumber()
  profitableTrades: number;

  /** 평균 수익 (달러) - 수익이 난 거래들의 평균 수익 */
  @IsNumber()
  averageWin: number;

  /** 평균 손실 (달러) - 손실이 난 거래들의 평균 손실 */
  @IsNumber()
  averageLoss: number;

  /** 수익 팩터 - 총 수익 / 총 손실 (1보다 클수록 수익성 좋음) */
  @IsNumber()
  profitFactor: number;

  /** 초기 자본금 (달러) */
  @IsNumber()
  initialCapital: number;

  /** 최종 자본금 (달러) */
  @IsNumber()
  finalCapital: number;

  /** 월별 수익률 (선택사항) - 각 월의 수익률을 기록 */
  @IsOptional()
  @IsObject()
  monthlyReturns?: {
    [key: string]: number;  // "YYYY-MM" 형식의 키와 해당 월의 수익률
  };

  /** 백테스팅 완료 시간 */
  @IsString()
  createdAt: string;
}

// ============================================================================
// 전략 성과 요약 DTO 클래스
// ============================================================================

/**
 * 전략의 전체 성과를 요약하는 DTO
 * 백테스팅 결과와 실제 거래 신호 정보를 종합하여 전략의 성과를 평가합니다.
 */
export class StrategyPerformanceDto {
  /** 전략 고유 ID */
  @IsNumber()
  id: number;

  /** 전략 이름 */
  @IsString()
  name: string;

  /** 전략 타입 */
  @IsEnum(StrategyType)
  type: StrategyType;

  /** 전략 상태 */
  @IsEnum(StrategyStatus)
  status: StrategyStatus;

  /** 백테스팅 성과 요약 (선택사항) */
  @IsOptional()
  @IsObject()
  backtestSummary?: {
    totalReturn: number;        // 총 수익률
    annualizedReturn: number;   // 연간 수익률
    maxDrawdown: number;        // 최대 낙폭
    sharpeRatio: number;        // 샤프 비율
    winRate: number;            // 승률
    totalTrades: number;        // 총 거래 횟수
    profitableTrades: number;   // 수익 거래 횟수
    averageWin: number;         // 평균 수익
    averageLoss: number;        // 평균 손실
    profitFactor: number;       // 수익 팩터
  };

  /** 총 신호 수 - 전략에서 생성된 모든 신호의 개수 */
  @IsNumber()
  totalSignals: number;

  /** 실행된 신호 수 - 실제로 거래로 이어진 신호의 개수 */
  @IsNumber()
  executedSignals: number;

  /** 마지막 실행 시간 - 전략이 마지막으로 실행된 시간 */
  @IsString()
  lastExecutedAt?: string;

  /** 전략 생성 시간 */
  @IsString()
  createdAt: string;
} 