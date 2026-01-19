import { http, HttpResponse } from 'msw';
import { CLIENT_BASE_URL } from '@/shared/constants/api';
import type { TestSummary } from '@/features/(test-result)/types';
import { TestStatus } from '@/features/(test-manage)/types';

const mockTestSummaries: TestSummary[] = [
  {
    id: 1,
    title: 'Notion 서비스 사용성 테스트',
    status: TestStatus.PUBLISHED,
    description: 'Notion의 새로운 기능을 사용자들이 어떻게 활용하는지 확인하기 위한 테스트입니다.',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    totalParticipants: 15,
  },
  {
    id: 3,
    title: '셀프플레너 테스트 결과',
    status: TestStatus.PUBLISHED,
    description: '플래너 앱의 사용자 피드백을 수집합니다.',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    totalParticipants: 8,
  },
];

export const resultHandlers = [
  // GET /tests/:testId/result - 테스트 요약 정보 조회
  http.get(`${CLIENT_BASE_URL}/tests/:testId/result`, ({ params }) => {
    const { testId } = params;

    console.log('[MSW] Intercepted request for testId:', testId);

    const summary = mockTestSummaries.find(s => s.id === Number(testId));

    if (!summary) {
      console.warn(`[MSW] Summary not found for testId: ${testId}`);
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Summary not found',
      });
    }

    return HttpResponse.json(summary);
  }),
];
