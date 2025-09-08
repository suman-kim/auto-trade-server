import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringController } from './monitoring.controller';
import { PerformanceMonitorService } from '../../infrastructure/services/performance-monitor.service';
import { ErrorTrackingService } from '../../infrastructure/services/error-tracking.service';

describe('MonitoringController', () => {
  let controller: MonitoringController;
  let performanceMonitor: jest.Mocked<PerformanceMonitorService>;
  let errorTracking: jest.Mocked<ErrorTrackingService>;

  const mockMetrics = {
    system: {
      memory: {
        total: 8589934592, // 8GB
        used: 4294967296,  // 4GB
        free: 4294967296,  // 4GB
        usage: 50.0
      },
      cpu: {
        usage: 25.5,
        cores: 8,
        loadAverage: [1.2, 1.1, 0.9]
      }
    },
    requests: {
      total: 1000,
      successful: 950,
      failed: 50,
      averageResponseTime: 150
    },
    errors: {
      total: 50,
      byType: {
        'ValidationError': 20,
        'DatabaseError': 15,
        'NetworkError': 15
      }
    }
  };

  const mockPerformanceReport = {
    summary: 'Performance Report',
    timestamp: new Date().toISOString(),
    metrics: mockMetrics,
    recommendations: [
      'Consider implementing caching for frequently accessed data',
      'Monitor database query performance'
    ]
  };

  const mockErrorStatistics = {
    totalErrors: 50,
    errorRate: 5.0,
    errorsByType: {
      'ValidationError': 20,
      'DatabaseError': 15,
      'NetworkError': 15
    },
    errorsByEndpoint: {
      '/api/users': 10,
      '/api/portfolios': 15,
      '/api/transactions': 25
    }
  };

  const mockRecentErrors = [
    {
      id: 1,
      type: 'ValidationError',
      message: 'Invalid input data',
      endpoint: '/api/users',
      timestamp: new Date(),
      stack: 'Error stack trace...'
    },
    {
      id: 2,
      type: 'DatabaseError',
      message: 'Connection timeout',
      endpoint: '/api/portfolios',
      timestamp: new Date(),
      stack: 'Error stack trace...'
    }
  ];

  const mockErrorReport = {
    summary: 'Error Report',
    timestamp: new Date().toISOString(),
    statistics: mockErrorStatistics,
    recentErrors: mockRecentErrors,
    recommendations: [
      'Implement input validation',
      'Add database connection pooling'
    ]
  };

  const mockNotificationService = {
    getMetrics: jest.fn(),
    generatePerformanceReport: jest.fn(),
  };

  const mockErrorTrackingService = {
    getErrorStatistics: jest.fn(),
    getRecentErrors: jest.fn(),
    generateErrorReport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitoringController],
      providers: [
        {
          provide: PerformanceMonitorService,
          useValue: mockNotificationService,
        },
        {
          provide: ErrorTrackingService,
          useValue: mockErrorTrackingService,
        },
      ],
    }).compile();

    controller = module.get<MonitoringController>(MonitoringController);
    performanceMonitor = module.get(PerformanceMonitorService);
    errorTracking = module.get(ErrorTrackingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMetrics', () => {
    it('should return performance metrics', () => {
      performanceMonitor.getMetrics.mockReturnValue(mockMetrics);

      const result = controller.getMetrics();

      expect(performanceMonitor.getMetrics).toHaveBeenCalled();
      expect(result).toEqual(mockMetrics);
    });

    it('should handle metrics retrieval errors', () => {
      performanceMonitor.getMetrics.mockImplementation(() => {
        throw new Error('Metrics retrieval failed');
      });

      expect(() => controller.getMetrics()).toThrow('Metrics retrieval failed');
    });
  });

  describe('generateReport', () => {
    it('should generate performance report', () => {
      performanceMonitor.generatePerformanceReport.mockReturnValue(mockPerformanceReport);

      const result = controller.generateReport();

      expect(performanceMonitor.generatePerformanceReport).toHaveBeenCalled();
      expect(result).toEqual(mockPerformanceReport);
    });

    it('should handle report generation errors', () => {
      performanceMonitor.generatePerformanceReport.mockImplementation(() => {
        throw new Error('Report generation failed');
      });

      expect(() => controller.generateReport()).toThrow('Report generation failed');
    });
  });

  describe('getHealth', () => {
    it('should return system health status', () => {
      performanceMonitor.getMetrics.mockReturnValue(mockMetrics);

      const result = controller.getHealth();

      expect(performanceMonitor.getMetrics).toHaveBeenCalled();
      expect(result).toEqual({
        status: 'healthy',
        timestamp: expect.any(String),
        system: {
          memory: mockMetrics.system.memory,
          cpu: mockMetrics.system.cpu,
        },
        performance: {
          totalRequests: mockMetrics.requests.total,
          totalErrors: mockMetrics.errors.total,
          errorRate: 5.0, // (50 / 1000) * 100
        },
      });
    });

    it('should calculate error rate correctly when no requests', () => {
      const metricsWithNoRequests = {
        ...mockMetrics,
        requests: { ...mockMetrics.requests, total: 0 },
        errors: { ...mockMetrics.errors, total: 0 }
      };

      performanceMonitor.getMetrics.mockReturnValue(metricsWithNoRequests);

      const result = controller.getHealth();

      expect(result.performance.errorRate).toBe(0);
    });

    it('should handle health check errors', () => {
      performanceMonitor.getMetrics.mockImplementation(() => {
        throw new Error('Health check failed');
      });

      expect(() => controller.getHealth()).toThrow('Health check failed');
    });
  });

  describe('getErrorStatistics', () => {
    it('should return error statistics', () => {
      errorTracking.getErrorStatistics.mockReturnValue(mockErrorStatistics);

      const result = controller.getErrorStatistics();

      expect(errorTracking.getErrorStatistics).toHaveBeenCalled();
      expect(result).toEqual(mockErrorStatistics);
    });

    it('should handle error statistics retrieval errors', () => {
      errorTracking.getErrorStatistics.mockImplementation(() => {
        throw new Error('Error statistics retrieval failed');
      });

      expect(() => controller.getErrorStatistics()).toThrow('Error statistics retrieval failed');
    });
  });

  describe('getRecentErrors', () => {
    it('should return recent errors', () => {
      errorTracking.getRecentErrors.mockReturnValue(mockRecentErrors);

      const result = controller.getRecentErrors();

      expect(errorTracking.getRecentErrors).toHaveBeenCalled();
      expect(result).toEqual(mockRecentErrors);
    });

    it('should handle recent errors retrieval errors', () => {
      errorTracking.getRecentErrors.mockImplementation(() => {
        throw new Error('Recent errors retrieval failed');
      });

      expect(() => controller.getRecentErrors()).toThrow('Recent errors retrieval failed');
    });
  });

  describe('generateErrorReport', () => {
    it('should generate error report', () => {
      errorTracking.generateErrorReport.mockReturnValue(mockErrorReport);

      const result = controller.generateErrorReport();

      expect(errorTracking.generateErrorReport).toHaveBeenCalled();
      expect(result).toEqual(mockErrorReport);
    });

    it('should handle error report generation errors', () => {
      errorTracking.generateErrorReport.mockImplementation(() => {
        throw new Error('Error report generation failed');
      });

      expect(() => controller.generateErrorReport()).toThrow('Error report generation failed');
    });
  });

  describe('integration tests', () => {
    it('should handle multiple service calls correctly', () => {
      performanceMonitor.getMetrics.mockReturnValue(mockMetrics);
      errorTracking.getErrorStatistics.mockReturnValue(mockErrorStatistics);

      const healthResult = controller.getHealth();
      const errorStatsResult = controller.getErrorStatistics();

      expect(healthResult.status).toBe('healthy');
      expect(errorStatsResult.totalErrors).toBe(50);
      expect(performanceMonitor.getMetrics).toHaveBeenCalledTimes(1);
      expect(errorTracking.getErrorStatistics).toHaveBeenCalledTimes(1);
    });

    it('should handle service failures gracefully', () => {
      performanceMonitor.getMetrics.mockImplementation(() => {
        throw new Error('Service unavailable');
      });

      expect(() => controller.getHealth()).toThrow('Service unavailable');
      expect(() => controller.getMetrics()).toThrow('Service unavailable');
    });
  });
});

