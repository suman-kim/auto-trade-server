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
exports.ExportPortfolioDto = exports.RebalancePortfolioDto = exports.PortfolioPerformanceDto = exports.PortfolioSummaryDto = exports.PortfolioHoldingResponseDto = exports.PortfolioResponseDto = exports.UpdateHoldingDto = exports.AddHoldingDto = exports.UpdatePortfolioDto = exports.CreatePortfolioDto = void 0;
const class_validator_1 = require("class-validator");
class CreatePortfolioDto {
    name;
    description;
}
exports.CreatePortfolioDto = CreatePortfolioDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePortfolioDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePortfolioDto.prototype, "description", void 0);
class UpdatePortfolioDto {
    name;
    description;
}
exports.UpdatePortfolioDto = UpdatePortfolioDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePortfolioDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePortfolioDto.prototype, "description", void 0);
class AddHoldingDto {
    symbol;
    quantity;
    averagePrice;
    purchaseDate;
    notes;
}
exports.AddHoldingDto = AddHoldingDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddHoldingDto.prototype, "symbol", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], AddHoldingDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], AddHoldingDto.prototype, "averagePrice", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddHoldingDto.prototype, "purchaseDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddHoldingDto.prototype, "notes", void 0);
class UpdateHoldingDto {
    quantity;
    averagePrice;
    notes;
}
exports.UpdateHoldingDto = UpdateHoldingDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateHoldingDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateHoldingDto.prototype, "averagePrice", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHoldingDto.prototype, "notes", void 0);
class PortfolioResponseDto {
    id;
    name;
    description;
    riskLevel;
    targetReturn;
    totalValue;
    totalCost;
    totalReturn;
    totalReturnPercent;
    holdingsCount;
    createdAt;
    updatedAt;
}
exports.PortfolioResponseDto = PortfolioResponseDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PortfolioResponseDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PortfolioResponseDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PortfolioResponseDto.prototype, "riskLevel", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PortfolioResponseDto.prototype, "targetReturn", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioResponseDto.prototype, "totalValue", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioResponseDto.prototype, "totalCost", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioResponseDto.prototype, "totalReturn", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioResponseDto.prototype, "totalReturnPercent", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioResponseDto.prototype, "holdingsCount", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PortfolioResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PortfolioResponseDto.prototype, "updatedAt", void 0);
class PortfolioHoldingResponseDto {
    id;
    symbol;
    companyName;
    quantity;
    averagePrice;
    currentPrice;
    marketValue;
    totalCost;
    unrealizedGain;
    unrealizedGainPercent;
    purchaseDate;
    notes;
    createdAt;
    updatedAt;
}
exports.PortfolioHoldingResponseDto = PortfolioHoldingResponseDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioHoldingResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PortfolioHoldingResponseDto.prototype, "symbol", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PortfolioHoldingResponseDto.prototype, "companyName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioHoldingResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioHoldingResponseDto.prototype, "averagePrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioHoldingResponseDto.prototype, "currentPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioHoldingResponseDto.prototype, "marketValue", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioHoldingResponseDto.prototype, "totalCost", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioHoldingResponseDto.prototype, "unrealizedGain", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioHoldingResponseDto.prototype, "unrealizedGainPercent", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PortfolioHoldingResponseDto.prototype, "purchaseDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PortfolioHoldingResponseDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PortfolioHoldingResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PortfolioHoldingResponseDto.prototype, "updatedAt", void 0);
class PortfolioSummaryDto {
    id;
    name;
    totalValue;
    totalCost;
    totalReturn;
    totalReturnPercent;
    holdingsCount;
    lastUpdated;
}
exports.PortfolioSummaryDto = PortfolioSummaryDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioSummaryDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PortfolioSummaryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioSummaryDto.prototype, "totalValue", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioSummaryDto.prototype, "totalCost", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioSummaryDto.prototype, "totalReturn", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioSummaryDto.prototype, "totalReturnPercent", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioSummaryDto.prototype, "holdingsCount", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PortfolioSummaryDto.prototype, "lastUpdated", void 0);
class PortfolioPerformanceDto {
    portfolioId;
    portfolioName;
    totalValue;
    totalCost;
    totalReturn;
    totalReturnPercent;
    dailyReturn;
    dailyReturnPercent;
    weeklyReturn;
    weeklyReturnPercent;
    monthlyReturn;
    monthlyReturnPercent;
    yearlyReturn;
    yearlyReturnPercent;
    sharpeRatio;
    maxDrawdown;
    volatility;
    lastUpdated;
}
exports.PortfolioPerformanceDto = PortfolioPerformanceDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioPerformanceDto.prototype, "portfolioId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PortfolioPerformanceDto.prototype, "portfolioName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioPerformanceDto.prototype, "totalValue", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioPerformanceDto.prototype, "totalCost", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioPerformanceDto.prototype, "totalReturn", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioPerformanceDto.prototype, "totalReturnPercent", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioPerformanceDto.prototype, "dailyReturn", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioPerformanceDto.prototype, "dailyReturnPercent", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioPerformanceDto.prototype, "weeklyReturn", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioPerformanceDto.prototype, "weeklyReturnPercent", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioPerformanceDto.prototype, "monthlyReturn", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioPerformanceDto.prototype, "monthlyReturnPercent", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioPerformanceDto.prototype, "yearlyReturn", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioPerformanceDto.prototype, "yearlyReturnPercent", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioPerformanceDto.prototype, "sharpeRatio", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioPerformanceDto.prototype, "maxDrawdown", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PortfolioPerformanceDto.prototype, "volatility", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PortfolioPerformanceDto.prototype, "lastUpdated", void 0);
class RebalancePortfolioDto {
    symbol;
    targetPercentage;
    notes;
}
exports.RebalancePortfolioDto = RebalancePortfolioDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RebalancePortfolioDto.prototype, "symbol", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], RebalancePortfolioDto.prototype, "targetPercentage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RebalancePortfolioDto.prototype, "notes", void 0);
class ExportPortfolioDto {
    format;
    startDate;
    endDate;
    dataType;
}
exports.ExportPortfolioDto = ExportPortfolioDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['csv', 'pdf', 'json']),
    __metadata("design:type", String)
], ExportPortfolioDto.prototype, "format", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ExportPortfolioDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ExportPortfolioDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['all', 'holdings', 'transactions', 'performance']),
    __metadata("design:type", String)
], ExportPortfolioDto.prototype, "dataType", void 0);
//# sourceMappingURL=portfolio.dto.js.map