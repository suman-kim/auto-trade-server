import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  ParseIntPipe 
} from '@nestjs/common';
import { TradingStrategiesService } from './trading-strategies.service';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { 
  CreateTradingStrategyDto, 
  UpdateTradingStrategyDto, 
  BacktestRequestDto,
  UpdateStrategyStatusDto,
} from '../../dtos/trading-strategy.dto';
import { StrategyType } from '../../entities/trading-strategy.entity';
@Controller('trading-strategies')
export class TradingStrategiesController {
  constructor(private readonly tradingStrategiesService: TradingStrategiesService) {}


  /**
   * 간단한 정보로 거래 전략을 생성합니다.
   * 전략 타입에 따라 기본 조건이 자동으로 설정됩니다.
   */
  @Post('simple')
  async createSimpleStrategy(
    @CurrentUser('id') userId: number,
    @Body() simpleStrategyDto: {
      name: string;
      strategyType?:StrategyType;
      description?: string;
    }
  ) {
    return await this.tradingStrategiesService.createSimpleStrategy(
      userId,
      simpleStrategyDto.name,
      simpleStrategyDto.strategyType,
      simpleStrategyDto.description
    );
  }

  /**
   * 사용자의 모든 거래 전략을 조회합니다.
   */
  @Get()
  async getUserStrategies(@CurrentUser('id') userId: number) {
    return await this.tradingStrategiesService.getUserStrategies(userId);
  }

  /**
   * 특정 거래 전략을 조회합니다.
   */
  @Get(':id')
  async getStrategy(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) strategyId: number
  ) {
    return await this.tradingStrategiesService.getStrategy(userId, strategyId);
  }

  /**
   * 거래 전략을 업데이트합니다.
   */
  @Put(':id')
  async updateStrategy(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) strategyId: number,
    @Body() updateStrategyDto: UpdateTradingStrategyDto
  ) {
    return await this.tradingStrategiesService.updateStrategy(userId, strategyId, updateStrategyDto);
  }

  /**
   * 거래 전략을 삭제합니다.
   */
  @Delete(':id')
  async deleteStrategy(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) strategyId: number
  ) {
    await this.tradingStrategiesService.deleteStrategy(userId, strategyId);
    return { message: '거래 전략이 삭제되었습니다.' };
  }

  /**
   * 거래 전략을 활성화/비활성화합니다.
   */
  @Put(':id/toggle')
  async toggleStrategy(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) strategyId: number
  ) {
    return await this.tradingStrategiesService.toggleStrategy(userId, strategyId);
  }

  /**
   * 거래 전략을 백테스팅합니다.
  //  */
  // @Post(':id/backtest')
  // async backtestStrategy(@CurrentUser('id') userId: number,@Param('id', ParseIntPipe) strategyId: number, @Body() backtestDto: BacktestRequestDto
  // ) {
  //   return await this.tradingStrategiesService.backtestStrategy(userId, strategyId, backtestDto);
  // }

  // /**
  //  * 백테스팅 결과를 조회합니다.
  //  */
  // @Get(':id/backtest-results')
  // async getBacktestResults(@CurrentUser('id') userId: number, @Param('id', ParseIntPipe) strategyId: number
  // ) {
  //   return await this.tradingStrategiesService.getBacktestResults(userId, strategyId);
  // }

  // /**
  //  * 모든 백테스팅 결과를 조회합니다.
  //  */
  // @Get('backtest-results/all')
  // async getAllBacktestResults(@CurrentUser('id') userId: number) {
  //   return await this.tradingStrategiesService.getBacktestResults(userId);
  // }

  /**
   * 전략의 신호 히스토리를 조회합니다.
   */
  @Get(':id/signals')
  async getStrategySignals(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) strategyId: number
  ) {
    return await this.tradingStrategiesService.getStrategySignals(userId, strategyId);
  }
} 