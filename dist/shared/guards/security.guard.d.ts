import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class SecurityGuard implements CanActivate {
    private readonly allowedIPs;
    private readonly maxRequestSize;
    canActivate(context: ExecutionContext): boolean;
    private validateIPAddress;
    private validateRequestSize;
    private validateUserAgent;
    private getClientIP;
    private isLocalhost;
}
