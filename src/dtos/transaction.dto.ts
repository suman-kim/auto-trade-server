import { IsEnum, IsNumber, IsOptional, IsString, IsDateString, Min, MaxLength } from 'class-validator';
import { TransactionType, TransactionStatus } from '../entities/transaction.entity';

/**
 * 거래 생성 DTO
 * 새로운 거래를 생성할 때 사용되는 데이터 전송 객체
 */
export class CreateTransactionDto {
  /** 거래가 속할 포트폴리오 ID */
  @IsNumber()
  portfolioId: number;

  /** 거래할 주식의 심볼 (예: AAPL, TSLA) */
  @IsString()
  stockSymbol: string;

  /** 거래 타입 (매수/매도) */
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  /** 거래할 주식 수량 */
  @IsNumber()
  @Min(1)
  quantity: number;

  /** 주당 거래 가격 */
  @IsNumber()
  @Min(0)
  pricePerShare: number;

  /** 거래 수수료 (선택사항) */
  @IsOptional()
  @IsNumber()
  @Min(0)
  fees?: number;

  /** 거래 메모 또는 참고사항 (선택사항) */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

/**
 * 거래 수정 DTO
 * 기존 거래를 수정할 때 사용되는 데이터 전송 객체
 */
export class UpdateTransactionDto {
  /** 거래 상태 변경 (선택사항) */
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  /** 거래 수수료 수정 (선택사항) */
  @IsOptional()
  @IsNumber()
  @Min(0)
  fees?: number;

  /** 거래 메모 수정 (선택사항) */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

/**
 * 거래 조회 필터 DTO
 * 거래 내역을 조회할 때 필터링 조건을 지정하는 데이터 전송 객체
 */
export class TransactionFilterDto {
  /** 거래 타입으로 필터링 (매수/매도) */
  @IsOptional()
  @IsEnum(TransactionType)
  transactionType?: TransactionType;

  /** 거래 상태로 필터링 (대기/완료/취소/실패) */
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  /** 주식 심볼로 필터링 */
  @IsOptional()
  @IsString()
  stockSymbol?: string;

  /** 조회 시작 날짜 (ISO 8601 형식) */
  @IsOptional()
  @IsDateString()
  startDate?: string;

  /** 조회 종료 날짜 (ISO 8601 형식) */
  @IsOptional()
  @IsDateString()
  endDate?: string;

  /** 포트폴리오 ID로 필터링 */
  @IsOptional()
  @IsNumber()
  portfolioId?: number;
}

/**
 * 거래 응답 DTO
 * API 응답으로 사용되는 거래 정보 데이터 전송 객체
 */
export class TransactionResponseDto {
  /** 거래 고유 ID */
  id: number;

  /** 거래를 수행한 사용자 ID */
  userId: number;

  /** 거래가 속한 포트폴리오 ID */
  portfolioId: number;

  /** 거래된 주식의 심볼 */
  stockSymbol: string;

  /** 거래된 주식의 이름 */
  stockName: string;

  /** 거래 타입 (매수/매도) */
  transactionType: TransactionType;

  /** 거래 수량 */
  quantity: number;

  /** 주당 거래 가격 */
  pricePerShare: number;

  /** 거래 총액 (수량 × 주당가격) */
  totalAmount: number;

  /** 거래 수수료 */
  fees: number;

  /** 수수료를 포함한 총 거래액 */
  totalWithFees: number;

  /** 거래 실행 일시 */
  transactionDate: Date;

  /** 거래 상태 */
  status: TransactionStatus;

  /** 거래 메모 */
  notes?: string;

  /** 레코드 생성 일시 */
  createdAt: Date;

  /** 레코드 수정 일시 */
  updatedAt: Date;

  constructor(partial: Partial<TransactionResponseDto>) {
    Object.assign(this, partial);
  }
}

/**
 * 거래 통계 DTO
 * 거래 내역의 통계 정보를 담는 데이터 전송 객체
 */
export class TransactionStatsDto {
  /** 전체 거래 건수 */
  totalTransactions: number;

  /** 매수 거래 건수 */
  totalBuyTransactions: number;

  /** 매도 거래 건수 */
  totalSellTransactions: number;

  /** 전체 거래량 (주식 수량) */
  totalVolume: number;

  /** 전체 거래 금액 */
  totalAmount: number;

  /** 전체 수수료 */
  totalFees: number;

  /** 평균 거래 금액 */
  averageTransactionAmount: number;

  /** 가장 많이 거래된 주식 심볼 */
  mostTradedStock: string;

  /** 가장 많이 거래된 주식의 거래량 */
  mostTradedStockVolume: number;

  constructor(partial: Partial<TransactionStatsDto>) {
    Object.assign(this, partial);
  }
}

/**
 * 거래 분석 DTO
 * 거래 내역의 분석 결과를 담는 데이터 전송 객체
 */
export class TransactionAnalysisDto {
  /** 분석 기간 (예: 30d, 90d, 1y) */
  period: string;

  /** 전체 거래 건수 */
  totalTrades: number;

  /** 수익 거래 건수 */
  winningTrades: number;

  /** 손실 거래 건수 */
  losingTrades: number;

  /** 승률 (수익 거래 / 전체 거래) */
  winRate: number;

  /** 평균 수익 */
  averageProfit: number;

  /** 평균 손실 */
  averageLoss: number;

  /** 총 수익 */
  totalProfit: number;

  /** 총 손실 */
  totalLoss: number;

  /** 순 수익 (총 수익 - 총 손실) */
  netProfit: number;

  /** 수익 팩터 (총 수익 / 총 손실) */
  profitFactor: number;

  /** 최대 수익 거래 */
  largestWin: number;

  /** 최대 손실 거래 */
  largestLoss: number;

  /** 평균 보유 기간 (일) */
  averageHoldingPeriod: number;

  constructor(partial: Partial<TransactionAnalysisDto>) {
    Object.assign(this, partial);
  }
} 