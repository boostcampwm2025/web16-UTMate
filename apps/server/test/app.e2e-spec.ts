import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const testUploadDir = path.join(process.cwd(), 'uploads'); // 실제 서비스가 사용하는 경로

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/sdk/replay_logs (POST)', () => {
    it('쿠키와 함께 압축된 로그 파일을 업로드하면 성공해야 한다', async () => {
      const sessionId = 'e2e-session';
      const missionId = 'e2e-mission';
      const logData = JSON.stringify({ event: 'test', timestamp: Date.now() });
      const compressedData = zlib.gzipSync(logData);

      await request(app.getHttpServer())
        .post('/sdk/replay_logs')
        .set('Cookie', [`session_id=${sessionId}`, `mission_id=${missionId}`])
        .set('Content-Type', 'application/gzip')
        .send(compressedData)
        .expect(201);

      // 파일이 실제로 생성되었는지 확인
      const expectedDir = path.join(testUploadDir, 'replay_log', sessionId, missionId);
      expect(fs.existsSync(expectedDir)).toBe(true);

      const files = fs.readdirSync(expectedDir);
      expect(files.length).toBeGreaterThan(0);

      // 저장된 파일 내용 검증
      // 이제 파일은 압축 해제된 상태로 저장됨 (log.ndjson)
      const savedFilePath = path.join(expectedDir, 'log.ndjson');
      expect(fs.existsSync(savedFilePath)).toBe(true);

      const savedContent = fs.readFileSync(savedFilePath, 'utf-8');
      // NDJSON 형식이므로 그대로 비교 가능 (줄바꿈 등 고려 필요할 수 있음)
      expect(savedContent).toContain(logData);

      // 테스트 파일 정리
      fs.rmSync(savedFilePath);
      if (fs.readdirSync(expectedDir).length === 0) {
        fs.rmdirSync(expectedDir);
      }
    });

    it('쿠키가 없으면 401 에러를 반환해야 한다', async () => {
      await request(app.getHttpServer()).post('/sdk/replay_logs').send('some data').expect(401);
    });
  });
});
