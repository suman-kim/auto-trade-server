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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName } = registerDto;
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('이미 등록된 이메일입니다.');
        }
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = this.userRepository.create({
            email,
            passwordHash: hashedPassword,
            firstName,
            lastName,
            isActive: true,
        });
        return await this.userRepository.save(user);
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('비활성화된 계정입니다.');
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
        return user;
    }
    async findAll() {
        return await this.userRepository.find();
    }
    async findById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        return user;
    }
    async findByEmail(email) {
        return await this.userRepository.findOne({
            where: { email },
        });
    }
    async updateUser(id, updateUserDto) {
        const user = await this.findById(id);
        if (updateUserDto.firstName !== undefined) {
            user.firstName = updateUserDto.firstName;
        }
        if (updateUserDto.lastName !== undefined) {
            user.lastName = updateUserDto.lastName;
        }
        if (updateUserDto.password !== undefined) {
            const saltRounds = 12;
            user.passwordHash = await bcrypt.hash(updateUserDto.password, saltRounds);
        }
        return await this.userRepository.save(user);
    }
    async deactivateUser(id) {
        const user = await this.findById(id);
        user.isActive = false;
        return await this.userRepository.save(user);
    }
    async activateUser(id) {
        const user = await this.findById(id);
        user.isActive = true;
        return await this.userRepository.save(user);
    }
    async deleteUser(id) {
        const user = await this.findById(id);
        await this.userRepository.remove(user);
    }
    async validatePassword(user, password) {
        return await bcrypt.compare(password, user.passwordHash);
    }
    async changePassword(id, currentPassword, newPassword) {
        const user = await this.findById(id);
        const isCurrentPasswordValid = await this.validatePassword(user, currentPassword);
        if (!isCurrentPasswordValid) {
            throw new common_1.UnauthorizedException('현재 비밀번호가 올바르지 않습니다.');
        }
        const saltRounds = 12;
        user.passwordHash = await bcrypt.hash(newPassword, saltRounds);
        await this.userRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map