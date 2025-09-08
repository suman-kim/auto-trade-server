import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtAuthService } from '../../infrastructure/auth/jwt.service';
import { RegisterDto, LoginDto, LoginResponseDto, RefreshTokenDto } from '../../dtos/auth.dto';
import { User } from '../../entities/user.entity';

/**
 * 인증 서비스
 * 사용자 인증 및 JWT 토큰 관리 기능을 제공합니다.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  /**
   * 사용자 등록을 처리합니다.
   */
  async register(registerDto: RegisterDto): Promise<LoginResponseDto> {
    // 사용자 등록
    const user = await this.usersService.register(registerDto);

    // JWT 토큰 생성
    const accessToken = this.jwtAuthService.generateAccessToken(user);
    const refreshToken = this.jwtAuthService.generateRefreshToken(user);

    return new LoginResponseDto(user, accessToken, refreshToken);
  }

  /**
   * 사용자 로그인을 처리합니다.
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // 사용자 인증
    const user = await this.usersService.login(loginDto);

    // JWT 토큰 생성
    const accessToken = this.jwtAuthService.generateAccessToken(user);
    const refreshToken = this.jwtAuthService.generateRefreshToken(user);

    return new LoginResponseDto(user, accessToken, refreshToken);
  }

  /**
   * 리프레시 토큰을 사용하여 새로운 액세스 토큰을 생성합니다.
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string }> {
    const { refreshToken } = refreshTokenDto;

    try {
      // 리프레시 토큰 검증
      const payload = this.jwtAuthService.verifyRefreshToken(refreshToken);

      // 사용자 정보 조회
      const user = await this.usersService.findById(payload.sub);

      // 새로운 액세스 토큰 생성
      const accessToken = this.jwtAuthService.generateAccessToken(user);

      return { accessToken };
    } catch (error) {
      throw new Error('유효하지 않은 리프레시 토큰입니다.');
    }
  }

  /**
   * 현재 사용자 정보를 반환합니다.
   */
  async getCurrentUser(userId: number): Promise<User> {
    return await this.usersService.findById(userId);
  }

  /**
   * 토큰을 검증합니다.
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      this.jwtAuthService.verifyToken(token);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 토큰에서 사용자 정보를 추출합니다.
   */
  async getUserFromToken(token: string): Promise<User | null> {
    try {
      const payload = this.jwtAuthService.verifyToken(token);
      return await this.usersService.findById(payload.sub);
    } catch {
      return null;
    }
  }
} 