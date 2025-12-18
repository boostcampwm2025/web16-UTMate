import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import zlib from 'zlib';

import { Injectable } from '@nestjs/common';

@Injectable()
export class S3StorageService {
  private readonly uploadDir = path.join(process.cwd(), 's3');
  constructor() {}

  async uploadToS3(fileName: string, content: Readable): Promise<void> {
    // S3 업로드 로직 구현 AWS SDK 사용하여 NCP Object Storage에 업로드
    // mvp 단계에서는 fs 기반 스토리지 사용
    const filePath = path.join(this.uploadDir, fileName);
    const dir = path.dirname(filePath);

    await fs.promises.mkdir(dir, { recursive: true });

    // 압축
    const gzip = zlib.createGzip();
    const compressedStream = content.pipe(gzip);

    const writeStream = fs.createWriteStream(filePath, { flags: 'a' });
    compressedStream.pipe(writeStream);

    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', () => resolve());
      writeStream.on('error', (error) => reject(error));
    });
  }

  async deleteFromS3(fileName: string): Promise<void> {
    const filePath = path.join(this.uploadDir, fileName);
    await fs.promises.unlink(filePath);
  }
}
