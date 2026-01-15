import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';

import { S3StorageService } from './s3-storage.service';

/**
 * @description 스토리지 관련 테스트 컨트롤러 (실제 서비스용 아님)
 */
@Controller('/storage')
export class StorageController {
  constructor(@Inject() private storageService: S3StorageService) {}

  @Get('/file/*testFile')
  async getTestFile(@Param('testFile') testFile: string[]) {
    const filePath = testFile.join('/');
    return await this.storageService.getPresignedUrl(filePath);
  }

  @Post('/file')
  async uploadFile(@Body() body: { content: string; filename: string }) {
    return await this.storageService.uploadToS3(body.filename, Buffer.from(body.content));
  }
}
