import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // 전역 Validation Pipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성 제거
      forbidNonWhitelisted: true, // 정의되지 않은 속성이 있으면 요청 거부
      transform: true, // 요청 데이터를 DTO 인스턴스로 자동 변환
    }),
  );

  // 쿠키 파서 미들웨어 설정
  app.use(cookieParser());

  // SDK 호출을 위해 개발 환경에서 모든 출처에 대해 CORS 허용
  // 실제 운영 환경에서는 SDK 도메인에 대한 동적 CORS 설정 필요
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const server = app.getHttpServer();

  // keepAlive 설정
  server.keepAliveTimeout = 65000; // 65초
  server.headersTimeout = 66000; // 66초

  // Swagger 설정
  const swaggerConfig = new DocumentBuilder()
    .setTitle('UTMate API')
    .setDescription('UTMate API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.get<number>('SERVER_PORT')!);
}
bootstrap();
