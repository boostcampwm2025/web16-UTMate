import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  // 기본 BodyParser 비활성화 (AppModule에서 커스텀 설정 사용)
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // 쿠키 파서 미들웨어 설정
  app.use(cookieParser());

  // SDK 호출을 위해 개발 환경에서 모든 출처에 대해 CORS 허용
  // 실제 운영 환경에서는 SDK 도메인에 대한 동적 CORS 설정 필요
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
