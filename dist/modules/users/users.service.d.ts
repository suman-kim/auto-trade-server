import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { RegisterDto, LoginDto, UpdateUserDto } from '../../dtos/auth.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    register(registerDto: RegisterDto): Promise<User>;
    login(loginDto: LoginDto): Promise<User>;
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    deactivateUser(id: number): Promise<User>;
    activateUser(id: number): Promise<User>;
    deleteUser(id: number): Promise<void>;
    validatePassword(user: User, password: string): Promise<boolean>;
    changePassword(id: number, currentPassword: string, newPassword: string): Promise<void>;
}
