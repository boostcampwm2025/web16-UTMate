import { http, HttpResponse } from 'msw';
import { CLIENT_BASE_URL } from '@/shared/constants/api';
import type { TestSummary, ParticipantResult, MainFeedback } from '@/features/(test-result)/types';
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

const mockParticipantResults: Record<number, ParticipantResult[]> = {
  1: [
    {
      participantId: 'tester-1',
      persona: 'GUEST',
      missionResults: [
        { missionId: 1, missionOrder: 1, status: 'SUCCESS' },
        { missionId: 2, missionOrder: 2, status: 'SUCCESS' },
        { missionId: 3, missionOrder: 3, status: 'SUCCESS' },
      ],
    },
    {
      participantId: 'tester-2',
      persona: 'GUEST',
      missionResults: [
        { missionId: 1, missionOrder: 1, status: 'SUCCESS' },
        { missionId: 2, missionOrder: 2, status: 'FAILURE' },
        { missionId: 4, missionOrder: 3, status: 'SUCCESS' },
      ],
    },
    {
      participantId: 'tester-3',
      persona: 'GUEST',
      missionResults: [
        { missionId: 1, missionOrder: 1, status: 'SUCCESS' },
        { missionId: 2, missionOrder: 2, status: 'SUCCESS' },
        { missionId: 3, missionOrder: 3, status: 'DROPPED' },
        { missionId: 4, missionOrder: 4, status: 'DROPPED' },
      ],
    },
    {
      participantId: 'tester-4',
      persona: 'GUEST',
      missionResults: [
        { missionId: 1, missionOrder: 1, status: 'SUCCESS' },
        { missionId: 2, missionOrder: 2, status: 'SUCCESS' },
        { missionId: 3, missionOrder: 3, status: 'IN_PROGRESS' },
        { missionId: 4, missionOrder: 4, status: 'IN_PROGRESS' },
      ],
    },
  ],
};

const mockMainFeedbacks: Record<number, MainFeedback[]> = {
  1: [
    { id: 1, content: '메인 페이지의 디자인이 직관적이어서 사용하기 편리했습니다.' },
    { id: 2, content: '검색 필터 기능이 좀 더 다양했으면 좋겠습니다.' },
    { id: 3, content: '전반적인 로딩 속도가 조금 느린 것 같아 개선이 필요해 보입니다.' },
  ],
};

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

  // GET /tests/:testId/result/participants - 참여자 결과 목록 조회
  http.get(`${CLIENT_BASE_URL}/tests/:testId/result/participants`, ({ params }) => {
    const { testId } = params;
    const results = mockParticipantResults[Number(testId)] || [];

    return HttpResponse.json(results);
  }),

  // GET /tests/:testId/result/mainfeedback - 주요 피드백 목록 조회
  http.get(`${CLIENT_BASE_URL}/tests/:testId/result/mainfeedback`, ({ params }) => {
    const { testId } = params;
    const feedbacks = mockMainFeedbacks[Number(testId)] || [];

    return HttpResponse.json(feedbacks);
  }),
];
