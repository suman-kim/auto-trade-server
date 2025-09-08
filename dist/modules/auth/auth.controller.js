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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
const auth_dto_1 = require("../../dtos/auth.dto");
const public_decorator_1 = require("../../shared/decorators/public.decorator");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../../entities/user.entity");
let AuthController = class AuthController {
    authService;
    usersService;
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async register(registerDto) {
        return await this.authService.register(registerDto);
    }
    async login(loginDto) {
        return await this.authService.login(loginDto);
    }
    async refreshToken(refreshTokenDto) {
        return await this.authService.refreshToken(refreshTokenDto);
    }
    async getCurrentUser(user) {
        return new auth_dto_1.UserResponseDto(user);
    }
    async logout() {
        return { message: '로그아웃되었습니다.' };
    }
    async validateToken() {
        return { valid: true, message: '유효한 토큰입니다.' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: '사용자 등록',
        description: '새로운 사용자 계정을 생성합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '사용자 등록 성공',
        type: auth_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: '잘못된 요청 데이터',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: '이미 존재하는 이메일',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: '사용자 로그인',
        description: '이메일과 비밀번호로 로그인합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '로그인 성공',
        type: auth_dto_1.LoginResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: '잘못된 요청 데이터',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '잘못된 이메일 또는 비밀번호',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: '토큰 갱신',
        description: '리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '토큰 갱신 성공',
        type: auth_dto_1.LoginResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: '잘못된 요청 데이터',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '유효하지 않은 리프레시 토큰',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: '현재 사용자 정보 조회',
        description: 'JWT 토큰을 사용하여 현재 로그인한 사용자의 정보를 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '사용자 정보 조회 성공',
        type: auth_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '유효하지 않은 토큰',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: '로그아웃',
        description: '사용자 로그아웃을 처리합니다. (클라이언트에서 토큰을 삭제하면 됨)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '로그아웃 성공',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: '로그아웃되었습니다.',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '유효하지 않은 토큰',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('validate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: '토큰 검증',
        description: 'JWT 토큰의 유효성을 검증합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '토큰 검증 성공',
        schema: {
            type: 'object',
            properties: {
                valid: {
                    type: 'boolean',
                    example: true,
                },
                message: {
                    type: 'string',
                    example: '유효한 토큰입니다.',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '유효하지 않은 토큰',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateToken", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map