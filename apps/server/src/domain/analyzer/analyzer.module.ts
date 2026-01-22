import { Module } from '@nestjs/common';

import { AnalyzerService } from './analyzer.service';

@Module({
  providers: [AnalyzerService],
  exports: [AnalyzerService],
})
export class AnalyzerModule {}
