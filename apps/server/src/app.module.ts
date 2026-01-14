import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

import { ENV_KEYS } from '#common/config/env.constants';
import { RedisModule } from '#common/redis/redis.module';
import { StorageModule } from '#common/storage/storage.module';
import { AuthModule } from '#domain/auth/auth.module';
import { MissionResultModule } from '#domain/mission-result/mission-results.module';
import { SdkModule } from '#domain/sdk/sdk.module';
import { TestsModule } from '#domain/tests/tests.module';
import { UsersModule } from '#domain/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // Server
        NODE_ENV: Joi.string().valid('development', 'production').required(),
        SERVER_PORT: Joi.number().default(8080).required(),
        SDK_DOMAIN: Joi.string().uri().required(),

        // Database
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().default(3306),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),

        // Redis
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),

        // Client
        CLIENT_URL: Joi.string().uri().required(),

        // GitHub OAuth
        GITHUB_CLIENT_ID: Joi.string().required(),
        GITHUB_CLIENT_SECRET: Joi.string().required(),
        GITHUB_CALLBACK_URL: Joi.string().uri().required(),

        // JWT
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRES_IN: Joi.number().default(900),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRES_IN: Joi.number().default(604800),

        // S3
        S3_ACCESS_KEY_ID: Joi.string().required(),
        S3_SECRET_ACCESS_KEY: Joi.string().required(),
        S3_REGION: Joi.string().required(),
        S3_BUCKET_NAME: Joi.string().required(),
        S3_ENDPOINT: Joi.string().uri().optional(),
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
        host: config.get<string>(ENV_KEYS.DATABASE_HOST)!,
        port: config.get<number>(ENV_KEYS.DATABASE_PORT)!,
        username: config.get<string>(ENV_KEYS.DATABASE_USER)!,
        password: config.get<string>(ENV_KEYS.DATABASE_PASSWORD)!,
        database: config.get<string>(ENV_KEYS.DATABASE_NAME)!,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsRun: config.get<string>(ENV_KEYS.NODE_ENV)! === 'production',
        synchronize: config.get<string>(ENV_KEYS.NODE_ENV)! !== 'production',
        logging: config.get<string>(ENV_KEYS.NODE_ENV)! !== 'production',
      }),
    }),

    // common modules
    StorageModule,
    RedisModule,

    // domain modules
    AuthModule,
    UsersModule,
    TestsModule,
    MissionResultModule,
    SdkModule,
  ],
})
export class AppModule {}
