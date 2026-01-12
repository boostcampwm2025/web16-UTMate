'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { sendGAEvent } from '@/shared/lib/ga';

export function WebVitalsCollector() {
  useReportWebVitals((metric) => {
    sendGAEvent('web_vitals', {
      metric_name: metric.name, // LCP, CLS, INP 등 지표 이름
      metric_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value), // CLS는 정수화 필요
      metric_id: metric.id, // 지표의 고유 ID (중복 데이터 방지)
    });
  });

  return null;
}
