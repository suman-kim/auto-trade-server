import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UsersController } from '../users/users.controller';
import { JwtStrategy } from '../../infrastructure/auth/jwt.strategy';
import { JwtAuthService } from '../../infrastructure/auth/jwt.service';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { User } from '../../entities/user.entity';

/**
 * 인증 모듈
 * JWT 인증 및 사용자 관리 기능을 제공합니다.
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    JwtAuthService,
    JwtAuthGuard,
  ],
  exports: [
    AuthService,
    UsersService,
    JwtAuthService,
    JwtAuthGuard,
  ],
})
export class AuthModule {} 