import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto, RefreshTokenDto, UserResponseDto, LoginResponseDto } from '../../dtos/auth.dto';
import { User } from '../../entities/user.entity';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    register(registerDto: RegisterDto): Promise<LoginResponseDto>;
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
    }>;
    getCurrentUser(user: User): Promise<UserResponseDto>;
    logout(): Promise<{
        message: string;
    }>;
    validateToken(): Promise<{
        valid: boolean;
        message: string;
    }>;
}
