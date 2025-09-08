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
exports.RefreshTokenDto = exports.LoginResponseDto = exports.UserResponseDto = exports.UpdateUserDto = exports.LoginDto = exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RegisterDto {
    email;
    password;
    firstName;
    lastName;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 이메일 주소 (로그인 ID로 사용)',
        example: 'user@example.com',
        type: String,
    }),
    (0, class_validator_1.IsEmail)({}, { message: '유효한 이메일 주소를 입력해주세요.' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: '올바른 이메일 형식을 입력해주세요.' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 비밀번호 (최소 10자 이상, 대문자/소문자/숫자/특수문자 포함)',
        example: 'Password123!',
        minLength: 10,
        type: String,
    }),
    (0, class_validator_1.IsString)({ message: '비밀번호는 문자열이어야 합니다.' }),
    (0, class_validator_1.MinLength)(10, { message: '비밀번호는 최소 10자 이상이어야 합니다.' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: '비밀번호는 대문자, 소문자, 숫자, 특수문자(@$!%*?&)를 각각 하나 이상 포함해야 합니다.'
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 이름',
        example: '홍',
        type: String,
    }),
    (0, class_validator_1.IsString)({ message: '이름은 문자열이어야 합니다.' }),
    (0, class_validator_1.IsNotEmpty)({ message: '이름을 입력해주세요.' }),
    (0, class_validator_1.Matches)(/^[가-힣a-zA-Z\s]{1,20}$/, { message: '이름은 1-20자의 한글, 영문, 공백만 허용됩니다.' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 성',
        example: '길동',
        type: String,
    }),
    (0, class_validator_1.IsString)({ message: '성은 문자열이어야 합니다.' }),
    (0, class_validator_1.IsNotEmpty)({ message: '성을 입력해주세요.' }),
    (0, class_validator_1.Matches)(/^[가-힣a-zA-Z\s]{1,20}$/, { message: '성은 1-20자의 한글, 영문, 공백만 허용됩니다.' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "lastName", void 0);
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 이메일 주소',
        example: 'user@example.com',
        type: String,
    }),
    (0, class_validator_1.IsEmail)({}, { message: '유효한 이메일 주소를 입력해주세요.' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: '올바른 이메일 형식을 입력해주세요.' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 비밀번호',
        example: 'password123',
        type: String,
    }),
    (0, class_validator_1.IsString)({ message: '비밀번호는 문자열이어야 합니다.' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class UpdateUserDto {
    firstName;
    lastName;
    password;
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 이름 (선택사항)',
        example: '홍',
        required: false,
        type: String,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '이름은 문자열이어야 합니다.' }),
    (0, class_validator_1.Matches)(/^[가-힣a-zA-Z\s]{1,20}$/, { message: '이름은 1-20자의 한글, 영문, 공백만 허용됩니다.' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 성 (선택사항)',
        example: '길동',
        required: false,
        type: String,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '성은 문자열이어야 합니다.' }),
    (0, class_validator_1.Matches)(/^[가-힣a-zA-Z\s]{1,20}$/, { message: '성은 1-20자의 한글, 영문, 공백만 허용됩니다.' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '새로운 비밀번호 (선택사항, 최소 10자 이상, 대문자/소문자/숫자/특수문자 포함)',
        example: 'NewPassword123!',
        required: false,
        minLength: 10,
        type: String,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '비밀번호는 문자열이어야 합니다.' }),
    (0, class_validator_1.MinLength)(10, { message: '비밀번호는 최소 10자 이상이어야 합니다.' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: '비밀번호는 대문자, 소문자, 숫자, 특수문자(@$!%*?&)를 각각 하나 이상 포함해야 합니다.'
    }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
class UserResponseDto {
    id;
    email;
    firstName;
    lastName;
    isActive;
    createdAt;
    updatedAt;
    constructor(user) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.isActive = user.isActive;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 고유 ID',
        example: 1,
        type: Number,
    }),
    __metadata("design:type", Number)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 이메일 주소',
        example: 'user@example.com',
        type: String,
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 이름',
        example: '홍',
        type: String,
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 성',
        example: '길동',
        type: String,
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '계정 활성화 상태',
        example: true,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '계정 생성 일시',
        example: '2024-01-01T00:00:00.000Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '계정 정보 수정 일시',
        example: '2024-01-01T00:00:00.000Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "updatedAt", void 0);
class LoginResponseDto {
    user;
    accessToken;
    refreshToken;
    constructor(user, accessToken, refreshToken) {
        this.user = new UserResponseDto(user);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
exports.LoginResponseDto = LoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 정보',
        type: UserResponseDto,
    }),
    __metadata("design:type", UserResponseDto)
], LoginResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '액세스 토큰 (JWT)',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        type: String,
    }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '리프레시 토큰',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        type: String,
    }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "refreshToken", void 0);
class RefreshTokenDto {
    refreshToken;
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '리프레시 토큰',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        type: String,
    }),
    (0, class_validator_1.IsString)({ message: '리프레시 토큰은 문자열이어야 합니다.' }),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);
//# sourceMappingURL=auth.dto.js.map