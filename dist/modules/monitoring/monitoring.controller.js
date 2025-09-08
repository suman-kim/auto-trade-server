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
exports.MonitoringController = void 0;
const common_1 = require("@nestjs/common");
const performance_monitor_service_1 = require("../../infrastructure/services/performance-monitor.service");
const error_tracking_service_1 = require("../../infrastructure/services/error-tracking.service");
const swagger_1 = require("@nestjs/swagger");
let MonitoringController = class MonitoringController {
    performanceMonitor;
    errorTracking;
    constructor(performanceMonitor, errorTracking) {
        this.performanceMonitor = performanceMonitor;
        this.errorTracking = errorTracking;
    }
    getMetrics() {
        return this.performanceMonitor.getMetrics();
    }
    generateReport() {
        return this.performanceMonitor.generatePerformanceReport();
    }
    getHealth() {
        const metrics = this.performanceMonitor.getMetrics();
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            system: {
                memory: metrics.system.memory,
                cpu: metrics.system.cpu,
            },
            performance: {
                totalRequests: metrics.requests.total,
                totalErrors: metrics.errors.total,
                errorRate: metrics.requests.total > 0 ? (metrics.errors.total / metrics.requests.total) * 100 : 0,
            },
        };
    }
    getErrorStatistics() {
        return this.errorTracking.getErrorStatistics();
    }
    getRecentErrors() {
        return this.errorTracking.getRecentErrors();
    }
    generateErrorReport() {
        return this.errorTracking.generateErrorReport();
    }
};
exports.MonitoringController = MonitoringController;
__decorate([
    (0, common_1.Get)('metrics'),
    (0, swagger_1.ApiOperation)({ summary: '성능 메트릭 조회', description: '현재 시스템의 성능 메트릭을 조회합니다.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '성능 메트릭 조회 성공' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('report'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('errors/statistics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "getErrorStatistics", null);
__decorate([
    (0, common_1.Get)('errors/recent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "getRecentErrors", null);
__decorate([
    (0, common_1.Get)('errors/report'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "generateErrorReport", null);
exports.MonitoringController = MonitoringController = __decorate([
    (0, swagger_1.ApiTags)('monitoring'),
    (0, common_1.Controller)('monitoring'),
    __metadata("design:paramtypes", [performance_monitor_service_1.PerformanceMonitorService,
        error_tracking_service_1.ErrorTrackingService])
], MonitoringController);
//# sourceMappingURL=monitoring.controller.js.map