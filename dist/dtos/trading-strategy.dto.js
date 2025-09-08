"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyPerformanceDto = exports.BacktestResultDto = exports.TradingSignalDto = exports.BacktestRequestDto = exports.UpdateStrategyStatusDto = exports.UpdateTradingStrategyDto = exports.CreateTradingStrategyDto = exports.TradingConditionsDto = exports.AutoTradingDto = exports.TimeConditionsDto = exports.VolumeConditionsDto = exports.PriceConditionsDto = exports.TradingHoursDto = exports.IndicatorConditionsDto = exports.BollingerBandsConditionDto = exports.MacdConditionDto = exports.MovingAverageConditionDto = exports.RsiConditionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const trading_strategy_types_1 = require("../shared/types/trading-strategy.types");
class RsiConditionDto {
    period;
    oversold;
    overbought;
}
exports.RsiConditionDto = RsiConditionDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], RsiConditionDto.prototype, "period", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], RsiConditionDto.prototype, "oversold", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], RsiConditionDto.prototype, "overbought", void 0);
class MovingAverageConditionDto {
    shortPeriod;
    longPeriod;
    type;
}
exports.MovingAverageConditionDto = MovingAverageConditionDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], MovingAverageConditionDto.prototype, "shortPeriod", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], MovingAverageConditionDto.prototype, "longPeriod", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MovingAverageConditionDto.prototype, "type", void 0);
class MacdConditionDto {
    fastPeriod;
    slowPeriod;
    signalPeriod;
}
exports.MacdConditionDto = MacdConditionDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], MacdConditionDto.prototype, "fastPeriod", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], MacdConditionDto.prototype, "slowPeriod", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], MacdConditionDto.prototype, "signalPeriod", void 0);
class BollingerBandsConditionDto {
    period;
    standardDeviations;
}
exports.BollingerBandsConditionDto = BollingerBandsConditionDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], BollingerBandsConditionDto.prototype, "period", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], BollingerBandsConditionDto.prototype, "standardDeviations", void 0);
class IndicatorConditionsDto {
    rsi;
    movingAverage;
    macd;
    bollingerBands;
}
exports.IndicatorConditionsDto = IndicatorConditionsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RsiConditionDto),
    __metadata("design:type", RsiConditionDto)
], IndicatorConditionsDto.prototype, "rsi", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => MovingAverageConditionDto),
    __metadata("design:type", MovingAverageConditionDto)
], IndicatorConditionsDto.prototype, "movingAverage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => MacdConditionDto),
    __metadata("design:type", MacdConditionDto)
], IndicatorConditionsDto.prototype, "macd", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BollingerBandsConditionDto),
    __metadata("design:type", BollingerBandsConditionDto)
], IndicatorConditionsDto.prototype, "bollingerBands", void 0);
class TradingHoursDto {
    start;
    end;
}
exports.TradingHoursDto = TradingHoursDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TradingHoursDto.prototype, "start", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TradingHoursDto.prototype, "end", void 0);
class PriceConditionsDto {
    minPrice;
    maxPrice;
    priceChangePercent;
}
exports.PriceConditionsDto = PriceConditionsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PriceConditionsDto.prototype, "minPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PriceConditionsDto.prototype, "maxPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-100),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PriceConditionsDto.prototype, "priceChangePercent", void 0);
class VolumeConditionsDto {
    minVolume;
    volumeChangePercent;
}
exports.VolumeConditionsDto = VolumeConditionsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], VolumeConditionsDto.prototype, "minVolume", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-100),
    (0, class_validator_1.Max)(1000),
    __metadata("design:type", Number)
], VolumeConditionsDto.prototype, "volumeChangePercent", void 0);
class TimeConditionsDto {
    tradingHours;
    excludeWeekends;
}
exports.TimeConditionsDto = TimeConditionsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TradingHoursDto),
    __metadata("design:type", TradingHoursDto)
], TimeConditionsDto.prototype, "tradingHours", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TimeConditionsDto.prototype, "excludeWeekends", void 0);
class AutoTradingDto {
    enabled;
    maxPositionSize;
    stopLoss;
    takeProfit;
    maxDailyTrades;
    riskPerTrade;
}
exports.AutoTradingDto = AutoTradingDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AutoTradingDto.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AutoTradingDto.prototype, "maxPositionSize", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], AutoTradingDto.prototype, "stopLoss", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], AutoTradingDto.prototype, "takeProfit", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], AutoTradingDto.prototype, "maxDailyTrades", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], AutoTradingDto.prototype, "riskPerTrade", void 0);
class TradingConditionsDto {
    indicators;
    priceConditions;
    volumeConditions;
    timeConditions;
}
exports.TradingConditionsDto = TradingConditionsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => IndicatorConditionsDto),
    __metadata("design:type", IndicatorConditionsDto)
], TradingConditionsDto.prototype, "indicators", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceConditionsDto),
    __metadata("design:type", PriceConditionsDto)
], TradingConditionsDto.prototype, "priceConditions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => VolumeConditionsDto),
    __metadata("design:type", VolumeConditionsDto)
], TradingConditionsDto.prototype, "volumeConditions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TimeConditionsDto),
    __metadata("design:type", TimeConditionsDto)
], TradingConditionsDto.prototype, "timeConditions", void 0);
class CreateTradingStrategyDto {
    name;
    description;
    type;
    conditions;
    autoTrading;
}
exports.CreateTradingStrategyDto = CreateTradingStrategyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTradingStrategyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTradingStrategyDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(trading_strategy_types_1.StrategyType),
    __metadata("design:type", String)
], CreateTradingStrategyDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TradingConditionsDto),
    __metadata("design:type", TradingConditionsDto)
], CreateTradingStrategyDto.prototype, "conditions", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AutoTradingDto),
    __metadata("design:type", AutoTradingDto)
], CreateTradingStrategyDto.prototype, "autoTrading", void 0);
class UpdateTradingStrategyDto {
    name;
    description;
    type;
    conditions;
    autoTrading;
    status;
}
exports.UpdateTradingStrategyDto = UpdateTradingStrategyDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTradingStrategyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTradingStrategyDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(trading_strategy_types_1.StrategyType),
    __metadata("design:type", String)
], UpdateTradingStrategyDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TradingConditionsDto),
    __metadata("design:type", TradingConditionsDto)
], UpdateTradingStrategyDto.prototype, "conditions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AutoTradingDto),
    __metadata("design:type", AutoTradingDto)
], UpdateTradingStrategyDto.prototype, "autoTrading", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(trading_strategy_types_1.StrategyStatus),
    __metadata("design:type", String)
], UpdateTradingStrategyDto.prototype, "status", void 0);
class UpdateStrategyStatusDto {
    status;
}
exports.UpdateStrategyStatusDto = UpdateStrategyStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(trading_strategy_types_1.StrategyStatus),
    __metadata("design:type", String)
], UpdateStrategyStatusDto.prototype, "status", void 0);
class BacktestRequestDto {
    name;
    startDate;
    endDate;
    initialCapital;
    stockSymbols;
}
exports.BacktestRequestDto = BacktestRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BacktestRequestDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BacktestRequestDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BacktestRequestDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], BacktestRequestDto.prototype, "initialCapital", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BacktestRequestDto.prototype, "stockSymbols", void 0);
class TradingSignalDto {
    id;
    signalType;
    stockSymbol;
    price;
    volume;
    indicators;
    reason;
    confidence;
    executed;
    createdAt;
}
exports.TradingSignalDto = TradingSignalDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TradingSignalDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(trading_strategy_types_1.SignalType),
    __metadata("design:type", String)
], TradingSignalDto.prototype, "signalType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TradingSignalDto.prototype, "stockSymbol", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TradingSignalDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TradingSignalDto.prototype, "volume", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], TradingSignalDto.prototype, "indicators", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TradingSignalDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], TradingSignalDto.prototype, "confidence", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TradingSignalDto.prototype, "executed", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TradingSignalDto.prototype, "createdAt", void 0);
class BacktestResultDto {
    id;
    name;
    startDate;
    endDate;
    totalReturn;
    annualizedReturn;
    maxDrawdown;
    sharpeRatio;
    winRate;
    totalTrades;
    profitableTrades;
    averageWin;
    averageLoss;
    profitFactor;
    initialCapital;
    finalCapital;
    monthlyReturns;
    createdAt;
}
exports.BacktestResultDto = BacktestResultDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BacktestResultDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BacktestResultDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BacktestResultDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BacktestResultDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BacktestResultDto.prototype, "totalReturn", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BacktestResultDto.prototype, "annualizedReturn", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BacktestResultDto.prototype, "maxDrawdown", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BacktestResultDto.prototype, "sharpeRatio", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BacktestResultDto.prototype, "winRate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BacktestResultDto.prototype, "totalTrades", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BacktestResultDto.prototype, "profitableTrades", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BacktestResultDto.prototype, "averageWin", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BacktestResultDto.prototype, "averageLoss", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BacktestResultDto.prototype, "profitFactor", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BacktestResultDto.prototype, "initialCapital", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BacktestResultDto.prototype, "finalCapital", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], BacktestResultDto.prototype, "monthlyReturns", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BacktestResultDto.prototype, "createdAt", void 0);
class StrategyPerformanceDto {
    id;
    name;
    type;
    status;
    backtestSummary;
    totalSignals;
    executedSignals;
    lastExecutedAt;
    createdAt;
}
exports.StrategyPerformanceDto = StrategyPerformanceDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StrategyPerformanceDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StrategyPerformanceDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(trading_strategy_types_1.StrategyType),
    __metadata("design:type", String)
], StrategyPerformanceDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(trading_strategy_types_1.StrategyStatus),
    __metadata("design:type", String)
], StrategyPerformanceDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], StrategyPerformanceDto.prototype, "backtestSummary", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StrategyPerformanceDto.prototype, "totalSignals", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StrategyPerformanceDto.prototype, "executedSignals", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StrategyPerformanceDto.prototype, "lastExecutedAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StrategyPerformanceDto.prototype, "createdAt", void 0);
//# sourceMappingURL=trading-strategy.dto.js.map