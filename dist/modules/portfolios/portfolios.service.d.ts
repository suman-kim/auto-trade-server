import { Repository } from 'typeorm';
import { Portfolio } from '../../entities/portfolio.entity';
import { PortfolioHolding } from '../../entities/portfolio-holding.entity';
import { Stock } from '../../entities/stock.entity';
import { CreatePortfolioDto, UpdatePortfolioDto, PortfolioResponseDto, PortfolioHoldingResponseDto, PortfolioPerformanceDto } from '../../dtos/portfolio.dto';
import { StocksService } from '../stocks/stocks.service';
import { OverseasStockHoldingResponse, OverseasStockHoldingItem } from '../../infrastructure/external/dto/response/response.dto';
export declare class PortfoliosService {
    private readonly portfolioRepository;
    private readonly holdingRepository;
    private readonly stockRepository;
    private readonly stocksService;
    private readonly logger;
    constructor(portfolioRepository: Repository<Portfolio>, holdingRepository: Repository<PortfolioHolding>, stockRepository: Repository<Stock>, stocksService: StocksService);
    getUserPortfolios(userId: number): Promise<Portfolio[]>;
    createPortfolio(userId: number, createPortfolioDto: CreatePortfolioDto): Promise<void>;
    getPortfolio(userId: number, portfolioId: number): Promise<PortfolioResponseDto>;
    updatePortfolio(userId: number, portfolioId: number, updatePortfolioDto: UpdatePortfolioDto): Promise<PortfolioResponseDto>;
    updatePortfolioFromKis(userId: number, portfolioId: number, data: OverseasStockHoldingResponse): Promise<void>;
    deletePortfolio(userId: number, portfolioId: number): Promise<void>;
    updateHolding(userId: number, portfolioId: number, data: OverseasStockHoldingItem): Promise<void>;
    removeHolding(userId: number, portfolioId: number, holdingId: number): Promise<void>;
    getPortfolioHoldings(userId: number, portfolioId: number): Promise<PortfolioHoldingResponseDto[]>;
    getPortfolioPerformance(userId: number, portfolioId: number): Promise<PortfolioPerformanceDto>;
    private calculatePortfolioSummary;
    private mapHoldingToResponse;
    getUserDefaultPortfolio(userId: number): Promise<Portfolio | null>;
    getAllPortfolios(): Promise<Portfolio[]>;
}
