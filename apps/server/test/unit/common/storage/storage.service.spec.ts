import * as fs from 'fs';
import * as path from 'path';

import { Test, TestingModule } from '@nestjs/testing';

import { StorageService } from '#common/storage/storage.service';

describe('StorageService', () => {
  let service: StorageService;
  // 테스트용 가상 프로젝트 루트 (이 안에 uploads 폴더가 생성됨)
  const testRoot = path.join(process.cwd(), 'test-temp-root');
  const expectedUploadDir = path.join(testRoot, 'uploads');

  beforeEach(async () => {
    // process.cwd()가 테스트 루트를 가리키도록 모킹
    jest.spyOn(process, 'cwd').mockReturnValue(testRoot);

    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  afterEach(() => {
    // 테스트 루트 폴더 전체 정리
    if (fs.existsSync(testRoot)) {
      fs.rmSync(testRoot, { recursive: true, force: true });
    }
    jest.restoreAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  it('파일을 지정된 경로에 저장해야 한다', async () => {
    const filename = 'test-folder/test-file.txt';
    const content = Buffer.from('hello world');

    const savedPath = await service.save(filename, content);

    // 저장된 경로가 expectedUploadDir(uploads 폴더) 내부인지 확인
    expect(savedPath).toBe(path.join(expectedUploadDir, filename));
    expect(fs.existsSync(savedPath)).toBe(true);
    expect(fs.readFileSync(savedPath, 'utf-8')).toBe('hello world');
  });

  it('디렉토리가 없으면 자동으로 생성해야 한다', async () => {
    const filename = 'deep/nested/folder/file.txt';
    const content = Buffer.from('nested content');

    await service.save(filename, content);

    const savedPath = path.join(expectedUploadDir, filename);
    expect(fs.existsSync(savedPath)).toBe(true);
  });
});
