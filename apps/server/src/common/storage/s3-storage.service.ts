import { promisify } from 'util';
import zlib from 'zlib';

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

  async uploadToS3(fileName: string, content: Buffer): Promise<string> {
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

  async getPresignedUrl(fileName: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async deleteFromS3(fileName: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    await this.s3Client.send(command);
  }
}
