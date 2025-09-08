import { UsersService } from '../users/users.service';
import { JwtAuthService } from '../../infrastructure/auth/jwt.service';
import { RegisterDto, LoginDto, LoginResponseDto, RefreshTokenDto } from '../../dtos/auth.dto';
import { User } from '../../entities/user.entity';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtAuthService;
    constructor(usersService: UsersService, jwtAuthService: JwtAuthService);
    register(registerDto: RegisterDto): Promise<LoginResponseDto>;
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
    }>;
    getCurrentUser(userId: number): Promise<User>;
    validateToken(token: string): Promise<boolean>;
    getUserFromToken(token: string): Promise<User | null>;
}
