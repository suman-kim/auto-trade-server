import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './infrastructure/auth/jwt-auth.guard';
import { SecurityGuard } from './shared/guards/security.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 전역 보안 가드 설정 (JWT 인증 가드보다 먼저 실행)
  app.useGlobalGuards(new SecurityGuard());
  
  // 전역 JWT 인증 가드 설정
  // 모든 API에 기본적으로 인증이 필요하며, @Public() 데코레이터가 있는 API만 예외
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
  
  // 전역 유효성 검사 파이프 설정
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTO에 정의되지 않은 속성 제거
    forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 에러
    transform: true, // 요청 데이터를 DTO 타입으로 변환
  }));

  // CORS 설정
  app.enableCors({
    origin: true, // 개발 환경에서는 모든 origin 허용
    credentials: true,
  });

  // Swagger API 문서 설정
  const config = new DocumentBuilder()
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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT 토큰을 입력하세요',
        in: 'header',
      },
      'JWT-auth', // This name here is important for references
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: '자동매매 시스템 API 문서',
  });

  await app.listen(process.env.PORT ?? 9988);
}

void bootstrap();
