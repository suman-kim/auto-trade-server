export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    password?: string;
}
export declare class UserResponseDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(user: any);
}
export declare class LoginResponseDto {
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
    constructor(user: any, accessToken: string, refreshToken: string);
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
