import { PortfoliosService } from './portfolios.service';
import { PortfolioReturnsService } from './portfolio-returns.service';
import { CreatePortfolioDto, UpdatePortfolioDto } from '../../dtos/portfolio.dto';
import { User } from '../../entities/user.entity';
export declare class PortfoliosController {
    private readonly portfoliosService;
    private readonly portfolioReturnsService;
    constructor(portfoliosService: PortfoliosService, portfolioReturnsService: PortfolioReturnsService);
    getUserPortfolios(user: User): Promise<import("../../entities").Portfolio[]>;
    createPortfolio(user: User, createPortfolioDto: CreatePortfolioDto): Promise<void>;
    getPortfolio(user: User, portfolioId: number): Promise<import("../../dtos/portfolio.dto").PortfolioResponseDto>;
    updatePortfolio(user: User, portfolioId: number, updatePortfolioDto: UpdatePortfolioDto): Promise<import("../../dtos/portfolio.dto").PortfolioResponseDto>;
    deletePortfolio(user: User, portfolioId: number): Promise<void>;
    getPortfolioHoldings(user: User, portfolioId: number): Promise<import("../../dtos/portfolio.dto").PortfolioHoldingResponseDto[]>;
    removeHolding(user: User, portfolioId: number, holdingId: number): Promise<void>;
    getPortfolioPerformance(user: User, portfolioId: number): Promise<import("../../dtos/portfolio.dto").PortfolioPerformanceDto>;
    getPortfolioReturns(user: User, portfolioId: number): Promise<{
        totalValue: number;
        totalCost: number;
        totalReturn: number;
        totalReturnPercent: number;
        unrealizedGain: number;
        unrealizedGainPercent: number;
    }>;
    getPortfolioRiskMetrics(user: User, portfolioId: number): Promise<{
        volatility: number;
        sharpeRatio: number;
        maxDrawdown: number;
        beta: number;
        alpha: number;
    }>;
    getBenchmarkComparison(user: User, portfolioId: number, benchmark?: string): Promise<{
        portfolioReturn: number;
        benchmarkReturn: number;
        excessReturn: number;
        trackingError: number;
        informationRatio: number;
    }>;
    getAssetAllocation(user: User, portfolioId: number): Promise<{
        totalValue: number;
        allocations: Array<{
            symbol: string;
            value: number;
            percentage: number;
            sector?: string;
        }>;
        sectorAllocation: Record<string, number>;
    }>;
    getReturnDistribution(user: User, portfolioId: number): Promise<{
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
    getReturnTrends(user: User, portfolioId: number): Promise<{
        dailyReturn: number;
        weeklyReturn: number;
        monthlyReturn: number;
        yearlyReturn: number;
        trend: "increasing" | "decreasing" | "stable";
    }>;
    getHoldingReturns(user: User, portfolioId: number, holdingId: number): Promise<{
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
}
