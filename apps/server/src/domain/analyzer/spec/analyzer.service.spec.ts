import fs from 'fs';
import path from 'path';

import { Test, TestingModule } from '@nestjs/testing';

import { AnalyzerService } from '../analyzer.service';

describe('SdkService', () => {
  let service: AnalyzerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyzerService],
    }).compile();

    service = module.get<AnalyzerService>(AnalyzerService);
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('로그 분석', () => {
    it('정상적으로 로그 분석을 완료해야한다.', async () => {
      const logsBuffer = fs.readFileSync(
        path.join(__dirname, '../../../../test/mocks/sample-log.jsonl'),
      );

      const analysisResult = service.analyze(logsBuffer);

      expect(analysisResult).toBeDefined();
      expect(analysisResult.startTime).toBeDefined();
      expect(analysisResult.endTime).toBeDefined();
      expect(analysisResult.timeToFirstInteraction).toBeDefined();
      expect(analysisResult.idleTime).toBeDefined();
      expect(analysisResult.rageClickCount).toBeDefined();
      expect(analysisResult.mouseThrashingCount).toBeDefined();
    });
  });
});
