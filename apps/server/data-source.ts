import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config({ path: '../../.env' });

if (!process.env.DATABASE_HOST) {
  throw new Error('.env 파일에서 DATABASE_HOST 변수가 설정되지 않았습니다.');
}

export default new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: true,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],

  // 마이그레이션 이력을 저장할 테이블 이름 (기본값: migrations)
  migrationsTableName: 'migrations',
});
