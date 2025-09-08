import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';
import { User } from '../../domain/entities/user.entity';
import { JwtPayload } from './jwt.strategy';

describe('JwtAuthService', () => {
  let service: JwtAuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    passwordHash: 'hashedPassword',
    firstName: '홍',
    lastName: '길동',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    notifications: [],
    portfolios: [],
    transactions: [],
    tradingStrategies: [],
    notificationSettings: [],
    priceAlerts: [],
    get fullName() { return `${this.firstName} ${this.lastName}`.trim(); },
    isUserActive() { return this.isActive; }
  };

  const mockPayload: JwtPayload = {
    sub: mockUser.id,
    email: mockUser.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1시간 후 만료
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<JwtAuthService>(JwtAuthService);
    jwtService = module.get<JwtService>(JwtService);

    // 환경변수 설정
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  afterEach(() => {
    jest.clearAllMocks();
    // 환경변수 정리
    delete process.env.JWT_SECRET;
    delete process.env.JWT_REFRESH_SECRET;
    delete process.env.JWT_EXPIRES_IN;
  });

  describe('generateAccessToken', () => {
    it('should generate access token successfully', () => {
      // Arrange
      const expectedToken = 'access-token';
      mockJwtService.sign.mockReturnValue(expectedToken);

      // Act
      const result = service.generateAccessToken(mockUser);

      // Assert
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          sub: mockUser.id,
          email: mockUser.email,
        },
        {
          secret: 'test-secret',
          expiresIn: '1h',
        },
      );
      expect(result).toBe(expectedToken);
    });

    it('should use default values when environment variables are not set', () => {
      // Arrange
      delete process.env.JWT_SECRET;
      delete process.env.JWT_EXPIRES_IN;
      const expectedToken = 'access-token';
      mockJwtService.sign.mockReturnValue(expectedToken);

      // Act
      const result = service.generateAccessToken(mockUser);

      // Assert
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          sub: mockUser.id,
          email: mockUser.email,
        },
        {
          secret: 'your-super-secret-jwt-key-change-in-production',
          expiresIn: '24h',
        },
      );
      expect(result).toBe(expectedToken);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token successfully', () => {
      // Arrange
      const expectedToken = 'refresh-token';
      mockJwtService.sign.mockReturnValue(expectedToken);

      // Act
      const result = service.generateRefreshToken(mockUser);

      // Assert
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          sub: mockUser.id,
          email: mockUser.email,
        },
        {
          secret: 'test-refresh-secret',
          expiresIn: '7d',
        },
      );
      expect(result).toBe(expectedToken);
    });

    it('should use default secret when environment variable is not set', () => {
      // Arrange
      delete process.env.JWT_REFRESH_SECRET;
      const expectedToken = 'refresh-token';
      mockJwtService.sign.mockReturnValue(expectedToken);

      // Act
      const result = service.generateRefreshToken(mockUser);

      // Assert
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          sub: mockUser.id,
          email: mockUser.email,
        },
        {
          secret: 'your-super-secret-refresh-key-change-in-production',
          expiresIn: '7d',
        },
      );
      expect(result).toBe(expectedToken);
    });
  });

  describe('verifyToken', () => {
    it('should verify token successfully', () => {
      // Arrange
      const token = 'valid-token';
      mockJwtService.verify.mockReturnValue(mockPayload);

      // Act
      const result = service.verifyToken(token);

      // Assert
      expect(mockJwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'test-secret',
      });
      expect(result).toEqual(mockPayload);
    });

    it('should throw error when token is invalid', () => {
      // Arrange
      const token = 'invalid-token';
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      expect(() => service.verifyToken(token)).toThrow('유효하지 않은 토큰입니다.');
      expect(mockJwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'test-secret',
      });
    });

    it('should use default secret when environment variable is not set', () => {
      // Arrange
      delete process.env.JWT_SECRET;
      const token = 'valid-token';
      mockJwtService.verify.mockReturnValue(mockPayload);

      // Act
      const result = service.verifyToken(token);

      // Assert
      expect(mockJwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'your-super-secret-jwt-key-change-in-production',
      });
      expect(result).toEqual(mockPayload);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify refresh token successfully', () => {
      // Arrange
      const token = 'valid-refresh-token';
      mockJwtService.verify.mockReturnValue(mockPayload);

      // Act
      const result = service.verifyRefreshToken(token);

      // Assert
      expect(mockJwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'test-refresh-secret',
      });
      expect(result).toEqual(mockPayload);
    });

    it('should throw error when refresh token is invalid', () => {
      // Arrange
      const token = 'invalid-refresh-token';
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      expect(() => service.verifyRefreshToken(token)).toThrow('유효하지 않은 리프레시 토큰입니다.');
      expect(mockJwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'test-refresh-secret',
      });
    });
  });

  describe('decodeToken', () => {
    it('should decode token successfully', () => {
      // Arrange
      const token = 'encoded-token';
      mockJwtService.decode.mockReturnValue(mockPayload);

      // Act
      const result = service.decodeToken(token);

      // Assert
      expect(mockJwtService.decode).toHaveBeenCalledWith(token);
      expect(result).toEqual(mockPayload);
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid token', () => {
      // Arrange
      const token = 'valid-token';
      const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1시간 후
      const payloadWithFutureExp = { ...mockPayload, exp: futureExp };
      mockJwtService.decode.mockReturnValue(payloadWithFutureExp);

      // Act
      const result = service.isTokenExpired(token);

      // Assert
      expect(result).toBe(false);
    });

    it('should return true for expired token', () => {
      // Arrange
      const token = 'expired-token';
      const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1시간 전
      const payloadWithPastExp = { ...mockPayload, exp: pastExp };
      mockJwtService.decode.mockReturnValue(payloadWithPastExp);

      // Act
      const result = service.isTokenExpired(token);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when token has no expiration', () => {
      // Arrange
      const token = 'token-without-exp';
      const payloadWithoutExp = { ...mockPayload };
      delete payloadWithoutExp.exp;
      mockJwtService.decode.mockReturnValue(payloadWithoutExp);

      // Act
      const result = service.isTokenExpired(token);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when token decode fails', () => {
      // Arrange
      const token = 'invalid-token';
      mockJwtService.decode.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      const result = service.isTokenExpired(token);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('getTokenExpirationTime', () => {
    it('should return correct expiration time for valid token', () => {
      // Arrange
      const token = 'valid-token';
      const currentTime = Math.floor(Date.now() / 1000);
      const futureExp = currentTime + 3600; // 1시간 후
      const payloadWithFutureExp = { ...mockPayload, exp: futureExp };
      mockJwtService.decode.mockReturnValue(payloadWithFutureExp);

      // Mock Date.now to return consistent time
      jest.spyOn(Date, 'now').mockReturnValue(currentTime * 1000);

      // Act
      const result = service.getTokenExpirationTime(token);

      // Assert
      expect(result).toBe(3600); // 3600초 = 1시간

      // Cleanup
      jest.restoreAllMocks();
    });

    it('should return 0 for expired token', () => {
      // Arrange
      const token = 'expired-token';
      const currentTime = Math.floor(Date.now() / 1000);
      const pastExp = currentTime - 3600; // 1시간 전
      const payloadWithPastExp = { ...mockPayload, exp: pastExp };
      mockJwtService.decode.mockReturnValue(payloadWithPastExp);

      // Mock Date.now to return consistent time
      jest.spyOn(Date, 'now').mockReturnValue(currentTime * 1000);

      // Act
      const result = service.getTokenExpirationTime(token);

      // Assert
      expect(result).toBe(0);

      // Cleanup
      jest.restoreAllMocks();
    });

    it('should return 0 when token has no expiration', () => {
      // Arrange
      const token = 'token-without-exp';
      const payloadWithoutExp = { ...mockPayload };
      delete payloadWithoutExp.exp;
      mockJwtService.decode.mockReturnValue(payloadWithoutExp);

      // Act
      const result = service.getTokenExpirationTime(token);

      // Assert
      expect(result).toBe(0);
    });

    it('should return 0 when token decode fails', () => {
      // Arrange
      const token = 'invalid-token';
      mockJwtService.decode.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      const result = service.getTokenExpirationTime(token);

      // Assert
      expect(result).toBe(0);
    });
  });
});
