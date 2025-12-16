import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // SDK 호출을 위해 개발 환경에서 모든 출처에 대해 CORS 허용
  // 실제 운영 환경에서는 SDK 도메인에 대한 동적 CORS 설정 필요
  app.enableCors('*');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
