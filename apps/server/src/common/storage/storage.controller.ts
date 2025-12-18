import fs from 'fs';

import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import type { Response } from 'express';

@Controller('/storage')
export class StorageController {
  // S3 흉내용 엔드포인트
  @Get('/s3/:key(.*)')
  getFile(@Param('key') key: string, @Res({ passthrough: true }) res: Response) {
    res.set({
      'Content-Type': 'application/gzip',
    });
    const fileStream = fs.createReadStream(key);
    return new StreamableFile(fileStream);
  }
}
