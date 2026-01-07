import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

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

  await app.listen(config.get<number>('SERVER_PORT')!);
}
bootstrap();
