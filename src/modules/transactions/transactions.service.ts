import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction, TransactionType, TransactionStatus } from '../../entities/transaction.entity';
import { User } from '../../entities/user.entity';
import { Portfolio } from '../../entities/portfolio.entity';
import { Stock } from '../../entities/stock.entity';
import { TradingStrategy } from '../../entities/trading-strategy.entity';
import { SignalType } from '../../shared/types/trading-strategy.types';
import { TradingSignal } from '../../entities/trading-signal.entity';

import { 
  CreateTransactionDto, 
  UpdateTransactionDto, 
  TransactionFilterDto,
  TransactionResponseDto,
  TransactionStatsDto,
  TransactionAnalysisDto
} from '../../dtos/transaction.dto';

/**
 * 거래 내역 서비스
 * 거래 내역의 CRUD 작업과 분석 기능을 제공합니다.
 */
@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  /**
   * 새로운 거래를 생성합니다.
   */
  async createTransaction(userId: number, createTransactionDto: CreateTransactionDto): Promise<TransactionResponseDto> {
    // 포트폴리오 존재 확인
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: createTransactionDto.portfolioId, userId },
    });

    if (!portfolio) {
      throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
    }

    // 주식 정보 조회 또는 생성
    let stock = await this.stockRepository.findOne({
      where: { symbol: createTransactionDto.stockSymbol.toUpperCase() },
    });

    if (!stock) {
      // 주식 정보가 없으면 기본 정보로 생성
      stock = this.stockRepository.create({
        symbol: createTransactionDto.stockSymbol.toUpperCase(),
        name: createTransactionDto.stockSymbol,
        currentPrice: createTransactionDto.pricePerShare,
      });
      await this.stockRepository.save(stock);
    }

    // 거래 총액 계산
    const totalAmount = createTransactionDto.quantity * createTransactionDto.pricePerShare;
    const fees = createTransactionDto.fees || 0;

    // 거래 생성
    const transaction = this.transactionRepository.create({
      userId,
      portfolioId: createTransactionDto.portfolioId,
      stockId: stock.id,
      transactionType: createTransactionDto.transactionType,
      quantity: createTransactionDto.quantity,
      pricePerShare: createTransactionDto.pricePerShare,
      totalAmount,
      fees,
      notes: createTransactionDto.notes,
      status: TransactionStatus.COMPLETED,
      transactionDate: new Date(),
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    return this.mapToResponseDto(savedTransaction, stock);
  }

  /**
   * 사용자의 모든 거래 내역을 조회합니다.
   */
  async getUserTransactions(userId: number, filter?: TransactionFilterDto): Promise<TransactionResponseDto[]> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.stock', 'stock')
      .where('transaction.userId = :userId', { userId });

    // 필터 적용
    if (filter) {
      if (filter.transactionType) {
        queryBuilder.andWhere('transaction.transactionType = :transactionType', { 
          transactionType: filter.transactionType 
        });
      }

      if (filter.status) {
        queryBuilder.andWhere('transaction.status = :status', { status: filter.status });
      }

      if (filter.stockSymbol) {
        queryBuilder.andWhere('stock.symbol ILIKE :stockSymbol', { 
          stockSymbol: `%${filter.stockSymbol}%` 
        });
      }

      if (filter.portfolioId) {
        queryBuilder.andWhere('transaction.portfolioId = :portfolioId', { 
          portfolioId: filter.portfolioId 
        });
      }

      if (filter.startDate && filter.endDate) {
        queryBuilder.andWhere('transaction.transactionDate BETWEEN :startDate AND :endDate', {
          startDate: filter.startDate,
          endDate: filter.endDate,
        });
      }
    }

    // 최신 거래부터 정렬
    queryBuilder.orderBy('transaction.transactionDate', 'DESC');

    const transactions = await queryBuilder.getMany();
    return transactions.map(transaction => this.mapToResponseDto(transaction, transaction.stock));
  }

  /**
   * 특정 거래를 조회합니다.
   */
  async getTransaction(userId: number, transactionId: number): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId, userId },
      relations: ['stock'],
    });

    if (!transaction) {
      throw new NotFoundException('거래 내역을 찾을 수 없습니다.');
    }

    return this.mapToResponseDto(transaction, transaction.stock);
  }

  /**
   * 거래를 수정합니다.
   */
  async updateTransaction(userId: number, transactionId: number, updateTransactionDto: UpdateTransactionDto): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId, userId },
      relations: ['stock'],
    });

    if (!transaction) {
      throw new NotFoundException('거래 내역을 찾을 수 없습니다.');
    }

    // 완료된 거래는 수정 불가
    if (transaction.status === TransactionStatus.COMPLETED) {
      throw new BadRequestException('완료된 거래는 수정할 수 없습니다.');
    }

    // 업데이트
    Object.assign(transaction, updateTransactionDto);
    const updatedTransaction = await this.transactionRepository.save(transaction);

    return this.mapToResponseDto(updatedTransaction, transaction.stock);
  }

  /**
   * 거래를 삭제합니다.
   */
  async deleteTransaction(userId: number, transactionId: number): Promise<void> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId, userId },
    });

    if (!transaction) {
      throw new NotFoundException('거래 내역을 찾을 수 없습니다.');
    }

    // 완료된 거래는 삭제 불가
    if (transaction.status === TransactionStatus.COMPLETED) {
      throw new BadRequestException('완료된 거래는 삭제할 수 없습니다.');
    }

    await this.transactionRepository.remove(transaction);
  }

  /**
   * 거래 통계를 조회합니다.
   */
  async getTransactionStats(userId: number, filter?: TransactionFilterDto): Promise<TransactionStatsDto> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.stock', 'stock')
      .where('transaction.userId = :userId', { userId });

    // 필터 적용
    if (filter) {
      if (filter.transactionType) {
        queryBuilder.andWhere('transaction.transactionType = :transactionType', { 
          transactionType: filter.transactionType 
        });
      }

      if (filter.status) {
        queryBuilder.andWhere('transaction.status = :status', { status: filter.status });
      }

      if (filter.stockSymbol) {
        queryBuilder.andWhere('stock.symbol ILIKE :stockSymbol', { 
          stockSymbol: `%${filter.stockSymbol}%` 
        });
      }

      if (filter.portfolioId) {
        queryBuilder.andWhere('transaction.portfolioId = :portfolioId', { 
          portfolioId: filter.portfolioId 
        });
      }

      if (filter.startDate && filter.endDate) {
        queryBuilder.andWhere('transaction.transactionDate BETWEEN :startDate AND :endDate', {
          startDate: filter.startDate,
          endDate: filter.endDate,
        });
      }
    }

    const transactions = await queryBuilder.getMany();

    // 통계 계산
    const totalTransactions = transactions.length;
    const totalBuyTransactions = transactions.filter(t => t.transactionType === TransactionType.BUY).length;
    const totalSellTransactions = transactions.filter(t => t.transactionType === TransactionType.SELL).length;
    const totalVolume = transactions.reduce((sum, t) => sum + t.quantity, 0);
    const totalAmount = transactions.reduce((sum, t) => sum + Number(t.totalAmount), 0);
    const totalFees = transactions.reduce((sum, t) => sum + Number(t.fees), 0);
    const averageTransactionAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

    // 가장 많이 거래된 주식
    const stockVolumeMap = new Map<string, number>();
    transactions.forEach(t => {
      const symbol = t.stock.symbol;
      stockVolumeMap.set(symbol, (stockVolumeMap.get(symbol) || 0) + t.quantity);
    });

    let mostTradedStock = '';
    let mostTradedStockVolume = 0;
    stockVolumeMap.forEach((volume, symbol) => {
      if (volume > mostTradedStockVolume) {
        mostTradedStock = symbol;
        mostTradedStockVolume = volume;
      }
    });

    return new TransactionStatsDto({
      totalTransactions,
      totalBuyTransactions,
      totalSellTransactions,
      totalVolume,
      totalAmount,
      totalFees,
      averageTransactionAmount,
      mostTradedStock,
      mostTradedStockVolume,
    });
  }

  /**
   * 거래 분석을 수행합니다.
   */
  async analyzeTransactions(userId: number, period: string = '30d'): Promise<TransactionAnalysisDto> {
    const endDate = new Date();
    let startDate = new Date();

    // 기간 설정
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    const transactions = await this.transactionRepository.find({
      where: {
        userId,
        transactionDate: Between(startDate, endDate),
        status: TransactionStatus.COMPLETED,
      },
      relations: ['stock'],
      order: { transactionDate: 'ASC' },
    });

    // 매수/매도 쌍을 찾아 수익성 분석
    const trades = this.pairBuySellTransactions(transactions);
    
    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => t.profit > 0).length;
    const losingTrades = trades.filter(t => t.profit < 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    const profits = trades.filter(t => t.profit > 0).map(t => t.profit);
    const losses = trades.filter(t => t.profit < 0).map(t => Math.abs(t.profit));

    const averageProfit = profits.length > 0 ? profits.reduce((sum, p) => sum + p, 0) / profits.length : 0;
    const averageLoss = losses.length > 0 ? losses.reduce((sum, l) => sum + l, 0) / losses.length : 0;
    const totalProfit = profits.reduce((sum, p) => sum + p, 0);
    const totalLoss = losses.reduce((sum, l) => sum + l, 0);
    const netProfit = totalProfit - totalLoss;
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : 0;

    const largestWin = profits.length > 0 ? Math.max(...profits) : 0;
    const largestLoss = losses.length > 0 ? Math.max(...losses) : 0;

    // 평균 보유 기간 계산
    const holdingPeriods = trades.map(t => {
      const buyDate = new Date(t.buyTransaction.transactionDate);
      const sellDate = new Date(t.sellTransaction.transactionDate);
      return (sellDate.getTime() - buyDate.getTime()) / (1000 * 60 * 60 * 24); // 일 단위
    });
    const averageHoldingPeriod = holdingPeriods.length > 0 
      ? holdingPeriods.reduce((sum, p) => sum + p, 0) / holdingPeriods.length 
      : 0;

    return new TransactionAnalysisDto({
      period,
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      averageProfit,
      averageLoss,
      totalProfit,
      totalLoss,
      netProfit,
      profitFactor,
      largestWin,
      largestLoss,
      averageHoldingPeriod,
    });
  }

  /**
   * 매수/매도 거래를 쌍으로 만들어 수익성 분석을 위한 데이터를 생성합니다.
   */
  private pairBuySellTransactions(transactions: Transaction[]): Array<{
    buyTransaction: Transaction;
    sellTransaction: Transaction;
    profit: number;
  }> {
    const trades: Array<{
      buyTransaction: Transaction;
      sellTransaction: Transaction;
      profit: number;
    }> = [];
    const buyTransactions = transactions.filter(t => t.transactionType === TransactionType.BUY);
    const sellTransactions = transactions.filter(t => t.transactionType === TransactionType.SELL);

    // 같은 주식의 매수/매도 쌍을 찾습니다
    for (const buy of buyTransactions) {
      const matchingSells = sellTransactions.filter(sell => 
        sell.stockId === buy.stockId && 
        sell.transactionDate > buy.transactionDate
      );

      for (const sell of matchingSells) {
        const profit = (Number(sell.pricePerShare) - Number(buy.pricePerShare)) * Math.min(buy.quantity, sell.quantity);
        trades.push({
          buyTransaction: buy,
          sellTransaction: sell,
          profit,
        });
      }
    }

    return trades;
  }

  /**
   * 자동매매 거래를 생성합니다.
   * 실시간 엔진에서 호출되는 메서드입니다.
   */
  async createAutoTradingTransaction(
    strategy: TradingStrategy,
    stock: Stock,
    signal: TradingSignal,
    quantity: number,
    orderResult: { success: boolean; orderId?: string; error?: string }
  ): Promise<Transaction> {
    try {
      this.logger.log(`자동매매 거래 생성: ${signal.signalType} ${stock.symbol} ${quantity}주`);

      // 사용자의 기본 포트폴리오 조회 (실제로는 전략별 포트폴리오 설정 필요)
      const portfolio = await this.portfolioRepository.findOne({
        where: { userId: strategy.userId },
        order: { createdAt: 'ASC' }, // 가장 오래된 포트폴리오 사용
      });

      if (!portfolio) {
        throw new NotFoundException(`사용자 ${strategy.userId}의 포트폴리오를 찾을 수 없습니다.`);
      }

      // 거래 총액 계산
      const totalAmount = signal.price * quantity;
      const fees = this.calculateTradingFees(totalAmount); // 수수료 계산

      // 거래 생성
      const transaction = this.transactionRepository.create({
        userId: strategy.userId,
        portfolioId: portfolio.id,
        stockId: stock.id,
        transactionType: signal.signalType === SignalType.BUY ? 'BUY' : 'SELL',
        quantity: quantity,
        pricePerShare: signal.price,
        totalAmount: totalAmount,
        fees: fees,
        transactionDate: new Date(),
        status: orderResult.success ? TransactionStatus.COMPLETED : TransactionStatus.FAILED,
        notes: `자동매매 주문 (전략: ${strategy.name}, 주문ID: ${orderResult.orderId || 'N/A'})`,
      });

      const savedTransaction = await this.transactionRepository.save(transaction);
      
      this.logger.log(`자동매매 거래 저장 완료: ID ${savedTransaction.id}, ${signal.signalType} ${stock.symbol} ${quantity}주`);
      
      return savedTransaction;

    } catch (error) {
      this.logger.error('자동매매 거래 생성 오류:', error);
      throw error;
    }
  }

  /**
   * 거래 수수료를 계산합니다.
   * @param totalAmount 거래 총액
   * @returns 계산된 수수료
   */
  private calculateTradingFees(totalAmount: number): number {
    // 해외주식 거래 수수료 계산 (예시)
    // 실제로는 거래소별, 증권사별 수수료 정책에 따라 계산
    const baseFee = 0.001; // 0.1% 기본 수수료
    const minFee = 1.0; // 최소 수수료 $1
    const maxFee = 50.0; // 최대 수수료 $50
    
    const calculatedFee = totalAmount * baseFee;
    return Math.max(minFee, Math.min(calculatedFee, maxFee));
  }

  /**
   * 전략별 거래 통계를 조회합니다.
   */
  async getStrategyTransactionStats(strategyId: number): Promise<{
    totalTrades: number;
    buyTrades: number;
    sellTrades: number;
    totalVolume: number;
    totalFees: number;
    averagePrice: number;
    lastTradeDate: Date | null;
  }> {
    try {
      const transactions = await this.transactionRepository.find({
        where: {
          notes: `%자동매매 주문 (전략: ${strategyId}%` as any, // LIKE 검색을 위한 임시 방법
        },
        order: { transactionDate: 'DESC' },
      });

      const totalTrades = transactions.length;
      const buyTrades = transactions.filter(t => t.transactionType === 'BUY').length;
      const sellTrades = transactions.filter(t => t.transactionType === 'SELL').length;
      const totalVolume = transactions.reduce((sum, t) => sum + t.quantity, 0);
      const totalFees = transactions.reduce((sum, t) => sum + Number(t.fees), 0);
      const averagePrice = totalTrades > 0 
        ? transactions.reduce((sum, t) => sum + Number(t.pricePerShare), 0) / totalTrades 
        : 0;
      const lastTradeDate = totalTrades > 0 ? transactions[0].transactionDate : null;

      return {
        totalTrades,
        buyTrades,
        sellTrades,
        totalVolume,
        totalFees,
        averagePrice: Math.round(averagePrice * 100) / 100,
        lastTradeDate,
      };

    } catch (error) {
      this.logger.error('전략별 거래 통계 조회 오류:', error);
      return {
        totalTrades: 0,
        buyTrades: 0,
        sellTrades: 0,
        totalVolume: 0,
        totalFees: 0,
        averagePrice: 0,
        lastTradeDate: null,
      };
    }
  }

  /**
   * 거래 엔티티를 응답 DTO로 변환합니다.
   */
  private mapToResponseDto(transaction: Transaction, stock: Stock): TransactionResponseDto {
    return new TransactionResponseDto({
      id: transaction.id,
      userId: transaction.userId,
      portfolioId: transaction.portfolioId,
      stockSymbol: stock.symbol,
      stockName: stock.name,
      transactionType: transaction.transactionType as TransactionType,
      quantity: transaction.quantity,
      pricePerShare: Number(transaction.pricePerShare),
      totalAmount: Number(transaction.totalAmount),
      fees: Number(transaction.fees),
      totalWithFees: Number(transaction.totalAmount) + Number(transaction.fees),
      transactionDate: transaction.transactionDate,
      status: transaction.status as TransactionStatus,
      notes: transaction.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
} 