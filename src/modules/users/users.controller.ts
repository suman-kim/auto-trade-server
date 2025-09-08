import { Controller, Get, Put, Delete, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, UserResponseDto } from '../../dtos/auth.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

/**
 * 사용자 컨트롤러
 * 사용자 정보 관리 API 엔드포인트를 제공합니다.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 현재 사용자 정보 조회
   * GET /users/me
   */
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@CurrentUser() user: User): Promise<UserResponseDto> {
    return new UserResponseDto(user);
  }

  /**
   * 사용자 정보 업데이트
   * PUT /users/me
   */
  @Put('me')
  @HttpCode(HttpStatus.OK)
  async updateCurrentUser(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.updateUser(user.id, updateUserDto);
    return new UserResponseDto(updatedUser);
  }

  /**
   * 사용자 계정 비활성화
   * DELETE /users/me
   */
  @Delete('me')
  @HttpCode(HttpStatus.OK)
  async deactivateCurrentUser(@CurrentUser() user: User) {
    await this.usersService.deactivateUser(user.id);
    return { message: '계정이 비활성화되었습니다.' };
  }

  /**
   * 비밀번호 변경
   * PUT /users/me/password
   */
  @Put('me/password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: User,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    await this.usersService.changePassword(user.id, body.currentPassword, body.newPassword);
    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }
} 