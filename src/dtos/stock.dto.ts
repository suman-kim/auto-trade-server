import { IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 주식 가격 데이터 DTO
 */
export class StockPriceDto {
  @ApiProperty({
    description: '주식 심볼',
    example: 'TSLA',
    type: String,
  })
  @IsString()
  symbol: string;

  @ApiProperty({
    description: '시가',
    example: 250.50,
    type: Number,
  })
  @IsNumber()
  open: number;

  @ApiProperty({
    description: '고가',
    example: 255.75,
    type: Number,
  })
  @IsNumber()
  high: number;

  @ApiProperty({
    description: '저가',
    example: 248.25,
    type: Number,
  })
  @IsNumber()
  low: number;

  @ApiProperty({
    description: '종가',
    example: 252.00,
    type: Number,
  })
  @IsNumber()
  close: number;

  @ApiProperty({
    description: '거래량',
    example: 15000000,
    type: Number,
  })
  @IsNumber()
  volume: number;

  @ApiProperty({
    description: '날짜',
    example: '2024-01-01',
    type: String,
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: '가격 변화',
    example: 2.50,
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  change?: number;

  @ApiProperty({
    description: '가격 변화율 (%)',
    example: 1.0,
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  changePercent?: number;
}

/**
 * 주식 정보 DTO
 */
export class StockInfoDto {
  @IsString()
  symbol: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  sector?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  exchange?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @IsOptional()
  marketCap?: number;

  @IsNumber()
  @IsOptional()
  peRatio?: number;

  @IsNumber()
  @IsOptional()
  dividendYield?: number;
}

/**
 * 주식 검색 요청 DTO
 */
export class StockSearchDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}

/**
 * 주식 가격 업데이트 요청 DTO
 */
export class StockPriceUpdateDto {
  @IsString()
  symbol: string;

  @IsEnum(['realtime', 'daily', 'weekly', 'monthly'])
  interval: 'realtime' | 'daily' | 'weekly' | 'monthly';
}

/**
 * 주식 가격 응답 DTO
 */
export class StockPriceResponseDto {
  symbol: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high: number;
  low: number;
  open: number;
  timestamp: Date;

  constructor(data: any) {
    this.symbol = data.symbol;
    this.currentPrice = data.currentPrice;
    this.previousClose = data.previousClose;
    this.change = data.change;
    this.changePercent = data.changePercent;
    this.volume = data.volume;
    this.marketCap = data.marketCap;
    this.high = data.high;
    this.low = data.low;
    this.open = data.open;
    this.timestamp = data.timestamp;
  }
}

/**
 * 주식 히스토리 데이터 응답 DTO
 */
export class StockHistoryResponseDto {
  symbol: string;
  prices: StockPriceDto[];
  period: string;
  lastUpdated: Date;

  constructor(symbol: string, prices: StockPriceDto[], period: string) {
    this.symbol = symbol;
    this.prices = prices;
    this.period = period;
    this.lastUpdated = new Date();
  }
}

/**
 * 주식 알림 설정 DTO
 */
export class StockAlertDto {
  @IsString()
  symbol: string;

  @IsNumber()
  targetPrice: number;

  @IsEnum(['above', 'below'])
  condition: 'above' | 'below';

  @IsOptional()
  @IsString()
  message?: string;
}

/**
 * 주식 통계 DTO
 */
export class StockStatsDto {
  symbol: string;
  avgPrice: number;
  maxPrice: number;
  minPrice: number;
  totalVolume: number;
  priceVolatility: number;
  period: string;

  constructor(data: any) {
    this.symbol = data.symbol;
    this.avgPrice = data.avgPrice;
    this.maxPrice = data.maxPrice;
    this.minPrice = data.minPrice;
    this.totalVolume = data.totalVolume;
    this.priceVolatility = data.priceVolatility;
    this.period = data.period;
  }
} 