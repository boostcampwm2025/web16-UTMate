import * as fs from 'node:fs';
import * as path from 'node:path';
import { Readable } from 'node:stream';

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { StorageService } from '#common/storage/storage.service';

describe('StorageService', () => {
  let service: StorageService;
  const testRoot = path.join(process.cwd(), 'test-temp-root');
  const expectedUploadDir = path.join(testRoot, 'uploads');

  beforeEach(async () => {
    jest.spyOn(process, 'cwd').mockReturnValue(testRoot);

    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  afterEach(() => {
    if (fs.existsSync(testRoot)) {
      fs.rmSync(testRoot, { recursive: true, force: true });
    }
    jest.restoreAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('save', () => {
    it('파일을 지정된 경로에 저장해야 한다', async () => {
      const filename = 'test.txt';
      const content = Readable.from(['hello world']);

      await service.save(filename, content);

      const savedPath = path.join(expectedUploadDir, filename);
      expect(fs.existsSync(savedPath)).toBe(true);
      expect(fs.readFileSync(savedPath, 'utf-8')).toBe('hello world');
    });

    it('디렉토리가 없으면 자동으로 생성해야 한다', async () => {
      const filename = 'nested/folder/file.txt';
      const content = Readable.from(['test']);

      await service.save(filename, content);

      const savedPath = path.join(expectedUploadDir, filename);
      expect(fs.existsSync(savedPath)).toBe(true);
    });
  });

  describe('getReadStreamByFilename', () => {
    it('파일을 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      await expect(service.getReadStreamByFilename('non-existent.txt')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getBufferByFilename', () => {
    it('파일을 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      await expect(service.getBufferByFilename('non-existent.txt')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('파일을 찾으면 버퍼를 반환해야 한다', async () => {
      const filename = 'buffer.txt';
      const testContent = 'buffer test';
      const content = Readable.from([testContent]);
      await service.save(filename, content);

      // 충분한 시간을 주고 파일이 저장되었는지 확인
      await new Promise((resolve) => setTimeout(resolve, 100));

      const buffer = await service.getBufferByFilename(filename);
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.toString()).toBe(testContent);
    });
  });

  describe('deleteByFilename', () => {
    it('파일을 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      await expect(service.deleteByFilename('non-existent.txt')).rejects.toThrow(NotFoundException);
    });

    it('파일을 삭제해야 한다', async () => {
      const filename = 'delete.txt';
      const content = Readable.from(['delete me']);
      await service.save(filename, content);

      const filePath = path.join(expectedUploadDir, filename);
      expect(fs.existsSync(filePath)).toBe(true);

      await service.deleteByFilename(filename);
      expect(fs.existsSync(filePath)).toBe(false);
    });
  });
});
