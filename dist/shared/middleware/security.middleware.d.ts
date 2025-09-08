import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class SecurityMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
    private setSecurityHeaders;
    private sanitizeInput;
    private sanitizeObject;
    private sanitizeString;
    private validateRequestSize;
    private blockDangerousPatterns;
}
