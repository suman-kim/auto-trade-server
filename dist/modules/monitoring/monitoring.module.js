"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringModule = void 0;
const common_1 = require("@nestjs/common");
const monitoring_controller_1 = require("./monitoring.controller");
const performance_monitor_service_1 = require("../../infrastructure/services/performance-monitor.service");
const error_tracking_service_1 = require("../../infrastructure/services/error-tracking.service");
let MonitoringModule = class MonitoringModule {
};
exports.MonitoringModule = MonitoringModule;
exports.MonitoringModule = MonitoringModule = __decorate([
    (0, common_1.Module)({
        controllers: [monitoring_controller_1.MonitoringController],
        providers: [performance_monitor_service_1.PerformanceMonitorService, error_tracking_service_1.ErrorTrackingService],
        exports: [performance_monitor_service_1.PerformanceMonitorService, error_tracking_service_1.ErrorTrackingService],
    })
], MonitoringModule);
//# sourceMappingURL=monitoring.module.js.map