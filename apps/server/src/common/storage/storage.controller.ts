import fs from 'fs';
import path from 'path';

import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import type { Response } from 'express';

@Controller('/storage')
export class StorageController {
  private readonly uploadDir = path.join(process.cwd(), 's3');

  // S3 흉내용 엔드포인트
  @Get('/s3/*key')
  getFile(@Param('key') key: string[], @Res({ passthrough: true }) res: Response) {
    res.set({
      'Content-Type': 'application/gzip',
    });
    const filePath = path.join(this.uploadDir, ...key);
    const fileStream = fs.createReadStream(filePath);
    return new StreamableFile(fileStream);
  }
}
