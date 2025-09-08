"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let EmailService = EmailService_1 = class EmailService {
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    transporter;
    constructor(configService) {
        this.configService = configService;
        this.initializeTransporter();
    }
    initializeTransporter() {
        const isDevelopment = this.configService.get('NODE_ENV') === 'development';
        if (isDevelopment) {
            this.transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: this.configService.get('EMAIL_USER') || 'test@example.com',
                    pass: this.configService.get('EMAIL_PASS') || 'testpass',
                },
            });
        }
        else {
            this.transporter = nodemailer.createTransport({
                host: this.configService.get('SMTP_HOST'),
                port: parseInt(this.configService.get('SMTP_PORT') || '587'),
                secure: this.configService.get('SMTP_SECURE') === 'true',
                auth: {
                    user: this.configService.get('SMTP_USER'),
                    pass: this.configService.get('SMTP_PASS'),
                },
            });
        }
    }
    async sendNotificationEmail(to, notification, userData) {
        try {
            const emailContent = this.generateEmailContent(notification, userData);
            const mailOptions = {
                from: this.configService.get('EMAIL_FROM') || 'noreply@autotrade.com',
                to,
                subject: emailContent.subject,
                html: emailContent.html,
                text: emailContent.text,
            };
            const result = await this.transporter.sendMail(mailOptions);
            this.logger.log(`이메일 전송 완료: ${result.messageId} - ${to}`);
        }
        catch (error) {
            this.logger.error(`이메일 전송 실패: ${to} - ${error.message}`, error.stack);
            throw error;
        }
    }
    generateEmailContent(notification, userData) {
        const { type, title, message, data } = notification;
        let emailSubject = title;
        let emailBody = message;
        switch (type) {
            case 'TRADE_EXECUTED':
                emailSubject = `[자동매매] 거래 실행 완료 - ${data?.symbol || '알 수 없음'}`;
                emailBody = this.generateTradeEmailContent(data);
                break;
            case 'PRICE_ALERT':
                emailSubject = `[가격 알림] ${data?.symbol || '알 수 없음'} - ${data?.price || '알 수 없음'}원`;
                emailBody = this.generatePriceAlertEmailContent(data);
                break;
            case 'PORTFOLIO_UPDATE':
                emailSubject = `[포트폴리오] 포트폴리오 가치 변화 알림`;
                emailBody = this.generatePortfolioEmailContent(data);
                break;
            case 'STRATEGY_TRIGGERED':
                emailSubject = `[전략 실행] ${data?.strategyName || '알 수 없음'} 전략 실행`;
                emailBody = this.generateStrategyEmailContent(data);
                break;
            case 'SYSTEM_ALERT':
                emailSubject = `[시스템 알림] ${title}`;
                emailBody = this.generateSystemAlertEmailContent(data);
                break;
            default:
                emailSubject = title;
                emailBody = message;
        }
        const htmlContent = this.generateHtmlEmail(emailSubject, emailBody, userData);
        const textContent = this.generateTextEmail(emailSubject, emailBody, userData);
        return {
            subject: emailSubject,
            html: htmlContent,
            text: textContent,
        };
    }
    generateTradeEmailContent(data) {
        const { symbol, quantity, side, price, totalAmount } = data;
        const action = side === 'BUY' ? '매수' : '매도';
        return `
      <h2>거래 실행 완료</h2>
      <p><strong>종목:</strong> ${symbol}</p>
      <p><strong>거래 유형:</strong> ${action}</p>
      <p><strong>수량:</strong> ${quantity}주</p>
      <p><strong>가격:</strong> ${price?.toLocaleString()}원</p>
      <p><strong>총 거래금액:</strong> ${totalAmount?.toLocaleString()}원</p>
      <p><strong>거래 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
    `;
    }
    generatePriceAlertEmailContent(data) {
        const { symbol, price, condition, previousPrice } = data;
        return `
      <h2>가격 알림</h2>
      <p><strong>종목:</strong> ${symbol}</p>
      <p><strong>현재 가격:</strong> ${price?.toLocaleString()}원</p>
      <p><strong>조건:</strong> ${condition}</p>
      ${previousPrice ? `<p><strong>이전 가격:</strong> ${previousPrice.toLocaleString()}원</p>` : ''}
      <p><strong>알림 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
    `;
    }
    generatePortfolioEmailContent(data) {
        const { totalValue, changePercent, changeAmount } = data;
        const changeType = changePercent > 0 ? '상승' : '하락';
        return `
      <h2>포트폴리오 업데이트</h2>
      <p><strong>총 포트폴리오 가치:</strong> ${totalValue?.toLocaleString()}원</p>
      <p><strong>변화율:</strong> ${changePercent}% ${changeType}</p>
      <p><strong>변화금액:</strong> ${changeAmount?.toLocaleString()}원</p>
      <p><strong>업데이트 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
    `;
    }
    generateStrategyEmailContent(data) {
        const { strategyName, action, symbol, reason } = data;
        return `
      <h2>자동 거래 전략 실행</h2>
      <p><strong>전략명:</strong> ${strategyName}</p>
      <p><strong>실행 액션:</strong> ${action}</p>
      <p><strong>대상 종목:</strong> ${symbol}</p>
      ${reason ? `<p><strong>실행 이유:</strong> ${reason}</p>` : ''}
      <p><strong>실행 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
    `;
    }
    generateSystemAlertEmailContent(data) {
        const { message, level, module } = data;
        return `
      <h2>시스템 알림</h2>
      <p><strong>알림 레벨:</strong> ${level}</p>
      <p><strong>모듈:</strong> ${module}</p>
      <p><strong>메시지:</strong> ${message}</p>
      <p><strong>발생 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
    `;
    }
    generateHtmlEmail(subject, content, userData) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px; }
          .footer { margin-top: 20px; padding: 20px; background-color: #f8f9fa; border-radius: 5px; font-size: 12px; color: #6c757d; }
          .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
          .alert { padding: 10px; border-radius: 5px; margin: 10px 0; }
          .alert-info { background-color: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }
          .alert-warning { background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; }
          .alert-danger { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 자동매매 시스템</h1>
            <p>안녕하세요, ${userData?.name || '고객'}님</p>
          </div>
          
          <div class="content">
            ${content}
          </div>
          
          <div class="footer">
            <p>이 이메일은 자동매매 시스템에서 자동으로 발송되었습니다.</p>
            <p>문의사항이 있으시면 고객센터로 연락해 주세요.</p>
            <p>© 2024 자동매매 시스템. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    generateTextEmail(subject, content, userData) {
        return `
자동매매 시스템 알림
====================

안녕하세요, ${userData?.name || '고객'}님

${content}

---
이 이메일은 자동매매 시스템에서 자동으로 발송되었습니다.
문의사항이 있으시면 고객센터로 연락해 주세요.

© 2024 자동매매 시스템. All rights reserved.
    `;
    }
    async testEmailConnection() {
        try {
            await this.transporter.verify();
            this.logger.log('이메일 서버 연결 성공');
            return true;
        }
        catch (error) {
            this.logger.error(`이메일 서버 연결 실패: ${error.message}`, error.stack);
            return false;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map