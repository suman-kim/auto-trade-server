import { IsString, IsNumber, IsOptional, IsDateString, IsEnum, IsPositive, Min, Max } from 'class-validator';

/**
 * 포트폴리오 생성 DTO
 * 새로운 포트폴리오 생성을 위한 데이터 전송 객체
 */
export class CreatePortfolioDto {
  /** 포트폴리오 이름 */
  @IsString()
  name: string;

  /** 포트폴리오 설명 (선택사항) */
  @IsString()
  @IsOptional()
  description?: string;
}

/**
 * 포트폴리오 업데이트 DTO
 * 기존 포트폴리오 정보 수정을 위한 데이터 전송 객체
 */
export class UpdatePortfolioDto {
  /** 포트폴리오 이름 (선택사항) */
  @IsString()
  @IsOptional()
  name?: string;

  /** 포트폴리오 설명 (선택사항) */
  @IsString()
  @IsOptional()
  description?: string;
 
}

/**
 * 포트폴리오 보유량 추가 DTO
 * 포트폴리오에 새로운 주식 보유량을 추가하기 위한 데이터 전송 객체
 */
export class AddHoldingDto {
  /** 주식 심볼 (예: TSLA, AAPL) */
  @IsString()
  symbol: string;

  /** 보유 주식 수량 */
  @IsNumber()
  @IsPositive()
  quantity: number;

  /** 평균 매수가 */
  @IsNumber()
  @IsPositive()
  averagePrice: number;

  /** 매수 날짜 (선택사항) */
  @IsDateString()
  @IsOptional()
  purchaseDate?: string;

  /** 메모 또는 참고사항 (선택사항) */
  @IsString()
  @IsOptional()
  notes?: string;
}

/**
 * 포트폴리오 보유량 업데이트 DTO
 * 기존 보유량 정보 수정을 위한 데이터 전송 객체
 */
export class UpdateHoldingDto {
  /** 보유 주식 수량 (선택사항) */
  @IsNumber()
  @IsOptional()
  @IsPositive()
  quantity?: number;

  /** 평균 매수가 (선택사항) */
  @IsNumber()
  @IsOptional()
  @IsPositive()
  averagePrice?: number;

  /** 메모 또는 참고사항 (선택사항) */
  @IsString()
  @IsOptional()
  notes?: string;
}

/**
 * 포트폴리오 응답 DTO
 * API 응답으로 사용되는 포트폴리오 정보 데이터 전송 객체
 */
export class PortfolioResponseDto {
  /** 포트폴리오 고유 ID */
  @IsNumber()
  id: number;

  /** 포트폴리오 이름 */
  @IsString()
  name: string;

  /** 포트폴리오 설명 */
  @IsString()
  @IsOptional()
  description?: string;

  /** 위험 수준 */
  @IsString()
  @IsOptional()
  riskLevel?: string;

  /** 목표 수익률 (%) */
  @IsNumber()
  @IsOptional()
  targetReturn?: number;

  /** 포트폴리오 총 가치 */
  @IsNumber()
  totalValue: number;

  /** 포트폴리오 총 투자 비용 */
  @IsNumber()
  totalCost: number;

  /** 총 수익 (절대값) */
  @IsNumber()
  totalReturn: number;

  /** 총 수익률 (%) */
  @IsNumber()
  totalReturnPercent: number;

  /** 보유 주식 종목 수 */
  @IsNumber()
  holdingsCount: number;

  /** 포트폴리오 생성 일시 */
  @IsDateString()
  createdAt: string;

  /** 포트폴리오 수정 일시 */
  @IsDateString()
  updatedAt: string;
}

/**
 * 포트폴리오 보유량 응답 DTO
 * API 응답으로 사용되는 보유량 정보 데이터 전송 객체
 */
export class PortfolioHoldingResponseDto {
  /** 보유량 고유 ID */
  @IsNumber()
  id: number;

  /** 주식 심볼 */
  @IsString()
  symbol: string;

  /** 회사명 */
  @IsString()
  companyName: string;

  /** 보유 주식 수량 */
  @IsNumber()
  quantity: number;

  /** 평균 매수가 */
  @IsNumber()
  averagePrice: number;

  /** 현재 주가 */
  @IsNumber()
  currentPrice: number;

  /** 시장 가치 (수량 × 현재가) */
  @IsNumber()
  marketValue: number;

  /** 총 투자 비용 (수량 × 평균 매수가) */
  @IsNumber()
  totalCost: number;

  /** 미실현 손익 (절대값) */
  @IsNumber()
  unrealizedGain: number;

  /** 미실현 손익률 (%) */
  @IsNumber()
  unrealizedGainPercent: number;

  /** 매수 날짜 */
  @IsDateString()
  purchaseDate: string;

  /** 메모 또는 참고사항 */
  @IsString()
  @IsOptional()
  notes?: string;

  /** 보유량 생성 일시 */
  @IsDateString()
  createdAt: string;

  /** 보유량 수정 일시 */
  @IsDateString()
  updatedAt: string;
}

/**
 * 포트폴리오 요약 DTO
 * 포트폴리오 목록에서 사용되는 간단한 요약 정보 데이터 전송 객체
 */
export class PortfolioSummaryDto {
  /** 포트폴리오 고유 ID */
  @IsNumber()
  id: number;

  /** 포트폴리오 이름 */
  @IsString()
  name: string;

  /** 포트폴리오 총 가치 */
  @IsNumber()
  totalValue: number;

  /** 포트폴리오 총 투자 비용 */
  @IsNumber()
  totalCost: number;

  /** 총 수익 (절대값) */
  @IsNumber()
  totalReturn: number;

  /** 총 수익률 (%) */
  @IsNumber()
  totalReturnPercent: number;

  /** 보유 주식 종목 수 */
  @IsNumber()
  holdingsCount: number;

  /** 마지막 업데이트 일시 */
  @IsDateString()
  lastUpdated: string;
}

/**
 * 포트폴리오 성과 분석 DTO
 * 포트폴리오 성과 분석 결과를 위한 데이터 전송 객체
 */
export class PortfolioPerformanceDto {
  /** 포트폴리오 고유 ID */
  @IsNumber()
  portfolioId: number;

  /** 포트폴리오 이름 */
  @IsString()
  portfolioName: string;

  /** 포트폴리오 총 가치 */
  @IsNumber()
  totalValue: number;

  /** 포트폴리오 총 투자 비용 */
  @IsNumber()
  totalCost: number;

  /** 총 수익 (절대값) */
  @IsNumber()
  totalReturn: number;

  /** 총 수익률 (%) */
  @IsNumber()
  totalReturnPercent: number;

  /** 일간 수익 (절대값) */
  @IsNumber()
  dailyReturn: number;

  /** 일간 수익률 (%) */
  @IsNumber()
  dailyReturnPercent: number;

  /** 주간 수익 (절대값) */
  @IsNumber()
  weeklyReturn: number;

  /** 주간 수익률 (%) */
  @IsNumber()
  weeklyReturnPercent: number;

  /** 월간 수익 (절대값) */
  @IsNumber()
  monthlyReturn: number;

  /** 월간 수익률 (%) */
  @IsNumber()
  monthlyReturnPercent: number;

  /** 연간 수익 (절대값) */
  @IsNumber()
  yearlyReturn: number;

  /** 연간 수익률 (%) */
  @IsNumber()
  yearlyReturnPercent: number;

  /** 샤프 비율 (위험 대비 수익률) */
  @IsNumber()
  sharpeRatio: number;

  /** 최대 손실폭 (%) */
  @IsNumber()
  maxDrawdown: number;

  /** 변동성 (%) */
  @IsNumber()
  volatility: number;

  /** 마지막 업데이트 일시 */
  @IsDateString()
  lastUpdated: string;
}

/**
 * 포트폴리오 리밸런싱 DTO
 * 포트폴리오 리밸런싱을 위한 데이터 전송 객체
 */
export class RebalancePortfolioDto {
  /** 주식 심볼 */
  @IsString()
  symbol: string;

  /** 목표 비중 (%) */
  @IsNumber()
  @IsPositive()
  targetPercentage: number;

  /** 메모 또는 참고사항 (선택사항) */
  @IsString()
  @IsOptional()
  notes?: string;
}

/**
 * 포트폴리오 내보내기 DTO
 * 포트폴리오 데이터 내보내기를 위한 데이터 전송 객체
 */
export class ExportPortfolioDto {
  /** 내보내기 형식 (CSV, PDF, JSON) */
  @IsString()
  @IsEnum(['csv', 'pdf', 'json'])
  format: 'csv' | 'pdf' | 'json';

  /** 시작 날짜 (선택사항) */
  @IsDateString()
  @IsOptional()
  startDate?: string;

  /** 종료 날짜 (선택사항) */
  @IsDateString()
  @IsOptional()
  endDate?: string;

  /** 내보낼 데이터 타입 (전체/보유량/거래내역/성과) */
  @IsString()
  @IsOptional()
  @IsEnum(['all', 'holdings', 'transactions', 'performance'])
  dataType?: 'all' | 'holdings' | 'transactions' | 'performance';
} 