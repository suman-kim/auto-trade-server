import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFilterDto,
  TransactionResponseDto,
  TransactionStatsDto,
  TransactionAnalysisDto,
} from '../../dtos/transaction.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

/**
 * 거래 내역 컨트롤러
 * 거래 내역 관리 및 분석 API를 제공합니다.
 */
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * 새로운 거래를 생성합니다.
   * POST /transactions
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(
    @CurrentUser() user: User,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return await this.transactionsService.createTransaction(user.id, createTransactionDto);
  }

  /**
   * 사용자의 모든 거래 내역을 조회합니다.
   * GET /transactions
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUserTransactions(
    @CurrentUser() user: User,
    @Query() filter: TransactionFilterDto,
  ): Promise<TransactionResponseDto[]> {
    return await this.transactionsService.getUserTransactions(user.id, filter);
  }

  /**
   * 특정 거래를 조회합니다.
   * GET /transactions/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTransaction(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) transactionId: number,
  ): Promise<TransactionResponseDto> {
    return await this.transactionsService.getTransaction(user.id, transactionId);
  }

  /**
   * 거래를 수정합니다.
   * PUT /transactions/:id
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateTransaction(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) transactionId: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return await this.transactionsService.updateTransaction(user.id, transactionId, updateTransactionDto);
  }

  /**
   * 거래를 삭제합니다.
   * DELETE /transactions/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) transactionId: number,
  ): Promise<void> {
    await this.transactionsService.deleteTransaction(user.id, transactionId);
  }

  /**
   * 거래 통계를 조회합니다.
   * GET /transactions/stats
   */
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getTransactionStats(
    @CurrentUser() user: User,
    @Query() filter: TransactionFilterDto,
  ): Promise<TransactionStatsDto> {
    return await this.transactionsService.getTransactionStats(user.id, filter);
  }

  /**
   * 거래 분석을 수행합니다.
   * GET /transactions/analysis
   */
  @Get('analysis')
  @HttpCode(HttpStatus.OK)
  async analyzeTransactions(
    @CurrentUser() user: User,
    @Query('period') period: string = '30d',
  ): Promise<TransactionAnalysisDto> {
    return await this.transactionsService.analyzeTransactions(user.id, period);
  }

  /**
   * 포트폴리오별 거래 내역을 조회합니다.
   * GET /transactions/portfolio/:portfolioId
   */
  @Get('portfolio/:portfolioId')
  @HttpCode(HttpStatus.OK)
  async getPortfolioTransactions(
    @CurrentUser() user: User,
    @Param('portfolioId', ParseIntPipe) portfolioId: number,
    @Query() filter: TransactionFilterDto,
  ): Promise<TransactionResponseDto[]> {
    const portfolioFilter = { ...filter, portfolioId };
    return await this.transactionsService.getUserTransactions(user.id, portfolioFilter);
  }

  /**
   * 주식별 거래 내역을 조회합니다.
   * GET /transactions/stock/:symbol
   */
  @Get('stock/:symbol')
  @HttpCode(HttpStatus.OK)
  async getStockTransactions(
    @CurrentUser() user: User,
    @Param('symbol') symbol: string,
    @Query() filter: TransactionFilterDto,
  ): Promise<TransactionResponseDto[]> {
    const stockFilter = { ...filter, stockSymbol: symbol };
    return await this.transactionsService.getUserTransactions(user.id, stockFilter);
  }

  /**
   * 기간별 거래 내역을 조회합니다.
   * GET /transactions/period
   */
  @Get('period')
  @HttpCode(HttpStatus.OK)
  async getTransactionsByPeriod(
    @CurrentUser() user: User,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query() filter: TransactionFilterDto,
  ): Promise<TransactionResponseDto[]> {
    const periodFilter = { ...filter, startDate, endDate };
    return await this.transactionsService.getUserTransactions(user.id, periodFilter);
  }
} 