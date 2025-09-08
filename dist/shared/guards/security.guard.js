"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityGuard = void 0;
const common_1 = require("@nestjs/common");
let SecurityGuard = class SecurityGuard {
    allowedIPs = process.env.ALLOWED_IPS?.split(',') || ['127.0.0.1', '::1'];
    maxRequestSize = 10 * 1024 * 1024;
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        this.validateIPAddress(request);
        this.validateRequestSize(request);
        this.validateUserAgent(request);
        return true;
    }
    validateIPAddress(request) {
        const clientIP = this.getClientIP(request);
        if (!this.allowedIPs.includes(clientIP) && !this.isLocalhost(clientIP)) {
            throw new common_1.BadRequestException('Access denied from this IP address');
        }
    }
    validateRequestSize(request) {
        const contentLength = parseInt(request.headers['content-length'] || '0');
        if (contentLength > this.maxRequestSize) {
            throw new common_1.BadRequestException('Request too large');
        }
    }
    validateUserAgent(request) {
        const userAgent = request.headers['user-agent'];
        if (!userAgent) {
            throw new common_1.BadRequestException('User-Agent header is required');
        }
        const suspiciousPatterns = [
            /bot/i,
            /crawler/i,
            /spider/i,
            /scraper/i,
            /curl/i,
            /wget/i
        ];
        if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
            throw new common_1.BadRequestException('Suspicious User-Agent detected');
        }
    }
    getClientIP(request) {
        return (request.headers['x-forwarded-for'] ||
            request.headers['x-real-ip'] ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            '127.0.0.1');
    }
    isLocalhost(ip) {
        return ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.');
    }
};
exports.SecurityGuard = SecurityGuard;
exports.SecurityGuard = SecurityGuard = __decorate([
    (0, common_1.Injectable)()
], SecurityGuard);
//# sourceMappingURL=security.guard.js.map