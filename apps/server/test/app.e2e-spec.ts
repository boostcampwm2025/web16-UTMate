import * as fs from 'fs';
import { randomUUID } from 'node:crypto';
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
    // 테스트로 생성된 파일 정리 (선택 사항)
    // if (fs.existsSync(testUploadDir)) {
    //   fs.rmSync(testUploadDir, { recursive: true, force: true });
    // }
    await app.close();
  });

  describe('/sdk/sessions/:sessionId/missions/:missionId/replay_logs (POST)', () => {
    it('압축된 로그 파일을 업로드하면 성공해야 한다', async () => {
      const sessionId = randomUUID();
      const missionId = randomUUID();
      const logData = JSON.stringify({ event: 'test', timestamp: Date.now() });
      const compressedData = zlib.gzipSync(logData);

      await request(app.getHttpServer())
        .post(`/sdk/sessions/${sessionId}/missions/${missionId}/replay_logs`)
        .set('Content-Type', 'application/gzip')
        .send(compressedData)
        .expect(201);

      // 파일이 실제로 생성되었는지 확인 (파일명에 타임스탬프가 있어서 디렉토리까지만 확인하거나, 가장 최근 파일 확인)
      const expectedDir = path.join(testUploadDir, 'replay_log', sessionId, missionId);
      expect(fs.existsSync(expectedDir)).toBe(true);

      const files = fs.readdirSync(expectedDir);
      expect(files.length).toBeGreaterThan(0);

      // 저장된 파일 내용 검증
      const savedFilePath = path.join(expectedDir, files[0]);
      const savedContent = fs.readFileSync(savedFilePath);
      const decompressedContent = zlib.gunzipSync(savedContent).toString();

      expect(decompressedContent).toBe(logData);

      // 테스트 파일 정리
      fs.rmSync(savedFilePath);
      if (fs.readdirSync(expectedDir).length === 0) {
        fs.rmdirSync(expectedDir);
      }
    });

    it('uuid 형식이 아닌 세션 ID로 요청시 400 에러를 반환해야 한다', async () => {
      const sessionId = 'invalid-session-id';
      const missionId = randomUUID();
      const logData = JSON.stringify({ event: 'test', timestamp: Date.now() });
      const compressedData = zlib.gzipSync(logData);

      await request(app.getHttpServer())
        .post(`/sdk/sessions/${sessionId}/missions/${missionId}/replay_logs`)
        .set('Content-Type', 'application/gzip')
        .send(compressedData)
        .expect(400);
    });

    it('uuid 형식이 아닌 미션 ID로 요청시 400 에러를 반활해야 한다', async () => {
      const sessionId = randomUUID();
      const missionId = 'invalid-mission-id';
      const logData = JSON.stringify({ event: 'test', timestamp: Date.now() });
      const compressedData = zlib.gzipSync(logData);

      await request(app.getHttpServer())
        .post(`/sdk/sessions/${sessionId}/missions/${missionId}/replay_logs`)
        .set('Content-Type', 'application/gzip')
        .send(compressedData)
        .expect(400);
    });
  });
});
