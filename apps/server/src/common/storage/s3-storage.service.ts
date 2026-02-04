import { promisify } from 'node:util';
import zlib from 'node:zlib';

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3_CLIENT } from './const';

import { ENV_KEYS } from '#common/config/env.constants';

@Injectable()
export class S3StorageService {
  private readonly bucketName: string;
  private readonly gzip = promisify(zlib.gzip);

  constructor(
    @Inject(S3_CLIENT) private readonly s3Client: S3Client,
    @Inject() private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>(ENV_KEYS.S3_BUCKET_NAME)!;
  }

  /**
   * 파일 버퍼를 압축 후 S3에 업로드합니다.
   *
   * @param fileName 저장할 파일 이름
   * @param content 파일 내용 버퍼
   * @returns 업로드된 파일 이름
   */
  async uploadToS3(fileName: string, content: Buffer) {
    const compressed = await this.gzip(content);
    const compressedFileName = fileName + '.gz';

    // S3에 업로드
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: compressedFileName,
      Body: compressed,
      ContentType: 'application/x-jsonlines',
      ContentEncoding: 'gzip',
    });

    await this.s3Client.send(command);

    return compressedFileName;
  }

  /**
   * S3에 저장된 파일의 presigned URL을 생성합니다.
   *
   * @param fileName 파일 이름
   * @param expiresIn URL 만료 시간(초) 기본값: 3600초 (1시간)
   * @returns presigned URL
   */
  async getPresignedUrl(fileName: string, expiresIn: number = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * S3에 저장된 파일을 삭제합니다.
   *
   * @param fileName 파일 이름
   */
  async deleteFromS3(fileName: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    await this.s3Client.send(command);
  }
}
