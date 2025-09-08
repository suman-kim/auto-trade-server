import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from '../../entities/portfolio.entity';
import { PortfolioHolding } from '../../entities/portfolio-holding.entity';
import { Stock } from '../../entities/stock.entity';
import { 
  CreatePortfolioDto, 
  UpdatePortfolioDto, 
  AddHoldingDto, 
  UpdateHoldingDto,
  PortfolioResponseDto,
  PortfolioHoldingResponseDto,
  PortfolioSummaryDto,
  PortfolioPerformanceDto
} from '../../dtos/portfolio.dto';
import { StocksService } from '../stocks/stocks.service';
import { OverseasStockHoldingResponse ,OverseasStockHoldingItem} from '../../infrastructure/external/dto/response/response.dto';

/**
 * 포트폴리오 서비스
 * 사용자별 포트폴리오 관리, 보유량 관리, 수익률 계산 기능을 제공합니다.
 */
@Injectable()
export class PortfoliosService {
  private readonly logger = new Logger(PortfoliosService.name);

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
   * 사용자의 포트폴리오 목록을 조회합니다.
   */
  async getUserPortfolios(userId: number): Promise<Portfolio[]> {
    const portfolios = await this.portfolioRepository.find({
      where: { userId },
      relations: ['holdings'],
      order: { createdAt: 'DESC' },
    });

    return portfolios;

    // return await Promise.all(
    //   portfolios.map(async (portfolio) => {
    //     const summary = await this.calculatePortfolioSummary(portfolio);
    //     return {
    //       id: portfolio.id,
    //       name: portfolio.name,
    //       totalValue: summary.totalValue,
    //       totalCost: summary.totalCost,
    //       totalReturn: summary.totalReturn,
    //       totalReturnPercent: summary.totalReturnPercent,
    //       holdingsCount: summary.holdingsCount,
    //       lastUpdated: portfolio.updatedAt.toISOString(),
    //     };
    //   })
    // );
  }

  /**
   * 포트폴리오를 생성합니다.
   */
  async createPortfolio(userId: number, createPortfolioDto: CreatePortfolioDto): Promise<void> {
    const portfolio = this.portfolioRepository.create({
      ...createPortfolioDto,
      userId,
    });

    const savedPortfolio = await this.portfolioRepository.save(portfolio);
  }

  /**
   * 포트폴리오 상세 정보를 조회합니다.
   */
  async getPortfolio(userId: number, portfolioId: number): Promise<PortfolioResponseDto> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId, userId },
      relations: ['holdings', 'holdings.stock'],
    });

    if (!portfolio) {
      throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
    }

    const summary = await this.calculatePortfolioSummary(portfolio);

    return {
      id: portfolio.id,
      name: portfolio.name,
      description: portfolio.description,
      riskLevel: undefined, // 엔티티에 없는 필드
      targetReturn: undefined, // 엔티티에 없는 필드
      totalValue: summary.totalValue,
      totalCost: summary.totalCost,
      totalReturn: summary.totalReturn,
      totalReturnPercent: summary.totalReturnPercent,
      holdingsCount: summary.holdingsCount,
      createdAt: portfolio.createdAt.toISOString(),
      updatedAt: portfolio.updatedAt.toISOString(),
    };
  }

  /**
   * 포트폴리오를 업데이트합니다.
   */
  async updatePortfolio(userId: number, portfolioId: number, updatePortfolioDto: UpdatePortfolioDto): Promise<PortfolioResponseDto> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId, userId },
    });

    if (!portfolio) {
      throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
    }



    Object.assign(portfolio, updatePortfolioDto);
    await this.portfolioRepository.save(portfolio);

    return await this.getPortfolio(userId, portfolioId);
  }

  /**
   * 포트폴리오 한국투자증권 API로 업데이트
   */
  async updatePortfolioFromKis(userId: number, portfolioId: number, data:OverseasStockHoldingResponse): Promise<void> {
      try{
        const portfolio = await this.portfolioRepository.findOne({
          where: { id: portfolioId, userId },
        });
        if (!portfolio) {
          throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
        }

         /** 외화 매입 금액1 */
         portfolio.foreignPurchaseAmount1 = parseFloat(data.output2.frcr_pchs_amt1);
         /** 총 평가 손익 금액 */
         portfolio.totalEvaluationProfitAmount = parseFloat(data.output2.tot_evlu_pfls_amt);
         /** 총 수익률 */
         portfolio.totalProfitRate = parseFloat(data.output2.tot_pftrt);
         /** 외화 매수 금액 합계1 */
         portfolio.foreignPurchaseAmountSum1 = parseFloat(data.output2.frcr_buy_amt_smtl1);
         /** 외화 매수 금액 합계2 */
         portfolio.foreignPurchaseAmountSum2 = parseFloat(data.output2.frcr_buy_amt_smtl2);
         await this.portfolioRepository.save(portfolio);


      }
      catch(error){
        this.logger.error('포트폴리오 한국투자증권 API로 업데이트 실패:', error);
        throw new BadRequestException('포트폴리오 한국투자증권 API로 업데이트 실패');
      }
   }

  /**
   * 포트폴리오를 삭제합니다.
   */
  async deletePortfolio(userId: number, portfolioId: number): Promise<void> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId, userId },
      relations: ['holdings'],
    });

    if (!portfolio) {
      throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
    }

    // 보유량이 있으면 삭제 불가
    if (portfolio.holdings.length > 0) {
      throw new BadRequestException('보유량이 있는 포트폴리오는 삭제할 수 없습니다.');
    }

    await this.portfolioRepository.remove(portfolio);
  }

  /**
   * 포트폴리오 보유량을 업데이트합니다.
   */
  async updateHolding(userId: number,portfolioId: number,data:OverseasStockHoldingItem): Promise<void> {
    try{
        const stock = await this.stocksService.getStockInfo(data.ovrs_pdno);
    
        if(!stock){
          throw new NotFoundException('주식을 찾을 수 없습니다.');
        }
    
        const holding = await this.holdingRepository.findOne({
          where: { stockId: stock.id, portfolioId: portfolioId },
        });
    
        if (!holding) {
          throw new NotFoundException('보유량을 찾을 수 없습니다.');
        }

        //TODO: 보유량 업데이트
        holding.quantity = parseFloat(data.ovrs_cblc_qty);
        holding.averagePrice = parseFloat(data.pchs_avg_pric);
        await this.holdingRepository.save(holding);
    }
    catch(err){
      this.logger.error('포트폴리오 보유량 업데이트 실패:', err);
      throw new BadRequestException('포트폴리오 보유량 업데이트 실패');
    }
  }

  /**
   * 포트폴리오 보유량을 삭제합니다.
   */
  async removeHolding(userId: number, portfolioId: number, holdingId: number): Promise<void> {
    const holding = await this.holdingRepository.findOne({
      where: { id: holdingId, portfolio: { id: portfolioId, userId } },
      relations: ['portfolio'],
    });

    if (!holding) {
      throw new NotFoundException('보유량을 찾을 수 없습니다.');
    }

    await this.holdingRepository.remove(holding);
  }

  /**
   * 포트폴리오 보유량 목록을 조회합니다.
   */
  async getPortfolioHoldings(userId: number, portfolioId: number): Promise<PortfolioHoldingResponseDto[]> {
    const holdings = await this.holdingRepository.find({
      where: { portfolio: { id: portfolioId, userId } },
      relations: ['stock'],
      order: { createdAt: 'DESC' },
    });

    return await Promise.all(
      holdings.map(holding => this.mapHoldingToResponse(holding))
    );
  }

  /**
   * 포트폴리오 성과 분석을 조회합니다.
   */
  async getPortfolioPerformance(userId: number, portfolioId: number): Promise<PortfolioPerformanceDto> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId, userId },
      relations: ['holdings', 'holdings.stock'],
    });

    if (!portfolio) {
      throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
    }

    const summary = await this.calculatePortfolioSummary(portfolio);

    // 간단한 성과 지표 계산 (실제로는 더 복잡한 계산이 필요)
    const performance: PortfolioPerformanceDto = {
      portfolioId: portfolio.id,
      portfolioName: portfolio.name,
      totalValue: summary.totalValue,
      totalCost: summary.totalCost,
      totalReturn: summary.totalReturn,
      totalReturnPercent: summary.totalReturnPercent,
      dailyReturn: 0, // 실제로는 히스토리 데이터 필요
      dailyReturnPercent: 0,
      weeklyReturn: 0,
      weeklyReturnPercent: 0,
      monthlyReturn: 0,
      monthlyReturnPercent: 0,
      yearlyReturn: 0,
      yearlyReturnPercent: 0,
      sharpeRatio: 0, // 실제로는 수익률 표준편차 계산 필요
      maxDrawdown: 0, // 실제로는 히스토리 데이터 필요
      volatility: 0, // 실제로는 수익률 표준편차 계산 필요
      lastUpdated: portfolio.updatedAt.toISOString(),
    };

    return performance;
  }

  /**
   * 포트폴리오 요약 정보를 계산합니다.
   */
  private async calculatePortfolioSummary(portfolio: Portfolio): Promise<{
    totalValue: number;
    totalCost: number;
    totalReturn: number;
    totalReturnPercent: number;
    holdingsCount: number;
  }> {
    let totalValue = 0;
    let totalCost = 0;
    let holdingsCount = 0;

    for (const holding of portfolio.holdings) {
      // 최신 주식 가격 조회
      const currentPrice = await this.stocksService.getCurrentPrice(holding.stock.symbol);
      
      const marketValue = holding.quantity * currentPrice;
      const cost = holding.quantity * holding.averagePrice;

      totalValue += marketValue;
      totalCost += cost;
      holdingsCount++;
    }

    const totalReturn = totalValue - totalCost;
    const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

    return {
      totalValue,
      totalCost,
      totalReturn,
      totalReturnPercent,
      holdingsCount,
    };
  }

  /**
   * 보유량을 응답 DTO로 매핑합니다.
   */
  private async mapHoldingToResponse(holding: PortfolioHolding): Promise<PortfolioHoldingResponseDto> {
    const currentPrice = await this.stocksService.getCurrentPrice(holding.stock.symbol);
    const marketValue = holding.quantity * currentPrice;
    const totalCost = holding.quantity * holding.averagePrice;
    const unrealizedGain = marketValue - totalCost;
    const unrealizedGainPercent = totalCost > 0 ? (unrealizedGain / totalCost) * 100 : 0;

    return {
      id: holding.id,
      symbol: holding.stock.symbol,
      companyName: holding.stock.companyName,
      quantity: holding.quantity,
      averagePrice: holding.averagePrice,
      currentPrice,
      marketValue,
      totalCost,
      unrealizedGain,
      unrealizedGainPercent,
      purchaseDate: holding.createdAt.toISOString(), // createdAt을 purchaseDate로 사용
      notes: '', // notes 필드가 없으므로 빈 문자열 사용
      createdAt: holding.createdAt.toISOString(),
      updatedAt: holding.updatedAt.toISOString(),
    };
  }

  /**
   * 사용자의 기본 포트폴리오를 조회합니다.
   * 실시간 엔진에서 사용됩니다.
   */
  async getUserDefaultPortfolio(userId: number): Promise<Portfolio | null> {
    try {
      return await this.portfolioRepository.findOne({
        where: { userId },
        order: { createdAt: 'ASC' }, // 가장 오래된 포트폴리오 사용
      });
    } catch (error) {
      this.logger.error(`사용자 기본 포트폴리오 조회 실패 (${userId}):`, error);
      return null;
    }
  }

  /**
   * 모든 포트폴리오를 조회합니다.
   * 실시간 엔진에서 사용됩니다.
   */
  async getAllPortfolios(): Promise<Portfolio[]> {
    try {
      return await this.portfolioRepository.find();
    } catch (error) {
      this.logger.error('모든 포트폴리오 조회 실패:', error);
      return [];
    }
  }
} 