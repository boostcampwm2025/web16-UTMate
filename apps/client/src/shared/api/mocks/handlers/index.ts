import { testsHandlers } from './tests';
import { resultHandlers } from './result';

/**
 * MSW API 핸들러
 * 개발 환경에서 API 응답을 모킹합니다.
 */
export const handlers = [
  // Tests 핸들러
  ...testsHandlers,

  // Result 핸들러 (테스트 결과 페이지)
  ...resultHandlers,
];
