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
var PerformanceMonitorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMonitorService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const events_1 = require("events");
const os = require("os");
let PerformanceMonitorService = PerformanceMonitorService_1 = class PerformanceMonitorService extends events_1.EventEmitter {
    logger = new common_1.Logger(PerformanceMonitorService_1.name);
    metrics = {
        apiResponseTimes: new Map(),
        databaseQueryTimes: new Map(),
        memoryUsage: [],
        cpuUsage: [],
        activeConnections: 0,
        errorCount: 0,
        requestCount: 0,
    };
    thresholds = {
        apiResponseTime: 1000,
        databaseQueryTime: 500,
        memoryUsage: 80,
        cpuUsage: 90,
    };
    constructor() {
        super();
        this.startMonitoring();
    }
    recordApiResponseTime(endpoint, responseTime) {
        if (!this.metrics.apiResponseTimes.has(endpoint)) {
            this.metrics.apiResponseTimes.set(endpoint, []);
        }
        const times = this.metrics.apiResponseTimes.get(endpoint);
        times.push(responseTime);
        if (times.length > 100) {
            times.shift();
        }
        if (responseTime > this.thresholds.apiResponseTime) {
            this.logger.warn(`API 응답 시간 임계값 초과: ${endpoint} - ${responseTime}ms`);
            this.emit('apiSlowResponse', { endpoint, responseTime });
        }
        this.metrics.requestCount++;
    }
    recordDatabaseQueryTime(query, queryTime) {
        if (!this.metrics.databaseQueryTimes.has(query)) {
            this.metrics.databaseQueryTimes.set(query, []);
        }
        const times = this.metrics.databaseQueryTimes.get(query);
        times.push(queryTime);
        if (times.length > 50) {
            times.shift();
        }
        if (queryTime > this.thresholds.databaseQueryTime) {
            this.logger.warn(`데이터베이스 쿼리 시간 임계값 초과: ${query} - ${queryTime}ms`);
            this.emit('databaseSlowQuery', { query, queryTime });
        }
    }
    recordError() {
        this.metrics.errorCount++;
        this.emit('errorRecorded', { errorCount: this.metrics.errorCount });
    }
    updateActiveConnections(count) {
        this.metrics.activeConnections = count;
        this.emit('connectionCountChanged', { activeConnections: count });
    }
    monitorSystemResources() {
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;
        const memoryUsagePercent = (usedMemory / totalMemory) * 100;
        this.metrics.memoryUsage.push(memoryUsagePercent);
        if (this.metrics.memoryUsage.length > 100) {
            this.metrics.memoryUsage.shift();
        }
        const cpuUsage = this.getCpuUsage();
        this.metrics.cpuUsage.push(cpuUsage);
        if (this.metrics.cpuUsage.length > 100) {
            this.metrics.cpuUsage.shift();
        }
        if (memoryUsagePercent > this.thresholds.memoryUsage) {
            this.logger.warn(`메모리 사용량 임계값 초과: ${memoryUsagePercent.toFixed(2)}%`);
            this.emit('highMemoryUsage', { memoryUsage: memoryUsagePercent });
        }
        if (cpuUsage > this.thresholds.cpuUsage) {
            this.logger.warn(`CPU 사용량 임계값 초과: ${cpuUsage.toFixed(2)}%`);
            this.emit('highCpuUsage', { cpuUsage });
        }
        this.logger.debug(`시스템 리소스 - 메모리: ${memoryUsagePercent.toFixed(2)}%, CPU: ${cpuUsage.toFixed(2)}%`);
    }
    getCpuUsage() {
        const cpus = os.cpus();
        let totalIdle = 0;
        let totalTick = 0;
        cpus.forEach(cpu => {
            for (const type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        });
        return 100 - (totalIdle / totalTick) * 100;
    }
    getMetrics() {
        const apiMetrics = {};
        this.metrics.apiResponseTimes.forEach((times, endpoint) => {
            apiMetrics[endpoint] = {
                average: this.calculateAverage(times),
                min: times.length > 0 ? Math.min(...times) : 0,
                max: times.length > 0 ? Math.max(...times) : 0,
                count: times.length,
            };
        });
        const dbMetrics = {};
        this.metrics.databaseQueryTimes.forEach((times, query) => {
            dbMetrics[query] = {
                average: this.calculateAverage(times),
                min: times.length > 0 ? Math.min(...times) : 0,
                max: times.length > 0 ? Math.max(...times) : 0,
                count: times.length,
            };
        });
        return {
            api: apiMetrics,
            database: dbMetrics,
            system: {
                memory: {
                    current: this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1] || 0,
                    average: this.calculateAverage(this.metrics.memoryUsage),
                    max: this.metrics.memoryUsage.length > 0 ? Math.max(...this.metrics.memoryUsage) : 0,
                },
                cpu: {
                    current: this.metrics.cpuUsage[this.metrics.cpuUsage.length - 1] || 0,
                    average: this.calculateAverage(this.metrics.cpuUsage),
                    max: this.metrics.cpuUsage.length > 0 ? Math.max(...this.metrics.cpuUsage) : 0,
                },
            },
            connections: {
                active: this.metrics.activeConnections,
            },
            errors: {
                total: this.metrics.errorCount,
            },
            requests: {
                total: this.metrics.requestCount,
            },
        };
    }
    calculateAverage(numbers) {
        if (numbers.length === 0)
            return 0;
        return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    }
    generatePerformanceReport() {
        const metrics = this.getMetrics();
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalRequests: metrics.requests.total,
                totalErrors: metrics.errors.total,
                errorRate: metrics.requests.total > 0 ? (metrics.errors.total / metrics.requests.total) * 100 : 0,
                averageMemoryUsage: metrics.system.memory.average,
                averageCpuUsage: metrics.system.cpu.average,
            },
            alerts: this.generateAlerts(metrics),
            recommendations: this.generateRecommendations(metrics),
        };
        this.logger.log('성능 리포트 생성 완료');
        return report;
    }
    generateAlerts(metrics) {
        const alerts = [];
        if (metrics.system.memory.current > this.thresholds.memoryUsage) {
            alerts.push(`메모리 사용량이 높습니다: ${metrics.system.memory.current.toFixed(2)}%`);
        }
        if (metrics.system.cpu.current > this.thresholds.cpuUsage) {
            alerts.push(`CPU 사용량이 높습니다: ${metrics.system.cpu.current.toFixed(2)}%`);
        }
        if (metrics.errors.total > 100) {
            alerts.push(`에러 발생 횟수가 많습니다: ${metrics.errors.total}회`);
        }
        return alerts;
    }
    generateRecommendations(metrics) {
        const recommendations = [];
        if (metrics.system.memory.average > 70) {
            recommendations.push('메모리 사용량이 높습니다. 메모리 최적화를 고려하세요.');
        }
        if (metrics.system.cpu.average > 80) {
            recommendations.push('CPU 사용량이 높습니다. 작업 분산을 고려하세요.');
        }
        if (metrics.errors.total > 50) {
            recommendations.push('에러 발생이 많습니다. 에러 처리 로직을 검토하세요.');
        }
        return recommendations;
    }
    startMonitoring() {
        this.logger.log('성능 모니터링 서비스 시작');
        this.on('apiSlowResponse', (data) => {
            this.logger.warn(`느린 API 응답 감지: ${data.endpoint} - ${data.responseTime}ms`);
        });
        this.on('databaseSlowQuery', (data) => {
            this.logger.warn(`느린 데이터베이스 쿼리 감지: ${data.query} - ${data.queryTime}ms`);
        });
        this.on('highMemoryUsage', (data) => {
            this.logger.warn(`높은 메모리 사용량: ${data.memoryUsage.toFixed(2)}%`);
        });
        this.on('highCpuUsage', (data) => {
            this.logger.warn(`높은 CPU 사용량: ${data.cpuUsage.toFixed(2)}%`);
        });
    }
    resetMetrics() {
        this.metrics = {
            apiResponseTimes: new Map(),
            databaseQueryTimes: new Map(),
            memoryUsage: [],
            cpuUsage: [],
            activeConnections: 0,
            errorCount: 0,
            requestCount: 0,
        };
        this.logger.log('성능 메트릭 초기화 완료');
    }
};
exports.PerformanceMonitorService = PerformanceMonitorService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PerformanceMonitorService.prototype, "monitorSystemResources", null);
exports.PerformanceMonitorService = PerformanceMonitorService = PerformanceMonitorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PerformanceMonitorService);
//# sourceMappingURL=performance-monitor.service.js.map