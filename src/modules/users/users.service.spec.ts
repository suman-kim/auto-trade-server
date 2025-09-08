import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../domain/entities/user.entity';
import { RegisterDto, LoginDto, UpdateUserDto } from '../../application/dtos/auth.dto';
import * as bcrypt from 'bcrypt';

// bcrypt 모킹
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: '홍',
      lastName: '길동',
    };

    it('should register a new user successfully', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({
        ...mockUser,
        passwordHash: 'hashedPassword',
      });
      mockUserRepository.save.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: registerDto.email,
        passwordHash: 'hashedPassword',
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        isActive: true,
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        new ConflictException('이미 등록된 이메일입니다.'),
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully with valid credentials', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.passwordHash,
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.'),
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      // Arrange
      const inactiveUser = { ...mockUser, isActive: false };
      mockUserRepository.findOne.mockResolvedValue(inactiveUser);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('비활성화된 계정입니다.'),
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.'),
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.passwordHash,
      );
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      // Arrange
      const userId = 1;
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.findById(userId);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arrange
      const userId = 999;
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findById(userId)).rejects.toThrow(
        new NotFoundException('사용자를 찾을 수 없습니다.'),
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('findByEmail', () => {
    it('should return user if found', async () => {
      // Arrange
      const email = 'test@example.com';
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.findByEmail(email);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      // Arrange
      const email = 'notfound@example.com';
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findByEmail(email);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      firstName: '김',
      lastName: '철수',
      password: 'newPassword123',
    };

    it('should update user successfully', async () => {
      // Arrange
      const userId = 1;
      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');

      // Act
      const result = await service.updateUser(userId, updateUserDto);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(updateUserDto.password, 12);
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it('should update user without password', async () => {
      // Arrange
      const userId = 1;
      const updateDto = { firstName: '김', lastName: '철수' };
      const updatedUser = { ...mockUser, ...updateDto };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      // Act
      const result = await service.updateUser(userId, updateDto);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate user successfully', async () => {
      // Arrange
      const userId = 1;
      const deactivatedUser = { ...mockUser, isActive: false };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(deactivatedUser);

      // Act
      const result = await service.deactivateUser(userId);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result.isActive).toBe(false);
    });
  });

  describe('activateUser', () => {
    it('should activate user successfully', async () => {
      // Arrange
      const userId = 1;
      const inactiveUser = { ...mockUser, isActive: false };
      const activatedUser = { ...mockUser, isActive: true };
      mockUserRepository.findOne.mockResolvedValue(inactiveUser);
      mockUserRepository.save.mockResolvedValue(activatedUser);

      // Act
      const result = await service.activateUser(userId);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result.isActive).toBe(true);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      // Arrange
      const userId = 1;
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);

      // Act
      await service.deleteUser(userId);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      // Arrange
      const password = 'password123';
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await service.validatePassword(mockUser, password);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.passwordHash);
      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      // Arrange
      const password = 'wrongpassword';
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await service.validatePassword(mockUser, password);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.passwordHash);
      expect(result).toBe(false);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      // Arrange
      const userId = 1;
      const currentPassword = 'oldPassword';
      const newPassword = 'newPassword123';
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        passwordHash: 'newHashedPassword',
      });

      // Act
      await service.changePassword(userId, currentPassword, newPassword);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(currentPassword, mockUser.passwordHash);
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 12);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if current password is invalid', async () => {
      // Arrange
      const userId = 1;
      const currentPassword = 'wrongPassword';
      const newPassword = 'newPassword123';
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.changePassword(userId, currentPassword, newPassword),
      ).rejects.toThrow(
        new UnauthorizedException('현재 비밀번호가 올바르지 않습니다.'),
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(currentPassword, mockUser.passwordHash);
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });
});
