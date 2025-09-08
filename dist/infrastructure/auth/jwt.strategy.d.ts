import { Strategy } from 'passport-jwt';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
export interface JwtPayload {
    sub: number;
    email: string;
    iat?: number;
    exp?: number;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
