"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfoliosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const portfolios_controller_1 = require("./portfolios.controller");
const portfolios_service_1 = require("./portfolios.service");
const portfolio_returns_service_1 = require("./portfolio-returns.service");
const portfolio_entity_1 = require("../../entities/portfolio.entity");
const portfolio_holding_entity_1 = require("../../entities/portfolio-holding.entity");
const stock_entity_1 = require("../../entities/stock.entity");
const stocks_module_1 = require("../stocks/stocks.module");
let PortfoliosModule = class PortfoliosModule {
};
exports.PortfoliosModule = PortfoliosModule;
exports.PortfoliosModule = PortfoliosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([portfolio_entity_1.Portfolio, portfolio_holding_entity_1.PortfolioHolding, stock_entity_1.Stock]),
            stocks_module_1.StocksModule,
        ],
        controllers: [portfolios_controller_1.PortfoliosController],
        providers: [portfolios_service_1.PortfoliosService, portfolio_returns_service_1.PortfolioReturnsService],
        exports: [portfolios_service_1.PortfoliosService, portfolio_returns_service_1.PortfolioReturnsService],
    })
], PortfoliosModule);
//# sourceMappingURL=portfolios.module.js.map