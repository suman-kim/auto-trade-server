import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * JWT 페이로드 인터페이스
 */
export interface JwtPayload {
  sub: number; // 사용자 ID
  email: string;
  iat?: number; // 발급 시간
  exp?: number; // 만료 시간
}

/**
 * JWT 전략
 * JWT 토큰을 검증하고 사용자 정보를 추출합니다.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    });
  }

  /**
   * JWT 토큰을 검증하고 사용자 정보를 반환합니다.
   */
  async validate(payload: JwtPayload): Promise<User> {
    const { sub: userId, email } = payload;

    // 데이터베이스에서 사용자 정보 조회
    const user = await this.userRepository.findOne({
      where: { id: userId, email },
    });

    if (!user) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('비활성화된 사용자입니다.');
    }

    return user;
  }
} 