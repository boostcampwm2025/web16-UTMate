import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { json, urlencoded } from 'express';

import { StorageModule } from '#common/storage/storage.module';
import { MissionResultModule } from '#domain/mission-result/mission-result.module';
import { SdkModule } from '#domain/sdk/sdk.module';

@Module({
  imports: [
    // common modules
    StorageModule,

    // domain modules
    MissionResultModule,
    SdkModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  // Content-Encoding의 의해 gzip 압축해제가 안되도록 명시적 설정
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(json(), urlencoded({ extended: true }))
      .exclude({ path: 'sdk/replay_logs', method: RequestMethod.POST })
      .forRoutes('*');
  }
}
