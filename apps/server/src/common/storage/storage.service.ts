import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  constructor() {}

  /**
   * @description stream 형태의 파일을 지정된 경로에 저장합니다.
   * @param filename
   * @param content
   * @returns
   */
  async save(filename: string, content: Readable): Promise<string> {
    const filePath = path.join(this.uploadDir, filename);
    const dir = path.dirname(filePath);

    await fs.promises.mkdir(dir, { recursive: true });

    const writeStream = fs.createWriteStream(filePath, { flags: 'a' });
    content.pipe(writeStream);

    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', () => resolve());
      writeStream.on('error', (error) => reject(error));
    });

    return filePath;
  }

  /**
   * @description 지정된 경로의 파일을 버퍼 형태로 반환합니다.
   * @param filename
   * @returns 지정된 경로의 파일 버퍼
   */
  async getByFilename(filename: string): Promise<Buffer> {
    const filePath = path.join(this.uploadDir, filename);
    return await fs.promises.readFile(filePath);
  }
}
