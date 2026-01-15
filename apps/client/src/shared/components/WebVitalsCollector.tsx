'use client';

import { usePathname } from 'next/navigation';
import { useReportWebVitals } from 'next/web-vitals';
import { sendGAEvent } from '@/shared/lib/ga';

export function WebVitalsCollector() {
  const pathname = usePathname();

  useReportWebVitals((metric) => {
    sendGAEvent('web_vitals', {
      metric_name: metric.name, // LCP, CLS, INP 등 지표 이름
      metric_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value), // CLS는 정수화 필요
      metric_id: metric.id, // 지표의 고유 ID (중복 데이터 방지)
      page_path: pathname, // 실제 경로: /tests/V1StGXR8_Z5jdHi6B-myT
      page_pattern: getRoutePattern(pathname), // 패턴: /tests/[id]
    });
  });

  return null;
}

// pathname을 route pattern으로 변환 (nanoid 21자 패턴)
function getRoutePattern(pathname: string): string {
  return pathname.replace(/\/[A-Za-z0-9_-]{21}(?=\/|$)/g, '/[id]');
}
