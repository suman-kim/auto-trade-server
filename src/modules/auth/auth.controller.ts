import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto, RefreshTokenDto, UserResponseDto, LoginResponseDto } from '../../dtos/auth.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { Public } from '../../shared/decorators/public.decorator';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

/**
 * 인증 컨트롤러
 * 사용자 인증 관련 API 엔드포인트를 제공합니다.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 사용자 등록
   * POST /auth/register
   */
  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '사용자 등록',
    description: '새로운 사용자 계정을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '사용자 등록 성공',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  @ApiResponse({
    status: 409,
    description: '이미 존재하는 이메일',
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  /**
   * 사용자 로그인
   * POST /auth/login
   */
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '사용자 로그인',
    description: '이메일과 비밀번호로 로그인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  @ApiResponse({
    status: 401,
    description: '잘못된 이메일 또는 비밀번호',
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  /**
   * 토큰 갱신
   * POST /auth/refresh
   */
  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '토큰 갱신',
    description: '리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '토큰 갱신 성공',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 리프레시 토큰',
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto);
  }

  /**
   * 현재 사용자 정보 조회
   * GET /auth/me
   */
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '현재 사용자 정보 조회',
    description: 'JWT 토큰을 사용하여 현재 로그인한 사용자의 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 조회 성공',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 토큰',
  })
  async getCurrentUser(@CurrentUser() user: User): Promise<UserResponseDto> {
    return new UserResponseDto(user);
  }

  /**
   * 로그아웃 (클라이언트에서 토큰을 삭제하면 됨)
   * POST /auth/logout
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '로그아웃',
    description: '사용자 로그아웃을 처리합니다. (클라이언트에서 토큰을 삭제하면 됨)',
  })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '로그아웃되었습니다.',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 토큰',
  })
  async logout() {
    return { message: '로그아웃되었습니다.' };
  }

  /**
   * 토큰 검증
   * GET /auth/validate
   */
  @Get('validate')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '토큰 검증',
    description: 'JWT 토큰의 유효성을 검증합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '토큰 검증 성공',
    schema: {
      type: 'object',
      properties: {
        valid: {
          type: 'boolean',
          example: true,
        },
        message: {
          type: 'string',
          example: '유효한 토큰입니다.',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 토큰',
  })
  async validateToken() {
    return { valid: true, message: '유효한 토큰입니다.' };
  }
} 