import { http, HttpResponse } from 'msw';
import { CLIENT_BASE_URL } from '@/shared/constants/api';
import type {
  TestResultSummary,
  ParticipantResult,
  MainFeedback,
  MissionResultWithParticipant,
} from '@/features/(test-result)/types';
import { TestStatus } from '@/features/(test-manage)/types';

const mockTestSummaries: TestResultSummary[] = [
  {
    id: 1,
    title: 'Notion 서비스 사용성 테스트',
    status: TestStatus.PUBLISHED,
    description: 'Notion의 새로운 기능을 사용자들이 어떻게 활용하는지 확인하기 위한 테스트입니다.',
    startDate: '2024-01-01',
    endDate: undefined,
    totalParticipants: 3,
  },
];

const mockParticipantResults: Record<number, ParticipantResult[]> = {
  1: [
    {
      participantId: 'tester-1',
      persona: 'GUEST',
      joinedAt: '2026-01-02T10:00:00.000Z',
      missionResults: [
        {
          missionResultId: 'mission-result-1',
          missionId: 1,
          missionOrder: 1,
          status: 'SUCCESS',
          createdAt: '2026-01-02',
          feedback: '매우 만족스러웠습니다.',
          duration: 300,
        },
        {
          missionResultId: 'mission-result-2',
          missionId: 2,
          missionOrder: 2,
          status: 'SUCCESS',
          createdAt: '2026-0-02',
          feedback: '무난했습니다.',
          duration: 120,
        },
        {
          missionResultId: 'mission-result-3',
          missionId: 3,
          missionOrder: 3,
          status: 'SUCCESS',
          createdAt: '2026-03-02',
          feedback: '생각보다 오래 걸렸네요.',
          duration: 600,
        },
      ],
    },
    {
      participantId: 'tester-2',
      persona: 'GUEST',
      joinedAt: '2026-01-02T11:30:00.000Z',
      missionResults: [
        {
          missionResultId: 'mission-result-1',
          missionId: 1,
          missionOrder: 1,
          status: 'SUCCESS',
          createdAt: '2026-03-02',
          feedback: '좋아요',
          duration: 150,
        },
        {
          missionResultId: 'mission-result-2',
          missionId: 2,
          missionOrder: 2,
          status: 'FAILED',
          createdAt: '2026-03-02',
          feedback: '어디로 가야할지 모르겠어요.',
          duration: 450,
        },
        {
          missionResultId: 'mission-result-3',
          missionId: 4,
          missionOrder: 3,
          status: 'SUCCESS',
          createdAt: '2026-03-02',
          feedback: '겨우 완료했습니다.',
          duration: 500,
        },
      ],
    },
    {
      participantId: 'tester-3',
      persona: 'GUEST',
      joinedAt: '2026-01-03T09:00:00.000Z',
      missionResults: [
        {
          missionResultId: 'mission-result-1',
          missionId: 1,
          missionOrder: 1,
          status: 'SUCCESS',
          createdAt: '2026-03-02',
          duration: 200,
        },
        {
          missionResultId: 'mission-result-2',
          missionId: 2,
          missionOrder: 2,
          status: 'SUCCESS',
          createdAt: '2026-03-02',
          duration: 180,
        },
        {
          missionResultId: 'mission-result-3',
          missionId: 3,
          missionOrder: 3,
          status: 'PENDING',
          createdAt: '2026-03-02',
          duration: 50,
        },
        {
          missionResultId: 'mission-result-4',
          missionId: 4,
          missionOrder: 4,
          status: 'PENDING',
          createdAt: '2026-03-02',
          duration: 30,
        },
      ],
    },
    {
      participantId: 'tester-4',
      persona: 'GUEST',
      joinedAt: '2026-01-03T14:00:00.000Z',
      missionResults: [
        {
          missionResultId: 'mission-result-1',
          missionId: 1,
          missionOrder: 1,
          status: 'SUCCESS',
          createdAt: '2026-03-02',
          duration: 100,
        },
        {
          missionResultId: 'mission-result-2',
          missionId: 2,
          missionOrder: 2,
          status: 'SUCCESS',
          createdAt: '2026-03-02',
          duration: 90,
        },
        {
          missionResultId: 'mission-result-3',
          missionId: 3,
          missionOrder: 3,
          status: 'IN_PROGRESS',
          createdAt: '2026-03-02',
          duration: 0,
        },
        {
          missionResultId: 'mission-result-4',
          missionId: 4,
          missionOrder: 4,
          status: 'IN_PROGRESS',
          createdAt: '2026-03-02',
          duration: 0,
        },
      ],
    },
  ],
  2: [],
  3: [
    {
      participantId: 'tester-5',
      persona: 'GUEST',
      joinedAt: '2026-01-05T12:00:00.000Z',
      missionResults: [
        {
          missionResultId: 'mission-result-1',
          missionId: 1,
          missionOrder: 1,
          status: 'SUCCESS',
          createdAt: '2026-03-02',
          feedback: '플래너 작성이 쉬웠습니다.',
          duration: 200,
        },
      ],
    },
  ],
  4: [],
  5: [
    {
      participantId: 'tester-6',
      persona: 'GUEST',
      joinedAt: '2026-01-06T08:00:00.000Z',
      missionResults: [
        {
          missionResultId: 'mission-result-1',
          missionId: 1,
          missionOrder: 1,
          status: 'SUCCESS',
          createdAt: '2026-03-02',
          feedback: '테스트 완료',
          duration: 150,
        },
      ],
    },
  ],
};

/** 현재 시각 기준 상대 시간(1시간 전, 10시간 전, 3일 전, 한 달 전)으로 createdAt을 가진 MainFeedback 목록 */
const createMainFeedbacksWithRelativeTime = (): MainFeedback[] => {
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;

  return [
    {
      participantId: 'tester-1',
      content: '메인 페이지의 디자인이 직관적이어서 사용하기 편리했습니다.',
      createdAt: new Date(now - 1 * HOUR).toISOString(),
    },
    {
      participantId: 'tester-2',
      content: '검색 필터 기능이 좀 더 다양했으면 좋겠습니다.',
      createdAt: new Date(now - 10 * HOUR).toISOString(),
    },
    {
      participantId: 'tester-3',
      content: '전반적인 로딩 속도가 조금 느린 것 같아 개선이 필요해 보입니다.',
      createdAt: new Date(now - 3 * DAY).toISOString(),
    },
    {
      participantId: 'tester-4',
      content: '메인 페이지의 디자인이 직관적이어서 사용하기 편리했습니다.',
      createdAt: new Date(now - 30 * DAY).toISOString(),
    },
  ];
};

const mockMainFeedbacks: Record<number, MainFeedback[]> = {
  2: [],
  3: [
    {
      participantId: 'tester-5',
      content: '미션 난이도가 적당해서 테스트하기 수월했습니다.',
      createdAt: '2026-03-02',
    },
  ],
  4: [],
  5: [
    {
      participantId: 'tester-6',
      content: '전체적으로 만족스러운 테스트 경험이었습니다.',
      createdAt: '2026-03-02',
    },
  ],
};

// 특정 미션의 결과 데이터 (missionId별로 필터링된 결과)
const mockMissionResults: Record<number, MissionResultWithParticipant[]> = {
  1: [
    {
      missionResultId: 'mission-result-1',
      missionId: 1,
      missionOrder: 1,
      status: 'SUCCESS',
      createdAt: '2026-03-02',
      feedback: '매우 만족스러웠습니다.',
      duration: 300,
      participantId: 'tester-1',
      persona: 'GUEST',
    },
    {
      missionResultId: 'mission-result-2',
      missionId: 1,
      missionOrder: 1,
      status: 'SUCCESS',
      createdAt: '2026-03-02',
      feedback: '좋아요',
      duration: 150,
      participantId: 'tester-2',
      persona: 'GUEST',
    },
    {
      missionResultId: 'mission-result-3',
      missionId: 1,
      missionOrder: 1,
      status: 'SUCCESS',
      createdAt: '2026-03-02',
      duration: 200,
      participantId: 'tester-3',
      persona: 'GUEST',
    },
    {
      missionResultId: 'mission-result-4',
      missionId: 1,
      missionOrder: 1,
      status: 'SUCCESS',
      createdAt: '2026-03-02',
      duration: 100,
      participantId: 'tester-4',
      persona: 'GUEST',
    },
  ],
  2: [
    {
      missionResultId: 'mission-result-1',
      missionId: 2,
      missionOrder: 2,
      status: 'SUCCESS',
      createdAt: '2026-03-02',
      feedback: '무난했습니다.',
      duration: 120,
      participantId: 'tester-1',
      persona: 'GUEST',
    },
    {
      missionResultId: 'mission-result-2',
      missionId: 2,
      missionOrder: 2,
      status: 'FAILED',
      createdAt: '2026-03-02',
      feedback: '어디로 가야할지 모르겠어요.',
      duration: 450,
      participantId: 'tester-2',
      persona: 'GUEST',
    },
    {
      missionResultId: 'mission-result-3',
      missionId: 2,
      missionOrder: 2,
      status: 'SUCCESS',
      createdAt: '2026-03-02',
      duration: 180,
      participantId: 'tester-3',
      persona: 'GUEST',
    },
    {
      missionResultId: 'mission-result-4',
      missionId: 2,
      missionOrder: 2,
      status: 'SUCCESS',
      createdAt: '2026-03-02',
      duration: 90,
      participantId: 'tester-4',
      persona: 'GUEST',
    },
  ],
  3: [
    {
      missionResultId: 'mission-result-1',
      missionId: 3,
      missionOrder: 3,
      status: 'SUCCESS',
      createdAt: '2026-03-02',
      feedback: '생각보다 오래 걸렸네요.',
      duration: 600,
      participantId: 'tester-1',
      persona: 'GUEST',
    },
    {
      missionResultId: 'mission-result-2',
      missionId: 3,
      missionOrder: 3,
      status: 'PENDING',
      createdAt: '2026-03-02',
      duration: 50,
      participantId: 'tester-3',
      persona: 'GUEST',
    },
    {
      missionResultId: 'mission-result-3',
      missionId: 3,
      missionOrder: 3,
      status: 'IN_PROGRESS',
      createdAt: '2026-03-02',
      duration: 0,
      participantId: 'tester-4',
      persona: 'GUEST',
    },
  ],
  4: [
    {
      missionResultId: 'mission-result-1',
      missionId: 4,
      missionOrder: 3,
      status: 'SUCCESS',
      createdAt: '2026-03-02',
      feedback: '겨우 완료했습니다.',
      duration: 500,
      participantId: 'tester-2',
      persona: 'GUEST',
    },
    {
      missionResultId: 'mission-result-2',
      missionId: 4,
      missionOrder: 4,
      status: 'PENDING',
      createdAt: '2026-03-02',
      duration: 30,
      participantId: 'tester-3',
      persona: 'GUEST',
    },
    {
      missionResultId: 'mission-result-3',
      missionId: 4,
      missionOrder: 4,
      status: 'IN_PROGRESS',
      createdAt: '2026-03-02',
      duration: 0,
      participantId: 'tester-4',
      persona: 'GUEST',
    },
  ],
};

export const resultHandlers = [
  // GET /tests/:testId/result - 테스트 요약 정보 조회
  http.get(`${CLIENT_BASE_URL}/tests/:testId/result`, ({ params }) => {
    const { testId } = params;

    console.log('[MSW] Intercepted request for testId:', testId);

    const summary = mockTestSummaries.find((s) => s.id === Number(testId));

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
    const feedbacks =
      Number(testId) === 1
        ? createMainFeedbacksWithRelativeTime()
        : mockMainFeedbacks[Number(testId)] || [];

    return HttpResponse.json(feedbacks);
  }),

  // GET /missions/:missionId/result - 특정 미션의 결과 조회
  http.get(`${CLIENT_BASE_URL}/missions/:missionId/result`, ({ params }) => {
    const { missionId } = params;
    const results = mockMissionResults[Number(missionId)] || [];

    console.log('[MSW] Intercepted request for missionId:', missionId);
    console.log('[MSW] Returning results:', results);

    return HttpResponse.json(results);
  }),
];
