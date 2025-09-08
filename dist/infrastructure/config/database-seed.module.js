"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSeedModule = void 0;
const common_1 = require("@nestjs/common");
const database_seed_service_1 = require("./database-seed.service");
const stocks_module_1 = require("../../modules/stocks/stocks.module");
const typeorm_1 = require("@nestjs/typeorm");
const stock_entity_1 = require("../../entities/stock.entity");
const user_entity_1 = require("../../entities/user.entity");
const portfolio_entity_1 = require("../../entities/portfolio.entity");
const portfolio_holding_entity_1 = require("../../entities/portfolio-holding.entity");
const transaction_entity_1 = require("../../entities/transaction.entity");
const trading_strategy_entity_1 = require("../../entities/trading-strategy.entity");
const users_module_1 = require("../../modules/users/users.module");
const portfolios_module_1 = require("../../modules/portfolios/portfolios.module");
const transactions_module_1 = require("../../modules/transactions/transactions.module");
const trading_strategies_module_1 = require("../../modules/trading-strategies/trading-strategies.module");
let DatabaseSeedModule = class DatabaseSeedModule {
};
exports.DatabaseSeedModule = DatabaseSeedModule;
exports.DatabaseSeedModule = DatabaseSeedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([stock_entity_1.Stock, user_entity_1.User, portfolio_entity_1.Portfolio, portfolio_holding_entity_1.PortfolioHolding, transaction_entity_1.Transaction, trading_strategy_entity_1.TradingStrategy]),
            stocks_module_1.StocksModule,
            users_module_1.UsersModule,
            portfolios_module_1.PortfoliosModule,
            transactions_module_1.TransactionsModule,
            trading_strategies_module_1.TradingStrategiesModule,
        ],
        providers: [database_seed_service_1.DatabaseSeedService]
    })
], DatabaseSeedModule);
//# sourceMappingURL=database-seed.module.js.map