import { Injectable,Logger } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import { JwtPayload } from './jwt.strategy';

/**
 * JWT 서비스
 * JWT 토큰 생성, 검증, 갱신 기능을 제공합니다.
 */
@Injectable()
export class JwtAuthService {
  private readonly logger = new Logger(JwtAuthService.name);
  constructor(private readonly jwtService: NestJwtService) {}

  /**
   * 액세스 토큰을 생성합니다.
   */
  generateAccessToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    this.logger.log(`Generating access token for user ${user.id}`);

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });
  }

  /**
   * 리프레시 토큰을 생성합니다.
   */
  generateRefreshToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
      expiresIn: '7d', // 리프레시 토큰은 7일간 유효
    });
  }

  /**
   * 토큰을 검증합니다.
   */
  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      });
    } catch (error) {
      throw new Error('유효하지 않은 토큰입니다.');
    }
  }

  /**
   * 리프레시 토큰을 검증합니다.
   */
  verifyRefreshToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
      });
    } catch (error) {
      throw new Error('유효하지 않은 리프레시 토큰입니다.');
    }
  }

  /**
   * 토큰에서 페이로드를 추출합니다 (검증 없이).
   */
  decodeToken(token: string): JwtPayload {
    return this.jwtService.decode(token) as JwtPayload;
  }

  /**
   * 토큰이 만료되었는지 확인합니다.
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload.exp) {
        return true;
      }
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

  /**
   * 토큰 만료 시간까지 남은 시간을 계산합니다 (초 단위).
   */
  getTokenExpirationTime(token: string): number {
    try {
      const payload = this.decodeToken(token);
      if (!payload.exp) {
        return 0;
      }
      return Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
    } catch {
      return 0;
    }
  }
} 