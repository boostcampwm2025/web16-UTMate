import { IncrementalSource } from '@rrweb/types';

// 10초(10000ms) 이상 무동작 구간만 idle time으로 누적
export const IDLE_THRESHOLD = 10000;

// 사용자 활동으로 감지할 이벤트 소스들
export const ACTIVE_SOURCES = [
  IncrementalSource.MouseInteraction,
  IncrementalSource.Input,
  IncrementalSource.MouseMove,
  IncrementalSource.Scroll,
];

// rage click 분석을 위한 상수들
export const RAGE_CLICK_TIMEFRAME = 1000;
export const RAGE_CLICK_MIN_CLICKS = 3;
export const RAGE_CLICK_MAX_DISTANCE = 100;
