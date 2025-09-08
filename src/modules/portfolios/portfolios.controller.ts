import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  HttpCode, 
  HttpStatus,
  ParseIntPipe,
  Query
} from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { PortfolioReturnsService } from './portfolio-returns.service';
import { 
  CreatePortfolioDto, 
  UpdatePortfolioDto, 
  AddHoldingDto, 
  UpdateHoldingDto 
} from '../../dtos/portfolio.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

/**
 * 포트폴리오 컨트롤러
 * 사용자별 포트폴리오 관리 API 엔드포인트를 제공합니다.
 */
@Controller('portfolios')
export class PortfoliosController {
  constructor(
    private readonly portfoliosService: PortfoliosService,
    private readonly portfolioReturnsService: PortfolioReturnsService,
  ) {}

  /**
   * 사용자의 포트폴리오 목록을 조회합니다.
   * GET /portfolios
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUserPortfolios(@CurrentUser() user: User) {
    return await this.portfoliosService.getUserPortfolios(user.id);
  }

  /**
   * 포트폴리오를 생성합니다.
   * POST /portfolios
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPortfolio(
    @CurrentUser() user: User,
    @Body() createPortfolioDto: CreatePortfolioDto
  ) {
    return await this.portfoliosService.createPortfolio(user.id, createPortfolioDto);
  }

  /**
   * 포트폴리오 상세 정보를 조회합니다.
   * GET /portfolios/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPortfolio(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) portfolioId: number
  ) {
    return await this.portfoliosService.getPortfolio(user.id, portfolioId);
  }

  /**
   * 포트폴리오를 업데이트합니다.
   * PUT /portfolios/:id
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updatePortfolio(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) portfolioId: number,
    @Body() updatePortfolioDto: UpdatePortfolioDto
  ) {
    return await this.portfoliosService.updatePortfolio(user.id, portfolioId, updatePortfolioDto);
  }

  /**
   * 포트폴리오를 삭제합니다.
   * DELETE /portfolios/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePortfolio(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) portfolioId: number
  ) {
    await this.portfoliosService.deletePortfolio(user.id, portfolioId);
  }

  /**
   * 포트폴리오 보유량 목록을 조회합니다.
   * GET /portfolios/:id/holdings
   */
  @Get(':id/holdings')
  @HttpCode(HttpStatus.OK)
  async getPortfolioHoldings(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) portfolioId: number
  ) {
    return await this.portfoliosService.getPortfolioHoldings(user.id, portfolioId);
  }

  /**
   * 포트폴리오에 보유량을 추가합니다.
   * POST /portfolios/:id/holdings
   */
  // @Post(':id/holdings')
  // @HttpCode(HttpStatus.CREATED)
  // async addHolding(
  //   @CurrentUser() user: User,
  //   @Param('id', ParseIntPipe) portfolioId: number,
  //   @Body() addHoldingDto: AddHoldingDto
  // ) {
  //   return await this.portfoliosService.addHolding(user.id, portfolioId, addHoldingDto);
  // }

  /**
   * 포트폴리오 보유량을 업데이트합니다.
   * PUT /portfolios/:id/holdings/:holdingId
   */
  // @Put(':id/holdings/:holdingId')
  // @HttpCode(HttpStatus.OK)
  // async updateHolding(
  //   @CurrentUser() user: User,
  //   @Param('id', ParseIntPipe) portfolioId: number,
  //   @Param('holdingId', ParseIntPipe) holdingId: number,
  //   @Body() updateHoldingDto: UpdateHoldingDto
  // ) {
  //   return await this.portfoliosService.updateHolding(user.id, portfolioId, holdingId, updateHoldingDto);
  // }

  /**
   * 포트폴리오 보유량을 삭제합니다.
   * DELETE /portfolios/:id/holdings/:holdingId
   */
  @Delete(':id/holdings/:holdingId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeHolding(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) portfolioId: number,
    @Param('holdingId', ParseIntPipe) holdingId: number
  ) {
    await this.portfoliosService.removeHolding(user.id, portfolioId, holdingId);
  }

  /**
   * 포트폴리오 성과 분석을 조회합니다.
   * GET /portfolios/:id/performance
   */
  @Get(':id/performance')
  @HttpCode(HttpStatus.OK)
  async getPortfolioPerformance(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) portfolioId: number
  ) {
    return await this.portfoliosService.getPortfolioPerformance(user.id, portfolioId);
  }

  /**
   * 포트폴리오 수익률을 조회합니다.
   * GET /portfolios/:id/returns
   */
  @Get(':id/returns')
  @HttpCode(HttpStatus.OK)
  async getPortfolioReturns(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) portfolioId: number
  ) {
    return await this.portfolioReturnsService.calculatePortfolioReturns(portfolioId);
  }

  /**
   * 포트폴리오 위험 지표를 조회합니다.
   * GET /portfolios/:id/risk-metrics
   */
  @Get(':id/risk-metrics')
  @HttpCode(HttpStatus.OK)
  async getPortfolioRiskMetrics(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) portfolioId: number
  ) {
    return await this.portfolioReturnsService.calculatePortfolioRiskMetrics(portfolioId);
  }

  /**
   * 포트폴리오를 벤치마크와 비교합니다.
   * GET /portfolios/:id/benchmark-comparison
   */
  @Get(':id/benchmark-comparison')
  @HttpCode(HttpStatus.OK)
  async getBenchmarkComparison(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) portfolioId: number,
    @Query('benchmark') benchmark: string = 'SPY'
  ) {
    return await this.portfolioReturnsService.compareWithBenchmark(portfolioId, benchmark);
  }

  /**
   * 포트폴리오 자산 배분을 분석합니다.
   * GET /portfolios/:id/asset-allocation
   */
  @Get(':id/asset-allocation')
  @HttpCode(HttpStatus.OK)
  async getAssetAllocation(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) portfolioId: number
  ) {
    return await this.portfolioReturnsService.analyzeAssetAllocation(portfolioId);
  }

  /**
   * 포트폴리오 수익률 분포를 분석합니다.
   * GET /portfolios/:id/return-distribution
   */
  @Get(':id/return-distribution')
  @HttpCode(HttpStatus.OK)
  async getReturnDistribution(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) portfolioId: number
  ) {
    return await this.portfolioReturnsService.analyzeReturnDistribution(portfolioId);
  }

  /**
   * 포트폴리오 수익률 추세를 분석합니다.
   * GET /portfolios/:id/return-trends
   */
  @Get(':id/return-trends')
  @HttpCode(HttpStatus.OK)
  async getReturnTrends(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) portfolioId: number
  ) {
    return await this.portfolioReturnsService.analyzeReturnTrends(portfolioId);
  }

  /**
   * 개별 보유량 수익률을 조회합니다.
   * GET /portfolios/:id/holdings/:holdingId/returns
   */
  @Get(':id/holdings/:holdingId/returns')
  @HttpCode(HttpStatus.OK)
  async getHoldingReturns(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) portfolioId: number,
    @Param('holdingId', ParseIntPipe) holdingId: number
  ) {
    return await this.portfolioReturnsService.calculateHoldingReturns(holdingId);
  }
} 