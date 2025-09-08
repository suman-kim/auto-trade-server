"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_service_1 = require("../../infrastructure/auth/jwt.service");
const auth_dto_1 = require("../../dtos/auth.dto");
let AuthService = class AuthService {
    usersService;
    jwtAuthService;
    constructor(usersService, jwtAuthService) {
        this.usersService = usersService;
        this.jwtAuthService = jwtAuthService;
    }
    async register(registerDto) {
        const user = await this.usersService.register(registerDto);
        const accessToken = this.jwtAuthService.generateAccessToken(user);
        const refreshToken = this.jwtAuthService.generateRefreshToken(user);
        return new auth_dto_1.LoginResponseDto(user, accessToken, refreshToken);
    }
    async login(loginDto) {
        const user = await this.usersService.login(loginDto);
        const accessToken = this.jwtAuthService.generateAccessToken(user);
        const refreshToken = this.jwtAuthService.generateRefreshToken(user);
        return new auth_dto_1.LoginResponseDto(user, accessToken, refreshToken);
    }
    async refreshToken(refreshTokenDto) {
        const { refreshToken } = refreshTokenDto;
        try {
            const payload = this.jwtAuthService.verifyRefreshToken(refreshToken);
            const user = await this.usersService.findById(payload.sub);
            const accessToken = this.jwtAuthService.generateAccessToken(user);
            return { accessToken };
        }
        catch (error) {
            throw new Error('유효하지 않은 리프레시 토큰입니다.');
        }
    }
    async getCurrentUser(userId) {
        return await this.usersService.findById(userId);
    }
    async validateToken(token) {
        try {
            this.jwtAuthService.verifyToken(token);
            return true;
        }
        catch {
            return false;
        }
    }
    async getUserFromToken(token) {
        try {
            const payload = this.jwtAuthService.verifyToken(token);
            return await this.usersService.findById(payload.sub);
        }
        catch {
            return null;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_service_1.JwtAuthService])
], AuthService);
//# sourceMappingURL=auth.service.js.map