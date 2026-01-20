import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class StorageService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  constructor() {}

  /**
   * stream 형태로 파일을 지정된 경로에 저장합니다.
   *
   * @param filename 파일 이름
   * @param content 파일 내용 스트림
   */
  async save(filename: string, content: Readable) {
    const filePath = path.join(this.uploadDir, filename);
    const dir = path.dirname(filePath);

    await fs.promises.mkdir(dir, { recursive: true });

    const writeStream = fs.createWriteStream(filePath, { flags: 'a' });
    content.pipe(writeStream);

    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', () => resolve());
      writeStream.on('error', (error) => reject(error));
    });
  }

  /**
   * 지정된 경로의 파일을 스트림 형태로 반환합니다.
   *
   * @param filename 파일 이름
   * @returns 지정된 경로의 파일 스트림
   * @throws NotFoundException 파일을 찾을 수 없는 경우
   */
  async getReadStreamByFilename(filename: string) {
    const filePath = path.join(this.uploadDir, filename);
    try {
      await fs.promises.access(filePath);
      return fs.createReadStream(filePath);
    } catch {
      throw new NotFoundException('파일을 찾을 수 없습니다.');
    }
  }

  /**
   * 지정된 경로의 파일을 버퍼 형태로 반환합니다.
   *
   * @param filename 파일 이름
   * @returns 지정된 경로의 파일 버퍼
   * @throws NotFoundException 파일을 찾을 수 없는 경우
   */
  async getBufferByFilename(filename: string) {
    const filePath = path.join(this.uploadDir, filename);
    try {
      return await fs.promises.readFile(filePath);
    } catch {
      throw new NotFoundException('파일을 찾을 수 없습니다.');
    }
  }
}
