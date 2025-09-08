import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Request } from 'express';

/**
 * 보안 가드
 * IP 화이트리스트, 요청 크기 제한 등의 보안 검사를 수행합니다.
 */
@Injectable()
export class SecurityGuard implements CanActivate {
  // 허용된 IP 주소 목록 (환경변수에서 설정 가능)
  private readonly allowedIPs = process.env.ALLOWED_IPS?.split(',') || ['127.0.0.1', '::1'];
  
  // 최대 요청 크기 (10MB)
  private readonly maxRequestSize = 10 * 1024 * 1024;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    
    // IP 주소 검증
    this.validateIPAddress(request);
    
    // 요청 크기 검증
    this.validateRequestSize(request);
    
    // User-Agent 검증
    this.validateUserAgent(request);
    
    return true;
  }

  /**
   * IP 주소를 검증합니다.
   */
  private validateIPAddress(request: Request): void {
    const clientIP = this.getClientIP(request);
    
    if (!this.allowedIPs.includes(clientIP) && !this.isLocalhost(clientIP)) {
      throw new BadRequestException('Access denied from this IP address');
    }
  }

  /**
   * 요청 크기를 검증합니다.
   */
  private validateRequestSize(request: Request): void {
    const contentLength = parseInt(request.headers['content-length'] || '0');
    
    if (contentLength > this.maxRequestSize) {
      throw new BadRequestException('Request too large');
    }
  }

  /**
   * User-Agent를 검증합니다.
   */
  private validateUserAgent(request: Request): void {
    const userAgent = request.headers['user-agent'];
    
    if (!userAgent) {
      throw new BadRequestException('User-Agent header is required');
    }
    
    // 의심스러운 User-Agent 차단
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
      throw new BadRequestException('Suspicious User-Agent detected');
    }
  }

  /**
   * 클라이언트 IP 주소를 가져옵니다.
   */
  private getClientIP(request: Request): string {
    return (
      request.headers['x-forwarded-for'] as string ||
      request.headers['x-real-ip'] as string ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      '127.0.0.1'
    );
  }

  /**
   * 로컬호스트 IP인지 확인합니다.
   */
  private isLocalhost(ip: string): boolean {
    return ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.');
  }
}

