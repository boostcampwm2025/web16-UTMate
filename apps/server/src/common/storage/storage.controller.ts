import fs from 'fs';

import { Controller, Get, Logger, Param, Res, StreamableFile } from '@nestjs/common';
import type { Response } from 'express';

@Controller('/storage')
export class StorageController {
  // S3 흉내용 엔드포인트
  @Get('/s3/*key')
  getFile(@Param('key') key: string, @Res({ passthrough: true }) res: Response) {
    res.set({
      'Content-Type': 'application/gzip',
    });
    const filePath = Array.isArray(key) ? key.join('/') : key;
    Logger.log(`${Date.now()} - Serving file from S3 mock: ${filePath}`, 'StorageController');
    const fileStream = fs.createReadStream(filePath);
    return new StreamableFile(fileStream);
  }
}
