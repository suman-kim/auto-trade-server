import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockExecutionContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn(() => ({
        headers: {
          authorization: 'Bearer valid-token',
        },
      })),
    })),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true when @Public() decorator is present', async () => {
      // Arrange
      mockReflector.getAllAndOverride.mockReturnValue(true);

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
      expect(result).toBe(true);
    });

    it('should call super.canActivate when @Public() decorator is not present', async () => {
      // Arrange
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const superCanActivateSpy = jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate');
      superCanActivateSpy.mockReturnValue(true);

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
      expect(superCanActivateSpy).toHaveBeenCalledWith(mockExecutionContext);
      expect(result).toBe(true);

      // Cleanup
      superCanActivateSpy.mockRestore();
    });

    it('should call super.canActivate when @Public() decorator is undefined', async () => {
      // Arrange
      mockReflector.getAllAndOverride.mockReturnValue(undefined);
      const superCanActivateSpy = jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate');
      superCanActivateSpy.mockReturnValue(true);

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
      expect(superCanActivateSpy).toHaveBeenCalledWith(mockExecutionContext);
      expect(result).toBe(true);

      // Cleanup
      superCanActivateSpy.mockRestore();
    });
  });

  describe('handleRequest', () => {
    it('should return user when authentication is successful', () => {
      // Arrange
      const mockUser = { id: 1, email: 'test@example.com' };
      const err = null;
      const info = null;

      // Act
      const result = guard.handleRequest(err, mockUser, info);

      // Assert
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user is null', () => {
      // Arrange
      const err = null;
      const user = null;
      const info = null;

      // Act & Assert
      expect(() => guard.handleRequest(err, user, info)).toThrow(
        new UnauthorizedException('인증이 필요합니다.'),
      );
    });

    it('should throw UnauthorizedException when user is undefined', () => {
      // Arrange
      const err = null;
      const user = undefined;
      const info = null;

      // Act & Assert
      expect(() => guard.handleRequest(err, user, info)).toThrow(
        new UnauthorizedException('인증이 필요합니다.'),
      );
    });

    it('should throw original error when err is provided', () => {
      // Arrange
      const customError = new Error('Custom authentication error');
      const user = { id: 1, email: 'test@example.com' };
      const info = null;

      // Act & Assert
      expect(() => guard.handleRequest(customError, user, info)).toThrow(customError);
    });

    it('should throw original error when both err and no user are provided', () => {
      // Arrange
      const customError = new Error('Custom authentication error');
      const user = null;
      const info = null;

      // Act & Assert
      expect(() => guard.handleRequest(customError, user, info)).toThrow(customError);
    });

    it('should handle authentication info parameter', () => {
      // Arrange
      const mockUser = { id: 1, email: 'test@example.com' };
      const err = null;
      const info = { message: 'Token expired' };

      // Act
      const result = guard.handleRequest(err, mockUser, info);

      // Assert
      expect(result).toEqual(mockUser);
    });
  });
});

