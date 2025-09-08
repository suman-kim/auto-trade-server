import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response, NextFunction } from 'express';
import { SecurityMiddleware } from '../../shared/middleware/security.middleware';

describe('SecurityMiddleware', () => {
  let middleware: SecurityMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityMiddleware],
    }).compile();

    middleware = module.get<SecurityMiddleware>(SecurityMiddleware);
  });

  beforeEach(() => {
    mockRequest = {
      path: '/api/test',
      ip: '127.0.0.1',
      get: jest.fn(),
    };
    
    mockResponse = {
      setHeader: jest.fn(),
    };
    
    mockNext = jest.fn();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    it('should set security headers', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Security-Policy', expect.any(String));
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Referrer-Policy', 'strict-origin-when-cross-origin');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Permissions-Policy', expect.any(String));
    });

    it('should call next function', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should apply auth rate limiting for auth paths', () => {
      mockRequest.path = '/auth/login';
      mockRequest.get = jest.fn().mockReturnValue('Mozilla/5.0');

      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should apply API rate limiting for API paths', () => {
      mockRequest.path = '/api/users';
      mockRequest.get = jest.fn().mockReturnValue('Mozilla/5.0');

      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('setSecurityHeaders', () => {
    it('should set all required security headers', () => {
      const response = mockResponse as Response;
      
      // Private method를 테스트하기 위해 any로 캐스팅
      (middleware as any).setSecurityHeaders(response);

      expect(response.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
      expect(response.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
      expect(response.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
      expect(response.setHeader).toHaveBeenCalledWith('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      expect(response.setHeader).toHaveBeenCalledWith('Content-Security-Policy', expect.any(String));
      expect(response.setHeader).toHaveBeenCalledWith('Referrer-Policy', 'strict-origin-when-cross-origin');
      expect(response.setHeader).toHaveBeenCalledWith('Permissions-Policy', expect.any(String));
    });
  });

  describe('applyRateLimiting', () => {
    it('should apply auth rate limiting for auth paths', () => {
      mockRequest.path = '/auth/register';
      const response = mockResponse as Response;
      
      // Private method를 테스트하기 위해 any로 캐스팅
      (middleware as any).applyRateLimiting(mockRequest as Request, response);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should apply API rate limiting for API paths', () => {
      mockRequest.path = '/api/portfolio';
      const response = mockResponse as Response;
      
      // Private method를 테스트하기 위해 any로 캐스팅
      (middleware as any).applyRateLimiting(mockRequest as Request, response);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});

