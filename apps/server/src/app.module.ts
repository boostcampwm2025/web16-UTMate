import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-store';
import * as Joi from 'joi';

import { StorageModule } from '#common/storage/storage.module';
import { AuthModule } from '#domain/auth/auth.module';
import { MissionResultModule } from '#domain/mission-result/mission-result.module';
import { SdkModule } from '#domain/sdk/sdk.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
      validationSchema: Joi.object({
        // Server
        NODE_ENV: Joi.string().valid('development', 'production').default('development'),
        SERVER_PORT: Joi.number().default(8080),

        // Database
        DATABASE_HOST: Joi.string().default('localhost'),
        DATABASE_PORT: Joi.number().default(3306),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),

        // Redis
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),

        // Client
        CLIENT_URL: Joi.string().uri().default('http://localhost:3000'),

        // GitHub OAuth
        GITHUB_CLIENT_ID: Joi.string().required(),
        GITHUB_CLIENT_SECRET: Joi.string().required(),
        GITHUB_CALLBACK_URL: Joi.string().uri().required(),
      }),
      validationOptions: {
        abortEarly: false,
        stripUnknown: true,
      },
    }),

    // DB (MySQL)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DATABASE_HOST')!,
        port: config.get<number>('DATABASE_PORT')!,
        username: config.get<string>('DATABASE_USER')!,
        password: config.get<string>('DATABASE_PASSWORD')!,
        database: config.get<string>('DATABASE_NAME')!,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get<string>('NODE_ENV')! !== 'production',
      }),
    }),

    // Cache (Redis)
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: redisStore as unknown,
        host: config.get<string>('REDIS_HOST')!,
        port: config.get<number>('REDIS_PORT')!,
      }),
    }),

    // common modules
    StorageModule,

    // domain modules
    AuthModule,
    MissionResultModule,
    SdkModule,
  ],
})
export class AppModule {}
