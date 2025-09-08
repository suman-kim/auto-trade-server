"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityMiddleware = void 0;
const common_1 = require("@nestjs/common");
let SecurityMiddleware = class SecurityMiddleware {
    use(req, res, next) {
        this.setSecurityHeaders(res);
        this.sanitizeInput(req);
        this.validateRequestSize(req);
        this.blockDangerousPatterns(req);
        next();
    }
    setSecurityHeaders(res) {
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    }
    sanitizeInput(req) {
        if (req.body) {
            this.sanitizeObject(req.body);
        }
        if (req.query) {
            this.sanitizeObject(req.query);
        }
        if (req.params) {
            this.sanitizeObject(req.params);
        }
    }
    sanitizeObject(obj) {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = this.sanitizeString(obj[key]);
            }
            else if (typeof obj[key] === 'object' && obj[key] !== null) {
                this.sanitizeObject(obj[key]);
            }
        }
    }
    sanitizeString(str) {
        return str
            .replace(/[<>]/g, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '')
            .trim();
    }
    validateRequestSize(req) {
        const maxSize = 10 * 1024 * 1024;
        if (req.headers['content-length']) {
            const contentLength = parseInt(req.headers['content-length']);
            if (contentLength > maxSize) {
                throw new Error('요청 크기가 너무 큽니다. 최대 10MB까지 허용됩니다.');
            }
        }
    }
    blockDangerousPatterns(req) {
        const userAgent = req.headers['user-agent'] || '';
        const url = req.url || '';
        if (userAgent.includes('bot') && !userAgent.includes('googlebot')) {
            throw new Error('접근이 차단되었습니다.');
        }
        const dangerousPatterns = [
            /\.\.\//,
            /<script/i,
            /javascript:/i,
            /on\w+=/i,
        ];
        for (const pattern of dangerousPatterns) {
            if (pattern.test(url)) {
                throw new Error('위험한 요청이 차단되었습니다.');
            }
        }
    }
};
exports.SecurityMiddleware = SecurityMiddleware;
exports.SecurityMiddleware = SecurityMiddleware = __decorate([
    (0, common_1.Injectable)()
], SecurityMiddleware);
//# sourceMappingURL=security.middleware.js.map