import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { RegisterDto, LoginDto, UpdateUserDto } from '../../dtos/auth.dto';
import * as bcrypt from 'bcrypt';

/**
 * 사용자 서비스
 * 사용자 등록, 로그인, 정보 관리 기능을 제공합니다.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 사용자를 등록합니다.
   */
  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, firstName, lastName } = registerDto;

    // 이메일 중복 확인
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }

    // 비밀번호 해시화
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 새 사용자 생성
    const user = this.userRepository.create({
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      isActive: true,
    });

    return await this.userRepository.save(user);
  }

  /**
   * 사용자 로그인을 처리합니다.
   */
  async login(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;

    // 사용자 조회
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('비활성화된 계정입니다.');
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    return user;
  }

  /**
   * 모든 사용자를 조회합니다.
   */
  public async findAll(): Promise<User[]> { 
    return await this.userRepository.find();
  }

  /**
   * 사용자 정보를 조회합니다.
   */
  public async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  /**
   * 이메일로 사용자를 조회합니다.
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  /**
   * 사용자 정보를 업데이트합니다.
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    // 업데이트할 필드들
    if (updateUserDto.firstName !== undefined) {
      user.firstName = updateUserDto.firstName;
    }

    if (updateUserDto.lastName !== undefined) {
      user.lastName = updateUserDto.lastName;
    }

    if (updateUserDto.password !== undefined) {
      // 새 비밀번호 해시화
      const saltRounds = 12;
      user.passwordHash = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    return await this.userRepository.save(user);
  }

  /**
   * 사용자 계정을 비활성화합니다.
   */
  async deactivateUser(id: number): Promise<User> {
    const user = await this.findById(id);
    user.isActive = false;
    return await this.userRepository.save(user);
  }

  /**
   * 사용자 계정을 활성화합니다.
   */
  async activateUser(id: number): Promise<User> {
    const user = await this.findById(id);
    user.isActive = true;
    return await this.userRepository.save(user);
  }

  /**
   * 사용자를 삭제합니다.
   */
  async deleteUser(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }

  /**
   * 비밀번호를 검증합니다.
   */
  async validatePassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.passwordHash);
  }

  /**
   * 비밀번호를 변경합니다.
   */
  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.findById(id);

    // 현재 비밀번호 검증
    const isCurrentPasswordValid = await this.validatePassword(user, currentPassword);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('현재 비밀번호가 올바르지 않습니다.');
    }

    // 새 비밀번호 해시화
    const saltRounds = 12;
    user.passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await this.userRepository.save(user);
  }
} 