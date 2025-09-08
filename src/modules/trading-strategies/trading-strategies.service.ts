import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TradingStrategy, StrategyStatus, StrategyType } from '../../entities/trading-strategy.entity';
import { TradingSignal } from '../../entities/trading-signal.entity';
import { SignalType } from '../../shared/types/trading-strategy.types';
import { TradingStrategyConditions, TechnicalIndicatorsResult, SignalGenerationResult } from '../../shared/types/trading-strategy.types';
import { BacktestResult } from '../../entities/backtest-result.entity';
import { Stock } from '../../entities/stock.entity';
import { User } from '../../entities/user.entity';
import { 
  CreateTradingStrategyDto, 
  UpdateTradingStrategyDto, 
  BacktestRequestDto,
  TradingConditionsDto 
} from '../../dtos/trading-strategy.dto';
import { KisApiService } from '../../infrastructure/external/kis-api.service';
import { TechnicalIndicatorsService } from '../../infrastructure/services/technical-indicators.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class TradingStrategiesService {
  private readonly logger = new Logger(TradingStrategiesService.name);
  
  constructor(
    @InjectRepository(TradingStrategy)
    private tradingStrategyRepository: Repository<TradingStrategy>,
    @InjectRepository(TradingSignal)
    private tradingSignalRepository: Repository<TradingSignal>,
    @InjectRepository(BacktestResult)
    private backtestResultRepository: Repository<BacktestResult>,
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly kisApiService: KisApiService,
    private readonly technicalIndicatorsService: TechnicalIndicatorsService,
  ) {}


  /**
   * 간단한 정보로 거래 전략을 생성합니다.
   * 사용자가 최소한의 정보만 입력해도 기본 조건이 자동으로 설정됩니다.
   */
  public async createSimpleStrategy(userId: number, name: string, strategyType: StrategyType = StrategyType.MOVING_AVERAGE,description?: string): Promise<TradingStrategy> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 전략 타입에 따른 기본 조건 자동 생성
    const defaultConditions = this.generateDefaultConditions(strategyType);

    const strategy = this.tradingStrategyRepository.create({
      name,
      description: description || `${strategyType} 기반 자동매매 전략`,
      type: strategyType,
      conditions: defaultConditions,
      autoTrading: {
        enabled: false,
        maxPositionSize: 10000,
        stopLoss: 5.0,
        takeProfit: 10.0,
        maxDailyTrades: 10,
        riskPerTrade: 2.0,
        minConfidence: 0.6
      },
      userId,
      status: StrategyStatus.ACTIVE,
    });

    const savedStrategy = await this.tradingStrategyRepository.save(strategy);
    this.logger.log(`간단한 전략 생성 완료: ${name} (타입: ${strategyType})`);
    
    return savedStrategy;
  }

  /**
   * 전략 타입에 따른 기본 거래 조건을 생성합니다.
   * @param strategyType 전략 타입
   * @returns 기본 거래 조건
   */
  private generateDefaultConditions(strategyType: StrategyType): any {
    const conditions: any = {};

    // 전략 타입에 따른 기본 지표 조건 설정
    switch (strategyType) {
      case StrategyType.MOVING_AVERAGE:
        conditions.indicators = {
          movingAverage: {
            shortPeriod: 10,
            longPeriod: 20,
            type: 'sma'
          }
        };
        break;

      case StrategyType.RSI:
        conditions.indicators = {
          rsi: {
            period: 14,
            oversold: 30,
            overbought: 70
          }
        };
        break;

      case StrategyType.MACD:
        conditions.indicators = {
          macd: {
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9
          }
        };
        break;

      case StrategyType.BOLLINGER_BANDS:
        conditions.indicators = {
          bollingerBands: {
            period: 20,
            standardDeviations: 2
          }
        };
        break;

      case StrategyType.CUSTOM:
        // 사용자 정의 전략의 경우 기본 지표들을 모두 포함
        conditions.indicators = {
          rsi: {
            period: 14,
            oversold: 30,
            overbought: 70
          },
          movingAverage: {
            shortPeriod: 10,
            longPeriod: 20,
            type: 'sma'
          },
          macd: {
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9
          },
          bollingerBands: {
            period: 20,
            standardDeviations: 2
          }
        };
        break;

      default:
        conditions.indicators = {
          movingAverage: {
            shortPeriod: 10,
            longPeriod: 20,
            type: 'sma'
          }
        };
    }

    // 기본 가격 조건
    conditions.priceConditions = {
      minPrice: 0,
      maxPrice: 1000000,
      priceChangePercent: 5.0
    };

    // 기본 거래량 조건
    conditions.volumeConditions = {
      minVolume: 1000,
      volumeChangePercent: 20.0
    };

    // 기본 시간 조건
    conditions.timeConditions = {
      tradingHours: {
        start: '23:30',
        end: '06:00'
      },
      excludeWeekends: true
    };

    return conditions;
  }

  /**
   * 사용자의 모든 거래 전략을 조회합니다.
   */
  public async getUserStrategies(userId: number): Promise<TradingStrategy[]> {
    return await this.tradingStrategyRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 특정 거래 전략을 조회합니다.
   */
  public async getStrategy(userId: number, strategyId: number): Promise<TradingStrategy> {

    const strategy = await this.tradingStrategyRepository.findOne({
      where: { id: strategyId, userId },
      relations: ['user'],
    });

    if (!strategy) {
      throw new NotFoundException('거래 전략을 찾을 수 없습니다.');
    }

    return strategy;
  }

  /**
   * 거래 전략을 업데이트합니다.
   */
  public async updateStrategy(userId: number, strategyId: number, updateStrategyDto: UpdateTradingStrategyDto): Promise<TradingStrategy> {
    const strategy = await this.getStrategy(userId, strategyId);
    Object.assign(strategy, updateStrategyDto);
    return await this.tradingStrategyRepository.save(strategy);
  }

  /**
   * 거래 전략을 삭제합니다.
   */
  public async deleteStrategy(userId: number, strategyId: number): Promise<void> {
    const strategy = await this.getStrategy(userId, strategyId);
    await this.tradingStrategyRepository.remove(strategy);
  }

  /**
   * 전략을 활성화/비활성화합니다.
   */
  public async toggleStrategy(userId: number, strategyId: number): Promise<TradingStrategy> {
    const strategy = await this.getStrategy(userId, strategyId);
    
    // 현재 상태를 확인하고 토글
    const newStatus = strategy.status === StrategyStatus.ACTIVE 
      ? StrategyStatus.INACTIVE 
      : StrategyStatus.ACTIVE;
    
    // 직접 업데이트 쿼리 사용
    await this.tradingStrategyRepository.update(
      { id: strategyId, userId },
      { status: newStatus }
    );
    
    // 업데이트된 전략 반환
    return await this.getStrategy(userId, strategyId);
  }
  
  /**
   * 전략의 신호 히스토리를 조회합니다.
   */
  public async getStrategySignals(userId: number, strategyId: number): Promise<TradingSignal[]> {
    await this.getStrategy(userId, strategyId); // 전략 존재 확인

    return await this.tradingSignalRepository.find({
      where: { strategyId },
      order: { createdAt: 'DESC' },
      take: 100, // 최근 100개 신호만 조회
    });
  }

  /**
   * 전략 실행
   * @param strategy 전략
   * @param user 사용자
   * @param stock 주식
   * @param currentPrice 현재가
   * @param volume 거래량
   * @param indicators 기술적 지표
   */
  public async executeStrategy(strategy: TradingStrategy, user: User, stock: Stock, currentPrice: number, volume: number, indicators: TechnicalIndicatorsResult): Promise<TradingSignal|null> {
    try {
      this.logger.debug(`전략 실행 시작: ${strategy.name} (${stock.symbol})`);

      // 전략 마지막 실행 시간 업데이트
      await this.updateStrategyLastExecuted(strategy.id);
      // 신호 생성
      const signal:TradingSignal|null = await this.generateSignal(strategy, stock, currentPrice, volume, indicators);
      
      this.logger.debug(`신호 생성: ${signal?.signalType} (${stock.symbol}) - 신뢰도: ${signal?.confidence}`);

      return signal;

    } 
    catch (error) {
      this.logger.error(`전략 실행 실패 (${strategy.name}):`, error);
      return null;
    }
  }


  /**
   * 활성화된 모든 거래 전략을 조회합니다.
   * 실시간 엔진에서 사용됩니다.
   */
  public async getActiveStrategies(): Promise<TradingStrategy[]> {
    return await this.tradingStrategyRepository.find({
      where: { status: StrategyStatus.ACTIVE },
      order: { createdAt: 'ASC' },
    });
  }


  /**
   * 전략의 마지막 실행 시간을 업데이트합니다.
   * 실시간 엔진에서 사용됩니다.
   */
  private async updateStrategyLastExecuted(strategyId: number): Promise<void> {
    await this.tradingStrategyRepository.update(
      { id: strategyId },
      { lastExecutedAt: new Date() }
    );
  }


  /**
   * 전략 조건을 평가하여 신호를 결정합니다.
   * @param conditions 전략 조건
   * @param currentPrice 현재가
   * @param volume 거래량
   * @param indicators 기술적 지표
   * @returns 신호 타입과 신뢰도
   */
  private evaluateStrategyConditions(conditions: TradingStrategyConditions, currentPrice: number, volume: number, indicators: TechnicalIndicatorsResult): SignalGenerationResult {
    let buySignals = 0;
    let sellSignals = 0;
    let totalConditions = 0;

    // RSI 조건 확인
    if (conditions.indicators?.rsi && indicators.rsi !== undefined) {
      totalConditions++;
      if (indicators.rsi < conditions.indicators.rsi.oversold) {
        buySignals++;
      } else if (indicators.rsi > conditions.indicators.rsi.overbought) {
        sellSignals++;
      }
    }

    // 이동평균 조건 확인
    if (conditions.indicators?.movingAverage && indicators.shortMA && indicators.longMA) {
      totalConditions++;
      if (indicators.shortMA > indicators.longMA) {
        buySignals++;
      } else if (indicators.shortMA < indicators.longMA) {
        sellSignals++;
      }
    }

    // MACD 조건 확인
    if (conditions.indicators?.macd && indicators.macd) {
      totalConditions++;
      if (indicators.macd.macd > indicators.macd.signal && indicators.macd.histogram > 0) {
        buySignals++;
      } else if (indicators.macd.macd < indicators.macd.signal && indicators.macd.histogram < 0) {
        sellSignals++;
      }
    }

    // 볼린저 밴드 조건 확인
    if (conditions.indicators?.bollingerBands && indicators.bollingerBands) {
      totalConditions++;
      if (currentPrice <= indicators.bollingerBands.lower) {
        buySignals++;
      } else if (currentPrice >= indicators.bollingerBands.upper) {
        sellSignals++;
      }
    }

    // 가격 조건 확인
    if (conditions.priceConditions) {
      if (conditions.priceConditions.maxPrice && currentPrice > conditions.priceConditions.maxPrice) {
        sellSignals++;
        totalConditions++;
      }
      if (conditions.priceConditions.minPrice && currentPrice < conditions.priceConditions.minPrice) {
        buySignals++;
        totalConditions++;
      }
    }

    // 거래량 조건 확인
    if (conditions.volumeConditions) {
      if (conditions.volumeConditions.minVolume && volume < conditions.volumeConditions.minVolume) {
        return { signalType: SignalType.HOLD, confidence: 0 };
      }
    }

    // 신호 결정
    if (totalConditions === 0) {
      return { signalType: SignalType.HOLD, confidence: 0 };
    }

    const buyRatio = buySignals / totalConditions;
    const sellRatio = sellSignals / totalConditions;

    if (buyRatio > 0.5) {
      return { signalType: SignalType.BUY, confidence: buyRatio };
    } else if (sellRatio > 0.5) {
      return { signalType: SignalType.SELL, confidence: sellRatio };
    }

    return { signalType: SignalType.HOLD, confidence: 0 };
  }


  /**
   * 거래 신호를 생성합니다.
   * @param strategy 전략
   * @param stock 주식
   * @param currentPrice 현재가
   * @param volume 거래량
   * @param indicators 기술적 지표
   * @returns 거래 신호
   */
    public async generateSignal(strategy: TradingStrategy, stock: Stock, currentPrice: number, volume: number, indicators: TechnicalIndicatorsResult): Promise<TradingSignal | null> {
      try {
        let signalType: SignalType = SignalType.HOLD;
        let confidence: number = 0.5;
  
        // 전략 조건에 따른 신호 생성
        if (strategy.conditions?.indicators) {
          const signalResult = this.evaluateStrategyConditions(strategy.conditions, currentPrice, volume, indicators);
          signalType = signalResult.signalType;
          confidence = signalResult.confidence;
        }
  
        // HOLD 신호는 저장하지 않음
        if (signalType === SignalType.HOLD) {
          return null;
        }
  
        // 신호 생성
        const signalData = {
          strategyId: strategy.id,
          stockId: stock.id,
          signalType,
          confidence,
          price: currentPrice,
          volume,
          indicators,
          executed: false,
          executedAt: null,
        };
  
        const signal:TradingSignal|null = await this.saveTradingSignal(signalData);

        this.logger.log(`신호 생성: ${signalType} (${stock.symbol}) - 신뢰도: ${confidence}`);

        return signal;
  
      } 
      catch (error) {
        this.logger.error(`신호 생성 오류 (${strategy.name}):`, error);
        return null;
      }
    }

  /**
   * 거래 신호를 저장합니다.
   * 실시간 엔진에서 사용됩니다.
   */
  private async saveTradingSignal(signal: Partial<TradingSignal>): Promise<TradingSignal> {
    const tradingSignal = this.tradingSignalRepository.create(signal);
    return await this.tradingSignalRepository.save(tradingSignal);
  }

} 