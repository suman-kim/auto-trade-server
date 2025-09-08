import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SecurityGuard } from './security.guard';

describe('SecurityGuard', () => {
  let guard: SecurityGuard;
  let mockExecutionContext: ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityGuard],
    }).compile();

    guard = module.get<SecurityGuard>(SecurityGuard);
  });

  beforeEach(() => {
    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({} as Request),
        getResponse: () => ({} as Response),
        getNext: () => ({} as NextFunction),
      } as any),
    } as ExecutionContext;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow valid localhost IP', () => {
      const mockRequest = {
        headers: {},
        connection: { remoteAddress: '127.0.0.1' },
        socket: { remoteAddress: '127.0.0.1' },
      } as any;

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({} as Response),
        getNext: () => ({} as NextFunction),
      } as any);

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should allow valid private network IP', () => {
      const mockRequest = {
        headers: {},
        connection: { remoteAddress: '192.168.1.100' },
        socket: { remoteAddress: '192.168.1.100' },
      } as any;

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({} as Response),
        getNext: () => ({} as NextFunction),
      } as any);

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should allow X-Forwarded-For header IP', () => {
      const mockRequest = {
        headers: { 'x-forwarded-for': '127.0.0.1' },
        connection: { remoteAddress: '10.0.0.1' },
        socket: { remoteAddress: '10.0.0.1' },
      } as any;

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({} as Response),
        getNext: () => ({} as NextFunction),
      } as any);

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should allow X-Real-IP header IP', () => {
      const mockRequest = {
        headers: { 'x-real-ip': '127.0.0.1' },
        connection: { remoteAddress: '10.0.0.1' },
        socket: { remoteAddress: '10.0.0.1' },
      } as any;

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({} as Response),
        getNext: () => ({} as NextFunction),
      } as any);

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should reject suspicious User-Agent', () => {
      const mockRequest = {
        headers: { 'user-agent': 'bot' },
        connection: { remoteAddress: '127.0.0.1' },
        socket: { remoteAddress: '127.0.0.1' },
      } as any;

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({} as Response),
        getNext: () => ({} as NextFunction),
      } as any);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        BadRequestException
      );
    });

    it('should reject missing User-Agent', () => {
      const mockRequest = {
        headers: {},
        connection: { remoteAddress: '127.0.0.1' },
        socket: { remoteAddress: '127.0.0.1' },
      } as any;

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({} as Response),
        getNext: () => ({} as NextFunction),
      } as any);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        BadRequestException
      );
    });

    it('should reject large request size', () => {
      const mockRequest = {
        headers: { 'content-length': '11000000', 'user-agent': 'Mozilla/5.0' },
        connection: { remoteAddress: '127.0.0.1' },
        socket: { remoteAddress: '127.0.0.1' },
      } as any;

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({} as Response),
        getNext: () => ({} as NextFunction),
      } as any);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        BadRequestException
      );
    });

    it('should allow normal request with valid User-Agent', () => {
      const mockRequest = {
        headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        connection: { remoteAddress: '127.0.0.1' },
        socket: { remoteAddress: '127.0.0.1' },
      } as any;

      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({} as Response),
        getNext: () => ({} as NextFunction),
      } as any);

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });
});
