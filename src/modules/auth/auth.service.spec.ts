import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthService } from '../../infrastructure/auth/jwt.service';
import { RegisterDto, LoginDto } from '../../application/dtos/auth.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    register: jest.fn(),
    login: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtAuthService = {
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtAuthService,
          useValue: mockJwtAuthService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: '홍',
        lastName: '길동',
      };

      const mockUser = { id: 1, email: 'test@example.com' };
      mockUsersService.register.mockResolvedValue(mockUser);
      mockJwtAuthService.generateAccessToken.mockReturnValue('access-token');
      mockJwtAuthService.generateRefreshToken.mockReturnValue('refresh-token');

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(mockUsersService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = { id: 1, email: 'test@example.com' };
      mockUsersService.login.mockResolvedValue(mockUser);
      mockJwtAuthService.generateAccessToken.mockReturnValue('access-token');
      mockJwtAuthService.generateRefreshToken.mockReturnValue('refresh-token');

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(mockUsersService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });
});