import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { StocksService } from './stocks.service';
import { StockPriceUpdateDto, StockSearchDto, StockAlertDto, StockPriceResponseDto, StockHistoryResponseDto, StockStatsDto } from '../../dtos/stock.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { Public } from '../../shared/decorators/public.decorator';

/**
 * 주식 컨트롤러
 * 주식 데이터 관리 API 엔드포인트를 제공합니다.
 */
@ApiTags('stocks')
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  /**
   * 실시간 주식 가격 조회
   * GET /stocks/:symbol/price
   */
  @Get(':symbol/price')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '실시간 주식 가격 조회',
    description: '특정 주식의 실시간 가격 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'symbol',
    description: '주식 심볼',
    example: 'TSLA',
  })
  @ApiResponse({
    status: 200,
    description: '주식 가격 조회 성공',
    type: StockPriceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '주식을 찾을 수 없음',
  })
  async getStockPrice(@Param('symbol') symbol: string) {
    return await this.stocksService.updateStockPrice(symbol);
  }

  /**
   * 주식 정보 조회
   * GET /stocks/:symbol
   */
  @Get(':symbol')
  @Public()
  @HttpCode(HttpStatus.OK)
  async getStockInfo(@Param('symbol') symbol: string) {
    return await this.stocksService.getStockInfo(symbol);
  }

  /**
   * 모든 주식 정보 조회
   * GET /stocks
   */
  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  async getAllStocks() {
    return await this.stocksService.getAllStocks();
  }

  /**
   * 주식 히스토리 데이터 조회
   * GET /stocks/:symbol/history
   */
  @Get(':symbol/history')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '주식 히스토리 데이터 조회',
    description: '특정 주식의 과거 가격 데이터를 조회합니다.',
  })
  @ApiParam({
    name: 'symbol',
    description: '주식 심볼',
    example: 'TSLA',
  })
  @ApiQuery({
    name: 'days',
    description: '조회할 일수',
    example: '30',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: '주식 히스토리 조회 성공',
    type: StockHistoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '주식을 찾을 수 없음',
  })
  async getStockHistory(
    @Param('symbol') symbol: string,
    @Query('days') days: string = '30',
  ) {
    const daysNumber = parseInt(days, 10);
    return await this.stocksService.getStockHistory(symbol, daysNumber);
  }

  /**
   * 주식 검색
   * GET /stocks/search
   */
  @Get('search')
  @Public()
  @HttpCode(HttpStatus.OK)
  async searchStocks(@Query() searchDto: StockSearchDto) {
    return await this.stocksService.searchStocks(searchDto.query, searchDto.limit);
  }

  /**
   * 주식 통계 조회
   * GET /stocks/:symbol/stats
   */
  @Get(':symbol/stats')
  @Public()
  @HttpCode(HttpStatus.OK)
  async getStockStats(@Param('symbol') symbol: string,@Query('days') days: string = '30') {
    const daysNumber = parseInt(days, 10);
    return await this.stocksService.getStockStats(symbol, daysNumber);
  }

  /**
   * 주식 가격 수동 업데이트
   * POST /stocks/:symbol/update
   */
  @Post(':symbol/update')
  @HttpCode(HttpStatus.OK)
  async updateStockPrice(
    @Param('symbol') symbol: string,
    @Body() updateDto: StockPriceUpdateDto,
  ) {
    return await this.stocksService.updateStockPrice(symbol);
  }

  /**
   * 여러 주식 가격 일괄 업데이트
   * POST /stocks/batch-update
   */
  @Post('batch-update')
  @HttpCode(HttpStatus.OK)
  async updateMultipleStocks(@Body() symbols: string[]) {
    return await this.stocksService.updateMultipleStocks(symbols);
  }

  /**
   * 주식 가격 조건 확인
   * POST /stocks/:symbol/check-condition
   */
  @Post(':symbol/check-condition')
  @HttpCode(HttpStatus.OK)
  async checkPriceCondition(
    @Param('symbol') symbol: string,
    @Body() alertDto: StockAlertDto,
  ) {
    return await this.stocksService.checkPriceCondition(
      symbol,
      alertDto.targetPrice,
      alertDto.condition,
    );
  }

  /**
   * 주식 가격 변화율 조회
   * GET /stocks/:symbol/change-percent
   */
  @Get(':symbol/change-percent')
  @Public()
  @HttpCode(HttpStatus.OK)
  async getPriceChangePercent(
    @Param('symbol') symbol: string,
    @Query('days') days: string = '1',
  ) {
    const daysNumber = parseInt(days, 10);
    const changePercent = await this.stocksService.getPriceChangePercent(symbol, daysNumber);
    return {
      symbol,
      changePercent,
      days: daysNumber,
    };
  }

  /**
   * 주식 정보 삭제
   * DELETE /stocks/:symbol
   */
  @Delete(':symbol')
  @HttpCode(HttpStatus.OK)
  async deleteStock(@Param('symbol') symbol: string) {
    await this.stocksService.deleteStock(symbol);
    return { message: `${symbol} 주식 정보가 삭제되었습니다.` };
  }

  /**
   * 테슬라 주식 가격 조회 (특별 엔드포인트)
   * GET /stocks/tesla/price
   */
  @Get('tesla/price')
  @Public()
  @HttpCode(HttpStatus.OK)
  async getTeslaPrice() {
    return await this.stocksService.updateStockPrice('TSLA');
  }

  /**
   * 테슬라 주식 히스토리 조회 (특별 엔드포인트)
   * GET /stocks/tesla/history
   */
  @Get('tesla/history')
  @Public()
  @HttpCode(HttpStatus.OK)
  async getTeslaHistory(@Query('days') days: string = '30') {
    const daysNumber = parseInt(days, 10);
    return await this.stocksService.getStockHistory('TSLA', daysNumber);
  }

  /**
   * 테슬라 주식 통계 조회 (특별 엔드포인트)
   * GET /stocks/tesla/stats
   */
  @Get('tesla/stats')
  @Public()
  @HttpCode(HttpStatus.OK)
  async getTeslaStats(@Query('days') days: string = '30') {
    const daysNumber = parseInt(days, 10);
    return await this.stocksService.getStockStats('TSLA', daysNumber);
  }
} 