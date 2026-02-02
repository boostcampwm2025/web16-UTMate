import { http, HttpResponse, delay } from 'msw';
import { CLIENT_BASE_URL } from '@/shared/constants/api';
import type {
  TestResultSummary,
  ParticipantResult,
  MainFeedback,
  MissionResultWithParticipant,
  TestMissionsResults,
  MissionDetail,
  MissionResults,
  MissionResultDetail,
} from '@/features/(test-result)/types';
import { TestStatus } from '@/features/(test-manage)/types';

const mockTestSummaries: TestResultSummary[] = [
  {
    id: 1,
    title: 'Notion 서비스 사용성 테스트',
    status: TestStatus.PUBLISHED,
    description: 'Notion의 새로운 기능을 사용자들이 어떻게 활용하는지 확인하기 위한 테스트입니다.',
    startDate: '2026-01-22T14:01:21.000Z',
    endDate: undefined,
    totalParticipants: 3,
  },
];

const mockParticipantResults: Record<number, ParticipantResult[]> = {
  1: [
    {
      participantId: 'tester-1',
      personaTags: ['GUEST'],
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
          duration: 30000,
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
          duration: 68903,
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
          duration: 68903,
        },
      ],
    },
    {
      participantId: 'tester-2',
      personaTags: ['GUEST'],
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
          duration: 68903,
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
          duration: 68903,
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
          duration: 68903,
        },
      ],
    },
    {
      participantId: 'tester-3',
      personaTags: ['GUEST'],
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
          duration: 68903,
        },
        {
          missionResultId: 'mission-result-2',
          missionId: 2,
          missionOrder: 2,
          missionTitle: '검색 기능 테스트',
          missionDescription: '검색 기능을 사용하여 원하는 정보를 찾아보세요.',
          status: 'SUCCESS',
          createdAt: '2026-03-02',
          duration: 68903,
        },
        {
          missionResultId: 'mission-result-3',
          missionId: 3,
          missionOrder: 3,
          missionTitle: '플래너 작성',
          missionDescription: '새로운 플래너를 작성하고 저장해주세요.',
          status: 'PENDING',
          createdAt: '2026-03-02',
          duration: 68903,
        },
        {
          missionResultId: 'mission-result-4',
          missionId: 4,
          missionOrder: 4,
          missionTitle: '상세 페이지 확인',
          missionDescription: '상품 상세 페이지의 정보를 확인하세요.',
          status: 'PENDING',
          createdAt: '2026-03-02',
          duration: 68903,
        },
      ],
    },
    {
      participantId: 'tester-4',
      personaTags: ['GUEST'],
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
          duration: 3200,
        },
        {
          missionResultId: 'mission-result-2',
          missionId: 2,
          missionOrder: 2,
          missionTitle: '검색 기능 테스트',
          missionDescription: '검색 기능을 사용하여 원하는 정보를 찾아보세요.',
          status: 'SUCCESS',
          createdAt: '2026-03-02',
          duration: 3400,
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
      personaTags: ['GUEST'],
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
          duration: 3000,
        },
      ],
    },
  ],
  4: [],
  5: [
    {
      participantId: 'tester-6',
      personaTags: ['GUEST'],
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
          duration: 3000,
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
      personaTags: ['남성', '20대', '교육', '외국어', 'IT'],
    },
    {
      participantId: 'tester-2',
      content: '검색 필터 기능이 좀 더 다양했으면 좋겠습니다.',
      createdAt: new Date(now - 10 * HOUR).toISOString(),
      personaTags: ['GUEST'],
    },
    {
      participantId: 'tester-3',
      content: '전반적인 로딩 속도가 조금 느린 것 같아 개선이 필요해 보입니다.',
      createdAt: new Date(now - 3 * DAY).toISOString(),
      personaTags: ['GUEST'],
    },
    {
      participantId: 'tester-4',
      content: '메인 페이지의 디자인이 직관적이어서 사용하기 편리했습니다.',
      createdAt: new Date(now - 30 * DAY).toISOString(),
      personaTags: ['GUEST'],
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
      personaTags: ['GUEST'],
    },
  ],
  4: [],
  5: [
    {
      participantId: 'tester-6',
      content: '전체적으로 만족스러운 테스트 경험이었습니다.',
      createdAt: '2026-03-02',
      personaTags: ['GUEST'],
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
      duration: 21808,
      participantId: 'tester-1',
      personaTags: ['남성', '20대', '교육', '외국어', 'IT'],
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
      duration: 21808,
      participantId: 'tester-2',
      personaTags: ['GUEST'],
    },
    {
      missionResultId: 'mission-result-3',
      missionId: 1,
      missionOrder: 1,
      missionTitle: '메인 페이지 탐색',
      missionDescription: '웹사이트의 메인 페이지를 둘러보고 주요 기능을 확인해주세요.',
      status: 'SUCCESS',
      createdAt: '2026-03-02',
      duration: 21808,
      participantId: 'tester-3',
      personaTags: ['GUEST'],
    },
    {
      missionResultId: 'mission-result-4',
      missionId: 1,
      missionOrder: 1,
      missionTitle: '메인 페이지 탐색',
      missionDescription: '웹사이트의 메인 페이지를 둘러보고 주요 기능을 확인해주세요.',
      status: 'SUCCESS',
      createdAt: '2026-03-02',
      duration: 21808,
      participantId: 'tester-4',
      personaTags: ['GUEST'],
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
      duration: 21808,
      participantId: 'tester-1',
      personaTags: ['GUEST'],
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
      duration: 21808,
      participantId: 'tester-2',
      personaTags: ['GUEST'],
    },
    {
      missionResultId: 'mission-result-3',
      missionId: 2,
      missionOrder: 2,
      missionTitle: '검색 기능 테스트',
      missionDescription: '검색 기능을 사용하여 원하는 정보를 찾아보세요.',
      status: 'SUCCESS',
      createdAt: '2026-03-02',
      duration: 21808,
      participantId: 'tester-3',
      personaTags: ['GUEST'],
    },
    {
      missionResultId: 'mission-result-4',
      missionId: 2,
      missionOrder: 2,
      missionTitle: '검색 기능 테스트',
      missionDescription: '검색 기능을 사용하여 원하는 정보를 찾아보세요.',
      status: 'SUCCESS',
      createdAt: '2026-03-02',
      duration: 21808,
      participantId: 'tester-4',
      personaTags: ['GUEST'],
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
      duration: 21808,
      participantId: 'tester-1',
      personaTags: ['GUEST'],
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
      personaTags: ['GUEST'],
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
      personaTags: ['GUEST'],
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
      duration: 21808,
      participantId: 'tester-2',
      personaTags: ['GUEST'],
    },
    {
      missionResultId: 'mission-result-2',
      missionId: 4,
      missionOrder: 4,
      missionTitle: '상세 페이지 확인',
      missionDescription: '상품 상세 페이지의 정보를 확인하세요.',
      status: 'PENDING',
      createdAt: '2026-03-02',
      duration: 21808,
      participantId: 'tester-3',
      personaTags: ['GUEST'],
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
      personaTags: ['GUEST'],
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
        personaTags: ['GUEST'],
      },
      {
        id: 'mission-result-2',
        status: 'SUCCESS',
        duration: 150000,
        feedback: '좋아요',
        participantId: 'tester-2',
        personaTags: ['GUEST'],
      },
      {
        id: 'mission-result-3',
        status: 'SUCCESS',
        duration: 200000,
        feedback: undefined,
        participantId: 'tester-3',
        personaTags: ['GUEST'],
      },
      {
        id: 'mission-result-4',
        status: 'SUCCESS',
        duration: 100000,
        feedback: undefined,
        participantId: 'tester-4',
        personaTags: ['GUEST'],
      },
    ],
  },
};

export const resultHandlers = [
  // GET /tests/:testId/result - 테스트 요약 정보 조회
  http.get(`${CLIENT_BASE_URL}/tests/:testId/result`, ({ params }) => {
    const { testId } = params;

    const summary = mockTestSummaries.find((s) => s.id === Number(testId));

    if (!summary) {
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

    // mission-1 같은 문자열 ID 처리
    if (typeof missionId === 'string' && missionId.startsWith('mission-')) {
      const missionDetail = mockMissionDetail[missionId];
      if (missionDetail) {
        return HttpResponse.json(missionDetail);
      }
    }

    // 숫자 ID 처리 (기존 로직 유지)
    const numericId = Number(missionId);
    if (!isNaN(numericId)) {
      const results = mockMissionResults[numericId] || [];
      return HttpResponse.json(results);
    }

    // 찾을 수 없는 경우
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
    const testMissions =
      testIdNum === 1
        ? [
            {
              publicId: 'mission-1',
              order: 0,
              name: '메인 페이지 탐색',
              description: '웹사이트의 메인 페이지를 둘러보고 주요 기능을 확인해주세요.',
              missionUrl: 'https://notion.so',
              estimatedDuration: 5,
            },
            {
              publicId: 'mission-2',
              order: 1,
              name: '검색 기능 테스트',
              description: '검색 기능을 사용하여 원하는 정보를 찾아보세요.',
              missionUrl: 'https://notion.so/search',
              estimatedDuration: 10,
            },
          ]
        : testIdNum === 3
          ? [
              {
                publicId: 'mission-3',
                order: 0,
                name: '플래너 작성',
                description: '새로운 플래너를 작성하고 저장해주세요.',
                missionUrl: 'https://example.com/planner',
                estimatedDuration: 15,
              },
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

      const resultsWithDuration = missionResults.filter(
        (r) => r.duration !== undefined && r.duration !== null,
      );
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
        personaTags: r.personaTags,
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

    return HttpResponse.json(response);
  }),
  // GET /tests/:testId/result/participants/:participantId - 특정 참여자 상세 조회
  http.get(`${CLIENT_BASE_URL}/tests/:testId/result/participants/:participantId`, ({ params }) => {
    const { testId, participantId } = params;
    const testIdNum = Number(testId);

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

  // GET /mission-results/:id - 미션 결과 상세 조회
  http.get(`${CLIENT_BASE_URL}/mission-results/:id`, ({ params }) => {
    const { id } = params;

    // 의도적인 딜레이
    delay(800);

    // 모킹 데이터 생성
    const BASE_TIME = 1768917821307;
    const mockDetail: MissionResultDetail = {
      id: id as string,
      status: 'SUCCESS',
      feedback: '네비게이션이 직관적이라 찾기 쉬웠습니다.',
      missionId: 'mission-1',
      presignedUrl:
        'https://kr.object.ncloudstorage.com/mock-bucket/Ey_FDxlnOwx_IGT14hjoW.log.jsonl.gz',
      duration: 15600, // 약 15.6초
      totalIdleTime: 2300,
      rageClickCount: 3,
      mouseThrashingCount: 1,
      analysisData: {
        startTime: BASE_TIME + 1000,
        endTime: BASE_TIME + 16600,
        timeToFirstInteraction: 1500,
        idleTime: [
          { timestamp: BASE_TIME + 2500, duration: 1000 },
          { timestamp: BASE_TIME + 8000, duration: 1300 },
        ],
        rageClickCount: [
          { timestamp: BASE_TIME + 1500, duration: 0, count: 2 },
          { timestamp: BASE_TIME + 3500, duration: 0, count: 1 },
        ],
        mouseThrashingCount: [{ timestamp: BASE_TIME + 4200, duration: 500, count: 1 }],
      },
    };

    return HttpResponse.json(mockDetail);
  }),

  // NCP Bucket Mocking
  http.get(
    'https://kr.object.ncloudstorage.com/mock-bucket/Ey_FDxlnOwx_IGT14hjoW.log.jsonl.gz',
    async () => {
      // 의도적인 딜레이
      delay(800);

      const logContent = `{"type":0,"data":{},"timestamp":1768917821307}
{"type":1,"data":{},"timestamp":1768917821308}
{"type":4,"data":{"href":"https://jammin94.github.io/jamjam94.github.io/?participant-id=Ey_FDxlnOwx_IGT14hjoW&mission-id=7f_kqNJLp6921oNp_8h2G","width":1200,"height":799},"timestamp":1768917821308}
{"type":2,"data":{"node":{"type":0,"childNodes":[{"type":1,"name":"html","publicId":"","systemId":"","id":2},{"type":2,"tagName":"html","attributes":{"lang":"ko"},"childNodes":[{"type":2,"tagName":"head","attributes":{},"childNodes":[{"type":3,"textContent":"\\n    ","id":5},{"type":2,"tagName":"meta","attributes":{"charset":"UTF-8"},"childNodes":[],"id":6},{"type":3,"textContent":"\\n    ","id":7},{"type":2,"tagName":"meta","attributes":{"name":"viewport","content":"width=device-width, initial-scale=1.0"},"childNodes":[],"id":8},{"type":3,"textContent":"\\n    ","id":9},{"type":2,"tagName":"title","attributes":{},"childNodes":[{"type":3,"textContent":"AI 플랫폼 프로젝트","id":11}],"id":10},{"type":3,"textContent":"\\n    ","id":12},{"type":2,"tagName":"script","attributes":{"src":"http://localhost:5555/utmate-sdk.iife.js"},"childNodes":[],"id":13},{"type":3,"textContent":"\\n\\n    ","id":14},{"type":2,"tagName":"style","attributes":{"_cssText":"* { margin: 0px; padding: 0px; box-sizing: border-box; }body { font-family: -apple-system, BlinkMacSystemFont, \\"Segoe UI\\", Roboto, Oxygen, Ubuntu, sans-serif; background: linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; }.container { max-width: 900px; width: 100%; }h1 { text-align: center; color: white; font-size: 32px; margin-bottom: 15px; text-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px; }.subtitle { text-align: center; color: rgba(255, 255, 255, 0.9); font-size: 16px; margin-bottom: 50px; }.cards-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 30px; }.platform-card { background: white; border-radius: 20px; padding: 30px; box-shadow: rgba(0, 0, 0, 0.3) 0px 20px 60px; transition: transform 0.3s, box-shadow 0.3s; cursor: pointer; text-decoration: none; color: inherit; display: block; }.platform-card:hover { transform: translateY(-10px); box-shadow: rgba(0, 0, 0, 0.4) 0px 30px 80px; }.card-icon { font-size: 60px; text-align: center; margin-bottom: 20px; }.card-title { font-size: 22px; font-weight: bold; color: rgb(51, 51, 51); margin-bottom: 15px; text-align: center; }.card-description { font-size: 14px; color: rgb(102, 102, 102); line-height: 1.6; margin-bottom: 20px; }.feature-list { list-style: none; margin-bottom: 20px; }.feature-list li { font-size: 13px; color: rgb(85, 85, 85); padding: 8px 0px 8px 25px; position: relative; }.feature-list li::before { content: \\"✓\\"; position: absolute; left: 0px; color: rgb(102, 126, 234); font-weight: bold; }.btn-enter { width: 100%; padding: 15px; background: linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: opacity 0.3s; }.btn-enter:hover { opacity: 0.9; }@media (max-width: 768px) {\\n  h1 { font-size: 24px; }\\n  .subtitle { font-size: 14px; margin-bottom: 30px; }\\n  .cards-container { grid-template-columns: 1fr; gap: 20px; }\\n  .platform-card { padding: 25px; }\\n  .card-icon { font-size: 50px; }\\n  .card-title { font-size: 20px; }\\n}"},"childNodes":[{"type":3,"textContent":"","id":16}],"id":15},{"type":3,"textContent":"\\n  ","id":17}],"id":4},{"type":3,"textContent":"\\n  ","id":18},{"type":2,"tagName":"body","attributes":{},"childNodes":[{"type":3,"textContent":"\\n    ","id":20},{"type":2,"tagName":"div","attributes":{"class":"container"},"childNodes":[{"type":3,"textContent":"\\n      ","id":22},{"type":2,"tagName":"h1","attributes":{},"childNodes":[{"type":3,"textContent":"AI 기반 플랫폼 프로젝트","id":24}],"id":23},{"type":3,"textContent":"\\n      ","id":25},{"type":2,"tagName":"p","attributes":{"class":"subtitle"},"childNodes":[{"type":3,"textContent":"여행과 학습을 혁신하는 두 가지 플랫폼을 경험해보세요","id":27}],"id":26},{"type":3,"textContent":"\\n\\n      ","id":28},{"type":2,"tagName":"div","attributes":{"class":"cards-container"},"childNodes":[{"type":3,"textContent":"\\n        ","id":30},{"type":2,"tagName":"a","attributes":{"href":"https://jammin94.github.io/jamjam94.github.io/local-travel-platform.html","class":"platform-card"},"childNodes":[{"type":3,"textContent":"\\n          ","id":32},{"type":2,"tagName":"div","attributes":{"class":"card-icon"},"childNodes":[{"type":3,"textContent":"🤝","id":34}],"id":33},{"type":3,"textContent":"\\n          ","id":35},{"type":2,"tagName":"h2","attributes":{"class":"card-title"},"childNodes":[{"type":3,"textContent":"현지인 필터 & 문화 코칭","id":37}],"id":36},{"type":3,"textContent":"\\n          ","id":38},{"type":2,"tagName":"p","attributes":{"class":"card-description"},"childNodes":[{"type":3,"textContent":"가짜 관광지 정보를 걸러내고, 진짜 현지인의 추천과 문화 통찰을 받아보세요.","id":40}],"id":39},{"type":3,"textContent":"\\n          ","id":41},{"type":2,"tagName":"ul","attributes":{"class":"feature-list"},"childNodes":[{"type":3,"textContent":"\\n            ","id":43},{"type":2,"tagName":"li","attributes":{},"childNodes":[{"type":3,"textContent":"AI 기반 진정성 필터","id":45}],"id":44},{"type":3,"textContent":"\\n            ","id":46},{"type":2,"tagName":"li","attributes":{},"childNodes":[{"type":3,"textContent":"현지인만 아는 최적 경로","id":48}],"id":47},{"type":3,"textContent":"\\n            ","id":49},{"type":2,"tagName":"li","attributes":{},"childNodes":[{"type":3,"textContent":"실시간 문화 코칭","id":51}],"id":50},{"type":3,"textContent":"\\n            ","id":52},{"type":2,"tagName":"li","attributes":{},"childNodes":[{"type":3,"textContent":"현지인-여행객 매칭","id":54}],"id":53},{"type":3,"textContent":"\\n          ","id":55}],"id":42},{"type":3,"textContent":"\\n          ","id":56},{"type":2,"tagName":"button","attributes":{"class":"btn-enter"},"childNodes":[{"type":3,"textContent":"플랫폼 체험하기","id":58}],"id":57},{"type":3,"textContent":"\\n        ","id":59}],"id":31},{"type":3,"textContent":"\\n\\n        ","id":60},{"type":2,"tagName":"a","attributes":{"href":"https://jammin94.github.io/jamjam94.github.io/quest-learning-platform.html","class":"platform-card"},"childNodes":[{"type":3,"textContent":"\\n          ","id":62},{"type":2,"tagName":"div","attributes":{"class":"card-icon"},"childNodes":[{"type":3,"textContent":"🎮","id":64}],"id":63},{"type":3,"textContent":"\\n          ","id":65},{"type":2,"tagName":"h2","attributes":{"class":"card-title"},"childNodes":[{"type":3,"textContent":"퀘스트형 지식 마스터리","id":67}],"id":66},{"type":3,"textContent":"\\n          ","id":68},{"type":2,"tagName":"p","attributes":{"class":"card-description"},"childNodes":[{"type":3,"textContent":"게임처럼 즐겁게 학습하고, AI 검증을 통해 진정한 마스터리를 달성하세요.","id":70}],"id":69},{"type":3,"textContent":"\\n          ","id":71},{"type":2,"tagName":"ul","attributes":{"class":"feature-list"},"childNodes":[{"type":3,"textContent":"\\n            ","id":73},{"type":2,"tagName":"li","attributes":{},"childNodes":[{"type":3,"textContent":"AI 기반 학습 경로 설계","id":75}],"id":74},{"type":3,"textContent":"\\n            ","id":76},{"type":2,"tagName":"li","attributes":{},"childNodes":[{"type":3,"textContent":"게임형 퀘스트 시스템","id":78}],"id":77},{"type":3,"textContent":"\\n            ","id":79},{"type":2,"tagName":"li","attributes":{},"childNodes":[{"type":3,"textContent":"엄격한 AI 지식 검증","id":81}],"id":80},{"type":3,"textContent":"\\n            ","id":82},{"type":2,"tagName":"li","attributes":{},"childNodes":[{"type":3,"textContent":"XP, 레벨, 칭호 시스템","id":84}],"id":83},{"type":3,"textContent":"\\n          ","id":85}],"id":72},{"type":3,"textContent":"\\n          ","id":86},{"type":2,"tagName":"button","attributes":{"class":"btn-enter"},"childNodes":[{"type":3,"textContent":"플랫폼 체험하기","id":88}],"id":87},{"type":3,"textContent":"\\n        ","id":89}],"id":61},{"type":3,"textContent":"\\n      ","id":90}],"id":29},{"type":3,"textContent":"\\n    ","id":91}],"id":21},{"type":3,"textContent":"\\n\\n    ","id":92},{"type":2,"tagName":"script","attributes":{},"childNodes":[{"type":3,"textContent":"SCRIPT_PLACEHOLDER","id":94}],"id":93},{"type":3,"textContent":"\\n  \\n\\n","id":95}],"id":19}],"id":3}],"id":1},"initialOffset":{"left":0,"top":0}},"timestamp":1768917821320}
{"type":3,"data":{"source":0,"texts":[],"attributes":[{"id":31,"attributes":{"style":"opacity: 0; transform: translateY(30px);"}},{"id":61,"attributes":{"style":"opacity: 0; transform: translateY(30px);"}}],"removes":[],"adds":[]},"timestamp":1768917821323}
{"type":3,"data":{"source":0,"texts":[],"attributes":[{"id":31,"attributes":{"style":"opacity: 1; transform: translateY(0px); transition: opacity 0.6s, transform 0.6s;"}}],"removes":[],"adds":[]},"timestamp":1768917821326}
{"type":3,"data":{"source":1,"positions":[{"x":854,"y":348,"id":66,"timeOffset":-1}]},"timestamp":1768917821369}
{"type":3,"data":{"source":0,"texts":[],"attributes":[{"id":61,"attributes":{"style":"opacity: 1; transform: translateY(0px); transition: opacity 0.6s, transform 0.6s;"}}],"removes":[],"adds":[]},"timestamp":1768917821524}
{"type":3,"data":{"source":1,"positions":[{"x":836,"y":328,"id":63,"timeOffset":-437},{"x":835,"y":326,"id":63,"timeOffset":-387},{"x":835,"y":324,"id":63,"timeOffset":-321},{"x":840,"y":316,"id":63,"timeOffset":-254},{"x":849,"y":298,"id":63,"timeOffset":-204},{"x":848,"y":294,"id":63,"timeOffset":-154},{"x":783,"y":277,"id":63,"timeOffset":-104},{"x":350,"y":125,"id":23,"timeOffset":-54},{"x":0,"y":57,"id":19,"timeOffset":-4}]},"timestamp":1768917821870}
{"type":3,"data":{"source":1,"positions":[{"x":0,"y":43,"id":19,"timeOffset":-455},{"x":5,"y":42,"id":19,"timeOffset":-371},{"x":46,"y":33,"id":19,"timeOffset":-321},{"x":291,"y":81,"id":19,"timeOffset":-271},{"x":469,"y":166,"id":21,"timeOffset":-221},{"x":651,"y":280,"id":63,"timeOffset":-169},{"x":845,"y":261,"id":63,"timeOffset":-105},{"x":903,"y":159,"id":26,"timeOffset":-39}]},"timestamp":1768917822371}
{"type":3,"data":{"source":2,"type":1,"id":21,"x":947.18359375,"y":130.953125},"timestamp":1768917822609}
{"type":3,"data":{"source":2,"type":0,"id":21,"x":947.18359375,"y":130.953125},"timestamp":1768917822676}
{"type":3,"data":{"source":2,"type":2,"id":21,"x":947,"y":130,"pointerType":0},"timestamp":1768917822676}
{"type":3,"data":{"source":1,"positions":[{"x":909,"y":137,"id":21,"timeOffset":-489},{"x":914,"y":134,"id":21,"timeOffset":-438},{"x":924,"y":132,"id":21,"timeOffset":-388},{"x":938,"y":132,"id":21,"timeOffset":-321},{"x":948,"y":131,"id":21,"timeOffset":-155},{"x":977,"y":154,"id":26,"timeOffset":-105},{"x":1017,"y":193,"id":21,"timeOffset":-55},{"x":1058,"y":267,"id":19,"timeOffset":-5}]},"timestamp":1768917822872}
{"type":3,"data":{"source":1,"positions":[{"x":1086,"y":485,"id":19,"timeOffset":-457},{"x":1078,"y":566,"id":19,"timeOffset":-407},{"x":1054,"y":616,"id":19,"timeOffset":-357},{"x":1018,"y":637,"id":87,"timeOffset":-290},{"x":931,"y":646,"id":87,"timeOffset":-224},{"x":719,"y":652,"id":61,"timeOffset":-174},{"x":620,"y":653,"id":61,"timeOffset":-124},{"x":493,"y":638,"id":57,"timeOffset":-74},{"x":415,"y":571,"id":53,"timeOffset":-23}]},"timestamp":1768917823374}
{"type":3,"data":{"source":1,"positions":[{"x":367,"y":455,"id":44,"timeOffset":-473},{"x":275,"y":259,"id":33,"timeOffset":-408},{"x":266,"y":139,"id":21,"timeOffset":-358},{"x":280,"y":109,"id":23,"timeOffset":-308},{"x":358,"y":90,"id":23,"timeOffset":-258},{"x":690,"y":84,"id":19,"timeOffset":-208},{"x":842,"y":143,"id":26,"timeOffset":-158},{"x":869,"y":229,"id":61,"timeOffset":-106},{"x":802,"y":399,"id":69,"timeOffset":-42}]},"timestamp":1768917823875}
{"type":3,"data":{"source":1,"positions":[{"x":721,"y":581,"id":61,"timeOffset":-491},{"x":704,"y":665,"id":61,"timeOffset":-424},{"x":714,"y":690,"id":21,"timeOffset":-374},{"x":760,"y":703,"id":21,"timeOffset":-324},{"x":889,"y":677,"id":61,"timeOffset":-274},{"x":998,"y":476,"id":74,"timeOffset":-209},{"x":1006,"y":364,"id":66,"timeOffset":-158},{"x":958,"y":257,"id":63,"timeOffset":-108},{"x":923,"y":200,"id":21,"timeOffset":-58},{"x":870,"y":172,"id":21,"timeOffset":-8}]},"timestamp":1768917824375}
{"type":3,"data":{"source":1,"positions":[{"x":688,"y":168,"id":21,"timeOffset":-459},{"x":535,"y":200,"id":21,"timeOffset":-409},{"x":530,"y":221,"id":31,"timeOffset":-358},{"x":575,"y":361,"id":31,"timeOffset":-292},{"x":603,"y":456,"id":29,"timeOffset":-242},{"x":603,"y":541,"id":29,"timeOffset":-192},{"x":580,"y":688,"id":21,"timeOffset":-142},{"x":514,"y":736,"id":19,"timeOffset":-91},{"x":354,"y":765,"id":19,"timeOffset":-25}]},"timestamp":1768917824876}
{"type":3,"data":{"source":1,"positions":[{"x":77,"y":764,"id":19,"timeOffset":-427},{"x":20,"y":556,"id":19,"timeOffset":-367},{"x":0,"y":202,"id":19,"timeOffset":-317},{"x":15,"y":166,"id":19,"timeOffset":-267},{"x":50,"y":133,"id":19,"timeOffset":-216},{"x":268,"y":37,"id":19,"timeOffset":-150},{"x":608,"y":11,"id":19,"timeOffset":-12}]},"timestamp":1768917825376}
{"type":3,"data":{"source":1,"positions":[{"x":701,"y":281,"id":63,"timeOffset":-445},{"x":933,"y":792,"id":19,"timeOffset":-174},{"x":1035,"y":512,"id":61,"timeOffset":-109},{"x":998,"y":362,"id":66,"timeOffset":-58},{"x":861,"y":238,"id":61,"timeOffset":-8}]},"timestamp":1768917825876}`;

      return new HttpResponse(logContent, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
    },
  ),
];
