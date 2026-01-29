import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { NextFunction, Request, Response } from 'express';
import { Histogram } from 'prom-client';

import { HTTP_REQUEST_DURATION_SECONDS } from './const';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(@InjectMetric(HTTP_REQUEST_DURATION_SECONDS) public histogram: Histogram<string>) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start; // 걸린 시간 (ms)
      const seconds = duration / 1000; // 초 단위로 변환

      const route = req.route ? req.route.path : req.path;

      this.histogram.labels(req.method, route, res.statusCode.toString()).observe(seconds);
    });

    next();
  }
}
