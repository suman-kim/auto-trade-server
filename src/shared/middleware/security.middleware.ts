import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * 보안 미들웨어
 * 보안 헤더, 입력 검증 등의 보안 기능을 제공합니다.
 */
@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 보안 헤더 설정
    this.setSecurityHeaders(res);
    
    // 입력 데이터 검증 및 정제
    this.sanitizeInput(req);
    
    // 요청 크기 제한
    this.validateRequestSize(req);
    
    // 위험한 패턴 차단
    this.blockDangerousPatterns(req);
    
    next();
  }

  /**
   * 보안 헤더를 설정합니다.
   */
  private setSecurityHeaders(res: Response): void {
    // XSS 방지
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // 클릭재킹 방지
    res.setHeader('X-Frame-Options', 'DENY');
    
    // MIME 타입 스니핑 방지
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // HSTS (HTTPS 강제)
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // CSP (Content Security Policy)
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
    
    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions Policy
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  }

  /**
   * 입력 데이터를 검증하고 정제합니다.
   */
  private sanitizeInput(req: Request): void {
    // SQL 인젝션 방지를 위한 특수문자 필터링
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

  /**
   * 객체의 모든 문자열 값을 정제합니다.
   */
  private sanitizeObject(obj: any): void {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = this.sanitizeString(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.sanitizeObject(obj[key]);
      }
    }
  }

  /**
   * 문자열을 정제합니다.
   */
  private sanitizeString(str: string): string {
    return str
      .replace(/[<>]/g, '') // HTML 태그 제거
      .replace(/javascript:/gi, '') // JavaScript 프로토콜 제거
      .replace(/on\w+=/gi, '') // 이벤트 핸들러 제거
      .trim();
  }

  /**
   * 요청 크기를 검증합니다.
   */
  private validateRequestSize(req: Request): void {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (req.headers['content-length']) {
      const contentLength = parseInt(req.headers['content-length']);
      if (contentLength > maxSize) {
        throw new Error('요청 크기가 너무 큽니다. 최대 10MB까지 허용됩니다.');
      }
    }
  }

  /**
   * 위험한 패턴을 차단합니다.
   */
  private blockDangerousPatterns(req: Request): void {
    const userAgent = req.headers['user-agent'] || '';
    const url = req.url || '';
    
    // 악성 봇 차단
    if (userAgent.includes('bot') && !userAgent.includes('googlebot')) {
      throw new Error('접근이 차단되었습니다.');
    }
    
    // 위험한 URL 패턴 차단
    const dangerousPatterns = [
      /\.\.\//, // 디렉토리 순회 공격
      /<script/i, // 스크립트 태그
      /javascript:/i, // JavaScript 프로토콜
      /on\w+=/i, // 이벤트 핸들러
    ];
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(url)) {
        throw new Error('위험한 요청이 차단되었습니다.');
      }
    }
  }
}