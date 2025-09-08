"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const websocket_gateway_1 = require("./websocket.gateway");
const realtime_engine_service_1 = require("./realtime-engine.service");
const jwt_1 = require("@nestjs/jwt");
const kis_module_1 = require("../../infrastructure/external/kis.module");
const technical_indicators_service_1 = require("../../infrastructure/services/technical-indicators.service");
const trading_strategies_module_1 = require("../trading-strategies/trading-strategies.module");
const transactions_module_1 = require("../transactions/transactions.module");
const stocks_module_1 = require("../stocks/stocks.module");
const portfolios_module_1 = require("../portfolios/portfolios.module");
const portfolio_entity_1 = require("../../entities/portfolio.entity");
const portfolio_holding_entity_1 = require("../../entities/portfolio-holding.entity");
const stock_entity_1 = require("../../entities/stock.entity");
const transaction_entity_1 = require("../../entities/transaction.entity");
const order_module_1 = require("../order/order.module");
const users_module_1 = require("../users/users.module");
let WebSocketModule = class WebSocketModule {
};
exports.WebSocketModule = WebSocketModule;
exports.WebSocketModule = WebSocketModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([portfolio_entity_1.Portfolio, portfolio_holding_entity_1.PortfolioHolding, stock_entity_1.Stock, transaction_entity_1.Transaction]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: { expiresIn: '24h' },
            }),
            kis_module_1.KisModule,
            trading_strategies_module_1.TradingStrategiesModule,
            transactions_module_1.TransactionsModule,
            stocks_module_1.StocksModule,
            portfolios_module_1.PortfoliosModule,
            order_module_1.OrderModule,
            users_module_1.UsersModule
        ],
        controllers: [],
        providers: [
            websocket_gateway_1.TradingWebSocketGateway,
            realtime_engine_service_1.RealtimeEngineService,
            technical_indicators_service_1.TechnicalIndicatorsService,
        ],
        exports: [
            websocket_gateway_1.TradingWebSocketGateway,
            realtime_engine_service_1.RealtimeEngineService,
        ],
    })
], WebSocketModule);
//# sourceMappingURL=websocket.module.js.map