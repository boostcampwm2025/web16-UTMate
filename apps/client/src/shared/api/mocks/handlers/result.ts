import { http, HttpResponse } from 'msw';
import { CLIENT_BASE_URL } from '@/shared/constants/api';
import type {
  TestResultSummary,
  ParticipantResult,
  MainFeedback,
  MissionResultWithParticipant,
  TestMissionsResults,
  MissionDetail,
  MissionResults,
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
          missionTitle: '메인 페이지 탐색',
          missionDescription: '웹사이트의 메인 페이지를 둘러보고 주요 기능을 확인해주세요.',
          status: 'SUCCESS',
          createdAt: '2026-01-02',
          feedback: '매우 만족스러웠습니다.',
          duration: 300,
        },
        {
          missionResultId: 'mission-result-2',
          missionId: 2,
          missionOrder: 2,
          missionTitle: '검색 기능 테스트',
          missionDescription: '검색 기능을 사용하여 원하는 정보를 찾아보세요.',
          status: 'SUCCESS',
          createdAt: '2026-0-02',
          feedback: '무난했습니다.',
          duration: 120,
        },
        {
          missionResultId: 'mission-result-3',
          missionId: 3,
          missionOrder: 3,
          missionTitle: '플래너 작성',
          missionDescription: '새로운 플래너를 작성하고 저장해주세요.',
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
          missionTitle: '메인 페이지 탐색',
          missionDescription: '웹사이트의 메인 페이지를 둘러보고 주요 기능을 확인해주세요.',
          status: 'SUCCESS',
          createdAt: '2026-03-02',
          feedback: '좋아요',
          duration: 150,
        },
        {
          missionResultId: 'mission-result-2',
          missionId: 2,
          missionOrder: 2,
          missionTitle: '검색 기능 테스트',
          missionDescription: '검색 기능을 사용하여 원하는 정보를 찾아보세요.',
          status: 'FAILED',
          createdAt: '2026-03-02',
          feedback: '어디로 가야할지 모르겠어요.',
          duration: 450,
        },
        {
          missionResultId: 'mission-result-3',
          missionId: 4,
          missionOrder: 3,
          missionTitle: '상세 페이지 확인',
          missionDescription: '상품 상세 페이지의 정보를 확인하세요.',
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
          missionTitle: '메인 페이지 탐색',
          missionDescription: '웹사이트의 메인 페이지를 둘러보고 주요 기능을 확인해주세요.',
          status: 'SUCCESS',
          createdAt: '2026-03-02',
          duration: 200,
        },
        {
          missionResultId: 'mission-result-2',
          missionId: 2,
          missionOrder: 2,
          missionTitle: '검색 기능 테스트',
          missionDescription: '검색 기능을 사용하여 원하는 정보를 찾아보세요.',
          status: 'SUCCESS',
          createdAt: '2026-03-02',
          duration: 180,
        },
        {
          missionResultId: 'mission-result-3',
          missionId: 3,
          missionOrder: 3,
          missionTitle: '플래너 작성',
          missionDescription: '새로운 플래너를 작성하고 저장해주세요.',
          status: 'PENDING',
          createdAt: '2026-03-02',
          duration: 50,
        },
        {
          missionResultId: 'mission-result-4',
          missionId: 4,
          missionOrder: 4,
          missionTitle: '상세 페이지 확인',
          missionDescription: '상품 상세 페이지의 정보를 확인하세요.',
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
          missionTitle: '메인 페이지 탐색',
          missionDescription: '웹사이트의 메인 페이지를 둘러보고 주요 기능을 확인해주세요.',
          status: 'SUCCESS',
          createdAt: '2026-03-02',
          duration: 100,
        },
        {
          missionResultId: 'mission-result-2',
          missionId: 2,
          missionOrder: 2,
          missionTitle: '검색 기능 테스트',
          missionDescription: '검색 기능을 사용하여 원하는 정보를 찾아보세요.',
          status: 'SUCCESS',
          createdAt: '2026-03-02',
          duration: 90,
        },
        {
          missionResultId: 'mission-result-3',
          missionId: 3,
          missionOrder: 3,
          missionTitle: '플래너 작성',
          missionDescription: '새로운 플래너를 작성하고 저장해주세요.',
          status: 'IN_PROGRESS',
          createdAt: '2026-03-02',
          duration: 0,
        },
        {
          missionResultId: 'mission-result-4',
          missionId: 4,
          missionOrder: 4,
          missionTitle: '상세 페이지 확인',
          missionDescription: '상품 상세 페이지의 정보를 확인하세요.',
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
          missionTitle: '메인 페이지 탐색',
          missionDescription: '웹사이트의 메인 페이지를 둘러보고 주요 기능을 확인해주세요.',
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
          missionTitle: '메인 페이지 탐색',
          missionDescription: '웹사이트의 메인 페이지를 둘러보고 주요 기능을 확인해주세요.',
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
      missionTitle: '메인 페이지 탐색',
      missionDescription: '웹사이트의 메인 페이지를 둘러보고 주요 기능을 확인해주세요.',
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
      missionTitle: '메인 페이지 탐색',
      missionDescription: '웹사이트의 메인 페이지를 둘러보고 주요 기능을 확인해주세요.',
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
      missionTitle: '메인 페이지 탐색',
      missionDescription: '웹사이트의 메인 페이지를 둘러보고 주요 기능을 확인해주세요.',
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
      missionTitle: '메인 페이지 탐색',
      missionDescription: '웹사이트의 메인 페이지를 둘러보고 주요 기능을 확인해주세요.',
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
      missionTitle: '검색 기능 테스트',
      missionDescription: '검색 기능을 사용하여 원하는 정보를 찾아보세요.',
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
      missionTitle: '검색 기능 테스트',
      missionDescription: '검색 기능을 사용하여 원하는 정보를 찾아보세요.',
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
      missionTitle: '검색 기능 테스트',
      missionDescription: '검색 기능을 사용하여 원하는 정보를 찾아보세요.',
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
      missionTitle: '검색 기능 테스트',
      missionDescription: '검색 기능을 사용하여 원하는 정보를 찾아보세요.',
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
      missionTitle: '플래너 작성',
      missionDescription: '새로운 플래너를 작성하고 저장해주세요.',
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
      missionTitle: '플래너 작성',
      missionDescription: '새로운 플래너를 작성하고 저장해주세요.',
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
      missionTitle: '플래너 작성',
      missionDescription: '새로운 플래너를 작성하고 저장해주세요.',
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
      missionTitle: '상세 페이지 확인',
      missionDescription: '상품 상세 페이지의 정보를 확인하세요.',
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
      missionTitle: '상세 페이지 확인',
      missionDescription: '상품 상세 페이지의 정보를 확인하세요.',
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
      missionTitle: '상세 페이지 확인',
      missionDescription: '상품 상세 페이지의 정보를 확인하세요.',
      status: 'IN_PROGRESS',
      createdAt: '2026-03-02',
      duration: 0,
      participantId: 'tester-4',
      persona: 'GUEST',
    },
  ],
};

// mission-1에 대한 MissionDetail 모킹 데이터
const mockMissionDetail: Record<string, MissionDetail> = {
  'mission-1': {
    id: 'mission-1',
    missionOrder: 0,
    name: '메인 페이지 탐색',
    description: '웹사이트의 메인 페이지를 둘러보고 주요 기능을 확인해주세요.',
    missionUrl: 'https://notion.so',
    estimatedDuration: 5,
    successRate: 100,
    dropRate: 0,
    averageDuration: 187500, // 밀리초 단위 (약 3분 7초)
    averageIdleTime: 45000, // 밀리초 단위 (약 45초)
    averageRageClickCount: 2.5,
    averageMouseThrashingCount: 1.2,
    missionResults: [
      {
        id: 'mission-result-1',
        status: 'SUCCESS',
        duration: 300000,
        feedback: '매우 만족스러웠습니다.',
        participantId: 'tester-1',
        persona: 'GUEST',
      },
      {
        id: 'mission-result-2',
        status: 'SUCCESS',
        duration: 150000,
        feedback: '좋아요',
        participantId: 'tester-2',
        persona: 'GUEST',
      },
      {
        id: 'mission-result-3',
        status: 'SUCCESS',
        duration: 200000,
        feedback: undefined,
        participantId: 'tester-3',
        persona: 'GUEST',
      },
      {
        id: 'mission-result-4',
        status: 'SUCCESS',
        duration: 100000,
        feedback: undefined,
        participantId: 'tester-4',
        persona: 'GUEST',
      },
    ],
  },
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

    console.log('[MSW] Intercepted request for missionId:', missionId);

    // mission-1 같은 문자열 ID 처리
    if (typeof missionId === 'string' && missionId.startsWith('mission-')) {
      const missionDetail = mockMissionDetail[missionId];
      if (missionDetail) {
        console.log('[MSW] Returning mission detail:', missionDetail);
        return HttpResponse.json(missionDetail);
      }
    }

    // 숫자 ID 처리 (기존 로직 유지)
    const numericId = Number(missionId);
    if (!isNaN(numericId)) {
      const results = mockMissionResults[numericId] || [];
      console.log('[MSW] Returning results:', results);
      return HttpResponse.json(results);
    }

    // 찾을 수 없는 경우
    console.warn(`[MSW] Mission detail not found for missionId: ${missionId}`);
    return new HttpResponse(null, {
      status: 404,
      statusText: 'Mission detail not found',
    });
  }),

  // GET /tests/:testId/result/missions - 테스트의 모든 미션과 각 미션의 결과 조회
  http.get(`${CLIENT_BASE_URL}/tests/:testId/result/missions`, ({ params }) => {
    const { testId } = params;
    const testIdNum = Number(testId);

    // 테스트 ID와 미션 publicId 매핑 (테스트 ID 1의 경우만 처리)
    const missionIdMapping: Record<string, number> = {
      'mission-1': 1,
      'mission-2': 2,
      'mission-3': 3,
      'mission-4': 4,
    };

    // 테스트의 미션 목록 가져오기 (tests.ts의 mockMissions 사용)
    const testMissions = testIdNum === 1
      ? [
          { publicId: 'mission-1', order: 0, name: '메인 페이지 탐색', description: '웹사이트의 메인 페이지를 둘러보고 주요 기능을 확인해주세요.', missionUrl: 'https://notion.so', estimatedDuration: 5 },
          { publicId: 'mission-2', order: 1, name: '검색 기능 테스트', description: '검색 기능을 사용하여 원하는 정보를 찾아보세요.', missionUrl: 'https://notion.so/search', estimatedDuration: 10 },
        ]
      : testIdNum === 3
        ? [
            { publicId: 'mission-3', order: 0, name: '플래너 작성', description: '새로운 플래너를 작성하고 저장해주세요.', missionUrl: 'https://example.com/planner', estimatedDuration: 15 },
          ]
        : [];

    // 각 미션에 대한 결과 생성
    const missions: MissionDetail[] = testMissions.map((mission) => {
      const missionId = missionIdMapping[mission.publicId];
      const missionResults = mockMissionResults[missionId] || [];

      // 통계 계산
      const totalResults = missionResults.length;
      const successCount = missionResults.filter((r) => r.status === 'SUCCESS').length;
      const pendingCount = missionResults.filter((r) => r.status === 'PENDING').length;
      const successRate = totalResults > 0 ? Math.round((successCount / totalResults) * 100) : 0;
      const dropRate = totalResults > 0 ? Math.round((pendingCount / totalResults) * 100) : 0;

      const resultsWithDuration = missionResults.filter((r) => r.duration !== undefined && r.duration !== null);
      const averageDuration =
        resultsWithDuration.length > 0
          ? Math.round(
              resultsWithDuration.reduce((sum, r) => sum + (r.duration || 0), 0) /
                resultsWithDuration.length,
            )
          : 0;

      // MissionResults 형태로 변환
      const missionResultsData: MissionResults[] = missionResults.map((r) => ({
        id: r.missionResultId,
        status: r.status,
        duration: r.duration,
        feedback: r.feedback || undefined,
        participantId: r.participantId,
        persona: r.persona,
      }));

      return {
        id: mission.publicId,
        missionOrder: mission.order,
        name: mission.name,
        description: mission.description,
        missionUrl: mission.missionUrl,
        estimatedDuration: mission.estimatedDuration,
        successRate,
        dropRate,
        averageDuration,
        averageIdleTime: 0,
        averageRageClickCount: 0,
        averageMouseThrashingCount: 0,
        missionResults: missionResultsData,
      };
    });

    const response: TestMissionsResults = {
      missions,
    };

    console.log('[MSW] Intercepted request for testId:', testId);
    console.log('[MSW] Returning missions results:', response);

    return HttpResponse.json(response);
  }),
  // GET /tests/:testId/result/participants/:participantId - 특정 참여자 상세 조회
  http.get(`${CLIENT_BASE_URL}/tests/:testId/result/participants/:participantId`, ({ params }) => {
    const { testId, participantId } = params;
    const testIdNum = Number(testId);
    
    console.log(`[MSW] Intercepted request for participant detail: testId=${testId}, participantId=${participantId}`);

    const participants = mockParticipantResults[testIdNum];
    if (!participants) {
      return new HttpResponse(null, { status: 404, statusText: 'Test not found' });
    }

    const participant = participants.find((p) => p.participantId === participantId);
    
    if (!participant) {
      return new HttpResponse(null, { status: 404, statusText: 'Participant not found' });
    }

    return HttpResponse.json(participant);
  }),
];
