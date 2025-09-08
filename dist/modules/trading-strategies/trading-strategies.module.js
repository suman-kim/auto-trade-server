"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradingStrategiesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const trading_strategies_controller_1 = require("./trading-strategies.controller");
const trading_strategies_service_1 = require("./trading-strategies.service");
const trading_strategy_entity_1 = require("../../entities/trading-strategy.entity");
const trading_signal_entity_1 = require("../../entities/trading-signal.entity");
const backtest_result_entity_1 = require("../../entities/backtest-result.entity");
const stock_entity_1 = require("../../entities/stock.entity");
const user_entity_1 = require("../../entities/user.entity");
const kis_api_service_1 = require("../../infrastructure/external/kis-api.service");
const technical_indicators_service_1 = require("../../infrastructure/services/technical-indicators.service");
let TradingStrategiesModule = class TradingStrategiesModule {
};
exports.TradingStrategiesModule = TradingStrategiesModule;
exports.TradingStrategiesModule = TradingStrategiesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                trading_strategy_entity_1.TradingStrategy,
                trading_signal_entity_1.TradingSignal,
                backtest_result_entity_1.BacktestResult,
                stock_entity_1.Stock,
                user_entity_1.User,
            ])
        ],
        controllers: [trading_strategies_controller_1.TradingStrategiesController],
        providers: [trading_strategies_service_1.TradingStrategiesService, kis_api_service_1.KisApiService, technical_indicators_service_1.TechnicalIndicatorsService],
        exports: [trading_strategies_service_1.TradingStrategiesService],
    })
], TradingStrategiesModule);
//# sourceMappingURL=trading-strategies.module.js.map