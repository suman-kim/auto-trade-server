import { Repository } from 'typeorm';
import { Portfolio } from '../../entities/portfolio.entity';
import { PortfolioHolding } from '../../entities/portfolio-holding.entity';
import { Stock } from '../../entities/stock.entity';
import { StocksService } from '../stocks/stocks.service';
export declare class PortfolioReturnsService {
    private readonly portfolioRepository;
    private readonly holdingRepository;
    private readonly stockRepository;
    private readonly stocksService;
    private readonly logger;
    constructor(portfolioRepository: Repository<Portfolio>, holdingRepository: Repository<PortfolioHolding>, stockRepository: Repository<Stock>, stocksService: StocksService);
    calculatePortfolioReturns(portfolioId: number): Promise<{
        totalValue: number;
        totalCost: number;
        totalReturn: number;
        totalReturnPercent: number;
        unrealizedGain: number;
        unrealizedGainPercent: number;
    }>;
    calculateHoldingReturns(holdingId: number): Promise<{
        symbol: string;
        quantity: number;
        averagePrice: number;
        currentPrice: number;
        marketValue: number;
        totalCost: number;
        unrealizedGain: number;
        unrealizedGainPercent: number;
        returnRate: number;
    }>;
    calculatePortfolioRiskMetrics(portfolioId: number): Promise<{
        volatility: number;
        sharpeRatio: number;
        maxDrawdown: number;
        beta: number;
        alpha: number;
    }>;
    compareWithBenchmark(portfolioId: number, benchmarkSymbol?: string): Promise<{
        portfolioReturn: number;
        benchmarkReturn: number;
        excessReturn: number;
        trackingError: number;
        informationRatio: number;
    }>;
    analyzeAssetAllocation(portfolioId: number): Promise<{
        totalValue: number;
        allocations: Array<{
            symbol: string;
            value: number;
            percentage: number;
            sector?: string;
        }>;
        sectorAllocation: Record<string, number>;
    }>;
    analyzeReturnDistribution(portfolioId: number): Promise<{
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
    }>;
    analyzeReturnTrends(portfolioId: number): Promise<{
        dailyReturn: number;
        weeklyReturn: number;
        monthlyReturn: number;
        yearlyReturn: number;
        trend: 'increasing' | 'decreasing' | 'stable';
    }>;
}
