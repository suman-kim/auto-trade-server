import { UsersService } from './users.service';
import { UpdateUserDto, UserResponseDto } from '../../dtos/auth.dto';
import { User } from '../../entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getCurrentUser(user: User): Promise<UserResponseDto>;
    updateCurrentUser(user: User, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    deactivateCurrentUser(user: User): Promise<{
        message: string;
    }>;
    changePassword(user: User, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
