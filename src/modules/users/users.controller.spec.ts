import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto, UserResponseDto } from '../../application/dtos/auth.dto';
import { User } from '../../domain/entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    updateUser: jest.fn(),
    deactivateUser: jest.fn(),
    changePassword: jest.fn(),
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
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('should return current user information', async () => {
      // Act
      const result = await controller.getCurrentUser(mockUser);

      // Assert
      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.id).toBe(mockUser.id);
      expect(result.email).toBe(mockUser.email);
      expect(result.firstName).toBe(mockUser.firstName);
      expect(result.lastName).toBe(mockUser.lastName);
      expect(result.isActive).toBe(mockUser.isActive);
    });
  });

  describe('updateCurrentUser', () => {
    it('should update current user successfully', async () => {
      // Arrange
      const updateUserDto: UpdateUserDto = {
        firstName: '김',
        lastName: '철수',
      };
      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      // Act
      const result = await controller.updateCurrentUser(mockUser, updateUserDto);

      // Assert
      expect(mockUsersService.updateUser).toHaveBeenCalledWith(mockUser.id, updateUserDto);
      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.firstName).toBe(updateUserDto.firstName);
      expect(result.lastName).toBe(updateUserDto.lastName);
    });

    it('should handle partial updates', async () => {
      // Arrange
      const updateUserDto: UpdateUserDto = {
        firstName: '김',
      };
      const updatedUser = { ...mockUser, firstName: '김' };
      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      // Act
      const result = await controller.updateCurrentUser(mockUser, updateUserDto);

      // Assert
      expect(mockUsersService.updateUser).toHaveBeenCalledWith(mockUser.id, updateUserDto);
      expect(result.firstName).toBe('김');
      expect(result.lastName).toBe(mockUser.lastName); // 기존 값 유지
    });

    it('should handle password update', async () => {
      // Arrange
      const updateUserDto: UpdateUserDto = {
        password: 'newPassword123',
      };
      const updatedUser = { ...mockUser };
      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      // Act
      const result = await controller.updateCurrentUser(mockUser, updateUserDto);

      // Assert
      expect(mockUsersService.updateUser).toHaveBeenCalledWith(mockUser.id, updateUserDto);
      expect(result).toBeInstanceOf(UserResponseDto);
    });
  });

  describe('deactivateCurrentUser', () => {
    it('should deactivate current user successfully', async () => {
      // Arrange
      const deactivatedUser = { ...mockUser, isActive: false };
      mockUsersService.deactivateUser.mockResolvedValue(deactivatedUser);

      // Act
      const result = await controller.deactivateCurrentUser(mockUser);

      // Assert
      expect(mockUsersService.deactivateUser).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual({ message: '계정이 비활성화되었습니다.' });
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Deactivation failed');
      mockUsersService.deactivateUser.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.deactivateCurrentUser(mockUser)).rejects.toThrow(error);
      expect(mockUsersService.deactivateUser).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      // Arrange
      const body = {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      };
      mockUsersService.changePassword.mockResolvedValue(undefined);

      // Act
      const result = await controller.changePassword(mockUser, body);

      // Assert
      expect(mockUsersService.changePassword).toHaveBeenCalledWith(
        mockUser.id,
        body.currentPassword,
        body.newPassword,
      );
      expect(result).toEqual({ message: '비밀번호가 성공적으로 변경되었습니다.' });
    });

    it('should handle invalid current password', async () => {
      // Arrange
      const body = {
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword123',
      };
      const error = new Error('Current password is invalid');
      mockUsersService.changePassword.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.changePassword(mockUser, body)).rejects.toThrow(error);
      expect(mockUsersService.changePassword).toHaveBeenCalledWith(
        mockUser.id,
        body.currentPassword,
        body.newPassword,
      );
    });

    it('should handle service errors', async () => {
      // Arrange
      const body = {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      };
      const error = new Error('Password change failed');
      mockUsersService.changePassword.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.changePassword(mockUser, body)).rejects.toThrow(error);
      expect(mockUsersService.changePassword).toHaveBeenCalledWith(
        mockUser.id,
        body.currentPassword,
        body.newPassword,
      );
    });
  });
});
