import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

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

  /**
   * 지정된 경로의 파일을 삭제합니다.
   *
   * @param fileName 파일 이름
   * @param throwOnMissing 파일이 없을 때 예외를 던질지 여부 (기본값: true)
   * @throws NotFoundException 파일을 찾을 수 없는 경우 ( throwOnMissing 이 true 인 경우 )
   * @throws InternalServerErrorException 파일 삭제에 실패한 경우
   */
  async deleteByFilename(fileName: string, throwOnMissing = true) {
    const filePath = path.join(this.uploadDir, fileName);
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        if (throwOnMissing) {
          throw new NotFoundException('파일을 찾을 수 없습니다.');
        }
        return; // 에러를 던지지 않기로 했으면 조용히 리턴 (성공으로 간주)
      }
      throw new InternalServerErrorException('파일 삭제에 실패했습니다.');
    }
  }
}
