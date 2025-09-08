import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from '../../entities/portfolio.entity';
import { PortfolioHolding } from '../../entities/portfolio-holding.entity';
import { Stock } from '../../entities/stock.entity';
import { StocksService } from '../stocks/stocks.service';

/**
 * 포트폴리오 수익률 계산 서비스
 * 포트폴리오와 개별 주식의 수익률을 계산하고 분석하는 기능을 제공합니다.
 */
@Injectable()
export class PortfolioReturnsService {
  private readonly logger = new Logger(PortfolioReturnsService.name);

  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    @InjectRepository(PortfolioHolding)
    private readonly holdingRepository: Repository<PortfolioHolding>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    private readonly stocksService: StocksService,
  ) {}

  /**
   * 포트폴리오 전체 수익률을 계산합니다.
   */
  async calculatePortfolioReturns(portfolioId: number): Promise<{
    totalValue: number;
    totalCost: number;
    totalReturn: number;
    totalReturnPercent: number;
    unrealizedGain: number;
    unrealizedGainPercent: number;
  }> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId },
      relations: ['holdings', 'holdings.stock'],
    });

    if (!portfolio) {
      throw new Error('포트폴리오를 찾을 수 없습니다.');
    }

    let totalValue = 0;
    let totalCost = 0;

    for (const holding of portfolio.holdings) {
      const currentPrice = await this.stocksService.getCurrentPrice(holding.stock.symbol);
      const marketValue = holding.quantity * currentPrice;
      const cost = holding.quantity * holding.averagePrice;

      totalValue += marketValue;
      totalCost += cost;
    }

    const totalReturn = totalValue - totalCost;
    const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

    return {
      totalValue,
      totalCost,
      totalReturn,
      totalReturnPercent,
      unrealizedGain: totalReturn,
      unrealizedGainPercent: totalReturnPercent,
    };
  }

  /**
   * 개별 주식 수익률을 계산합니다.
   */
  async calculateHoldingReturns(holdingId: number): Promise<{
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    marketValue: number;
    totalCost: number;
    unrealizedGain: number;
    unrealizedGainPercent: number;
    returnRate: number;
  }> {
    const holding = await this.holdingRepository.findOne({
      where: { id: holdingId },
      relations: ['stock'],
    });

    if (!holding) {
      throw new Error('보유량을 찾을 수 없습니다.');
    }

    const currentPrice = await this.stocksService.getCurrentPrice(holding.stock.symbol);
    const marketValue = holding.quantity * currentPrice;
    const totalCost = holding.quantity * holding.averagePrice;
    const unrealizedGain = marketValue - totalCost;
    const unrealizedGainPercent = totalCost > 0 ? (unrealizedGain / totalCost) * 100 : 0;

    return {
      symbol: holding.stock.symbol,
      quantity: holding.quantity,
      averagePrice: holding.averagePrice,
      currentPrice,
      marketValue,
      totalCost,
      unrealizedGain,
      unrealizedGainPercent,
      returnRate: unrealizedGainPercent,
    };
  }

  /**
   * 포트폴리오의 위험 지표를 계산합니다.
   */
  async calculatePortfolioRiskMetrics(portfolioId: number): Promise<{
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    beta: number;
    alpha: number;
  }> {
    // 실제 구현에서는 히스토리 데이터가 필요하지만, 
    // 현재는 모의 데이터로 계산합니다.
    
    const returns = await this.calculatePortfolioReturns(portfolioId);
    
    // 간단한 위험 지표 계산 (실제로는 더 복잡한 계산 필요)
    const volatility = Math.abs(returns.totalReturnPercent) * 0.1; // 간단한 변동성 계산
    const riskFreeRate = 2.5; // 무위험 수익률 (연 2.5% 가정)
    const sharpeRatio = returns.totalReturnPercent > riskFreeRate 
      ? (returns.totalReturnPercent - riskFreeRate) / volatility 
      : 0;
    
    const maxDrawdown = returns.totalReturnPercent < 0 ? Math.abs(returns.totalReturnPercent) : 0;
    const beta = 1.0; // 시장 대비 베타 (기본값)
    const alpha = returns.totalReturnPercent - (riskFreeRate + beta * 8); // 알파 계산 (시장 수익률 8% 가정)

    return {
      volatility,
      sharpeRatio,
      maxDrawdown,
      beta,
      alpha,
    };
  }

  /**
   * 포트폴리오 성과를 벤치마크와 비교합니다.
   */
  async compareWithBenchmark(portfolioId: number, benchmarkSymbol: string = 'SPY'): Promise<{
    portfolioReturn: number;
    benchmarkReturn: number;
    excessReturn: number;
    trackingError: number;
    informationRatio: number;
  }> {
    const portfolioReturns = await this.calculatePortfolioReturns(portfolioId);
    
    // 벤치마크 수익률 (실제로는 히스토리 데이터 필요)
    const benchmarkReturn = 8.5; // 연간 8.5% 가정
    
    const excessReturn = portfolioReturns.totalReturnPercent - benchmarkReturn;
    const trackingError = Math.abs(excessReturn) * 0.15; // 추적 오차
    const informationRatio = trackingError > 0 ? excessReturn / trackingError : 0;

    return {
      portfolioReturn: portfolioReturns.totalReturnPercent,
      benchmarkReturn,
      excessReturn,
      trackingError,
      informationRatio,
    };
  }

  /**
   * 포트폴리오의 자산 배분을 분석합니다.
   */
  async analyzeAssetAllocation(portfolioId: number): Promise<{
    totalValue: number;
    allocations: Array<{
      symbol: string;
      value: number;
      percentage: number;
      sector?: string;
    }>;
    sectorAllocation: Record<string, number>;
  }> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId },
      relations: ['holdings', 'holdings.stock'],
    });

    if (!portfolio) {
      throw new Error('포트폴리오를 찾을 수 없습니다.');
    }

    let totalValue = 0;
    const allocations: Array<{
      symbol: string;
      value: number;
      percentage: number;
      sector?: string;
    }> = [];

    for (const holding of portfolio.holdings) {
      const currentPrice = await this.stocksService.getCurrentPrice(holding.stock.symbol);
      const marketValue = holding.quantity * currentPrice;
      totalValue += marketValue;

      allocations.push({
        symbol: holding.stock.symbol,
        value: marketValue,
        percentage: 0, // 나중에 계산
        sector: holding.stock.sector,
      });
    }

    // 퍼센티지 계산
    allocations.forEach(allocation => {
      allocation.percentage = totalValue > 0 ? (allocation.value / totalValue) * 100 : 0;
    });

    // 섹터별 배분 계산
    const sectorAllocation: Record<string, number> = {};
    allocations.forEach(allocation => {
      if (allocation.sector) {
        sectorAllocation[allocation.sector] = 
          (sectorAllocation[allocation.sector] || 0) + allocation.percentage;
      }
    });

    return {
      totalValue,
      allocations,
      sectorAllocation,
    };
  }

  /**
   * 포트폴리오의 수익률 분포를 분석합니다.
   */
  async analyzeReturnDistribution(portfolioId: number): Promise<{
    profitableHoldings: number;
    losingHoldings: number;
    bestPerformer: {
      symbol: string;
      returnPercent: number;
    };
    worstPerformer: {
      symbol: string;
      returnPercent: number;
    };
    averageReturn: number;
    medianReturn: number;
  }> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId },
      relations: ['holdings', 'holdings.stock'],
    });

    if (!portfolio) {
      throw new Error('포트폴리오를 찾을 수 없습니다.');
    }

    const returns: Array<{
      symbol: string;
      quantity: number;
      averagePrice: number;
      currentPrice: number;
      marketValue: number;
      totalCost: number;
      unrealizedGain: number;
      unrealizedGainPercent: number;
      returnRate: number;
    }> = [];
    let profitableHoldings = 0;
    let losingHoldings = 0;

    for (const holding of portfolio.holdings) {
      const holdingReturns = await this.calculateHoldingReturns(holding.id);
      returns.push(holdingReturns);

      if (holdingReturns.unrealizedGain > 0) {
        profitableHoldings++;
      } else {
        losingHoldings++;
      }
    }

    if (returns.length === 0) {
      return {
        profitableHoldings: 0,
        losingHoldings: 0,
        bestPerformer: { symbol: '', returnPercent: 0 },
        worstPerformer: { symbol: '', returnPercent: 0 },
        averageReturn: 0,
        medianReturn: 0,
      };
    }

    // 수익률 정렬
    returns.sort((a, b) => b.returnRate - a.returnRate);

    const bestPerformer = {
      symbol: returns[0].symbol,
      returnPercent: returns[0].returnRate,
    };

    const worstPerformer = {
      symbol: returns[returns.length - 1].symbol,
      returnPercent: returns[returns.length - 1].returnRate,
    };

    const averageReturn = returns.reduce((sum, r) => sum + r.returnRate, 0) / returns.length;
    const medianReturn = returns[Math.floor(returns.length / 2)].returnRate;

    return {
      profitableHoldings,
      losingHoldings,
      bestPerformer,
      worstPerformer,
      averageReturn,
      medianReturn,
    };
  }

  /**
   * 포트폴리오의 수익률 추세를 분석합니다.
   */
  async analyzeReturnTrends(portfolioId: number): Promise<{
    dailyReturn: number;
    weeklyReturn: number;
    monthlyReturn: number;
    yearlyReturn: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }> {
    // 실제 구현에서는 히스토리 데이터가 필요하지만,
    // 현재는 모의 데이터로 계산합니다.
    
    const returns = await this.calculatePortfolioReturns(portfolioId);
    
    // 간단한 추세 계산 (실제로는 히스토리 데이터 필요)
    const dailyReturn = returns.totalReturnPercent * 0.01; // 일간 수익률
    const weeklyReturn = returns.totalReturnPercent * 0.05; // 주간 수익률
    const monthlyReturn = returns.totalReturnPercent * 0.2; // 월간 수익률
    const yearlyReturn = returns.totalReturnPercent; // 연간 수익률

    let trend: 'increasing' | 'decreasing' | 'stable';
    if (returns.totalReturnPercent > 5) {
      trend = 'increasing';
    } else if (returns.totalReturnPercent < -5) {
      trend = 'decreasing';
    } else {
      trend = 'stable';
    }

    return {
      dailyReturn,
      weeklyReturn,
      monthlyReturn,
      yearlyReturn,
      trend,
    };
  }
} 