import { JwtService as NestJwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import { JwtPayload } from './jwt.strategy';
export declare class JwtAuthService {
    private readonly jwtService;
    private readonly logger;
    constructor(jwtService: NestJwtService);
    generateAccessToken(user: User): string;
    generateRefreshToken(user: User): string;
    verifyToken(token: string): JwtPayload;
    verifyRefreshToken(token: string): JwtPayload;
    decodeToken(token: string): JwtPayload;
    isTokenExpired(token: string): boolean;
    getTokenExpirationTime(token: string): number;
}
