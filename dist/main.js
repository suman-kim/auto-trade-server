"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const jwt_auth_guard_1 = require("./infrastructure/auth/jwt-auth.guard");
const security_guard_1 = require("./shared/guards/security.guard");
const core_2 = require("@nestjs/core");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalGuards(new security_guard_1.SecurityGuard());
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(app.get(core_2.Reflector)));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: true,
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('자동매매 시스템 API')
        .setDescription('주식 자동매매 시스템의 REST API 문서')
        .setVersion('1.0')
        .addTag('auth', '인증 관련 API')
        .addTag('users', '사용자 관리 API')
        .addTag('stocks', '주식 데이터 API')
        .addTag('portfolios', '포트폴리오 관리 API')
        .addTag('transactions', '거래 내역 API')
        .addTag('trading-strategies', '자동매매 전략 API')
        .addTag('trades', '거래 실행 API')
        .addTag('notifications', '알림 관리 API')
        .addTag('monitoring', '시스템 모니터링 API')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT 토큰을 입력하세요',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
        customSiteTitle: '자동매매 시스템 API 문서',
    });
    await app.listen(process.env.PORT ?? 9988);
}
void bootstrap();
//# sourceMappingURL=main.js.map