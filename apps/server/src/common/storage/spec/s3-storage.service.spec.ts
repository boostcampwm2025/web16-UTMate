jest.mock('@aws-sdk/s3-request-presigner');

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { S3_CLIENT } from '../const';
import { S3StorageService } from '../s3-storage.service';

describe('S3StorageService', () => {
  let service: S3StorageService;
  let s3Client: { send: jest.Mock };
  let configService: { get: jest.Mock };

  beforeEach(async () => {
    s3Client = { send: jest.fn() };
    configService = { get: jest.fn().mockReturnValue('test-bucket') };
    (getSignedUrl as jest.Mock).mockResolvedValue('mocked-url');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3StorageService,
        { provide: S3_CLIENT, useValue: s3Client },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();
    service = module.get<S3StorageService>(S3StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadToS3', () => {
    it('압축된 파일을 S3에 업로드하고 파일명을 반환한다', async () => {
      s3Client.send.mockResolvedValue({});
      const fileName = 'test.jsonl';
      const content = Buffer.from('test');
      const result = await service.uploadToS3(fileName, content);
      expect(s3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
      expect(result).toBe(fileName + '.gz');
    });
  });

  describe('getPresignedUrl', () => {
    it('getSignedUrl을 호출하고 presigned url을 반환한다', async () => {
      const fileName = 'test.jsonl.gz';
      const url = await service.getPresignedUrl(fileName);
      expect(getSignedUrl).toHaveBeenCalledWith(s3Client, expect.any(GetObjectCommand), {
        expiresIn: 3600,
      });
      expect(url).toBe('mocked-url');
    });
  });

  describe('deleteFromS3', () => {
    it('S3에서 파일을 삭제한다', async () => {
      s3Client.send.mockResolvedValue({});
      const fileName = 'test.jsonl.gz';
      await service.deleteFromS3(fileName);
      expect(s3Client.send).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
    });
  });
});
