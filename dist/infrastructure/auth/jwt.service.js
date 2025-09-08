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
var JwtAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let JwtAuthService = JwtAuthService_1 = class JwtAuthService {
    jwtService;
    logger = new common_1.Logger(JwtAuthService_1.name);
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    generateAccessToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
        };
        this.logger.log(`Generating access token for user ${user.id}`);
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
            expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        });
    }
    generateRefreshToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
        };
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
            expiresIn: '7d',
        });
    }
    verifyToken(token) {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
            });
        }
        catch (error) {
            throw new Error('유효하지 않은 토큰입니다.');
        }
    }
    verifyRefreshToken(token) {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
            });
        }
        catch (error) {
            throw new Error('유효하지 않은 리프레시 토큰입니다.');
        }
    }
    decodeToken(token) {
        return this.jwtService.decode(token);
    }
    isTokenExpired(token) {
        try {
            const payload = this.decodeToken(token);
            if (!payload.exp) {
                return true;
            }
            return Date.now() >= payload.exp * 1000;
        }
        catch {
            return true;
        }
    }
    getTokenExpirationTime(token) {
        try {
            const payload = this.decodeToken(token);
            if (!payload.exp) {
                return 0;
            }
            return Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
        }
        catch {
            return 0;
        }
    }
};
exports.JwtAuthService = JwtAuthService;
exports.JwtAuthService = JwtAuthService = JwtAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], JwtAuthService);
//# sourceMappingURL=jwt.service.js.map