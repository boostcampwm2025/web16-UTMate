import { http, HttpResponse } from 'msw';
import { CLIENT_BASE_URL } from '@/shared/constants/api';
import type { Test, TestDetail, TestMission, UserSummary } from '@/features/(test-manage)/types';
import { TestStatus } from '@/features/(test-manage)/types';

// Mock 데이터
const mockUsers: UserSummary[] = [
  {
    publicId: 'user-1',
    username: '문성',
    avatarUrl: '',
  },
  {
    publicId: 'user-2',
    username: '문성2',
    avatarUrl: '',
  },
  {
    publicId: 'user-3',
    username: '문성3',
    avatarUrl: '',
  },
];

const mockMissions: Record<string, TestMission[]> = {
  '1': [
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
  ],
  '2': [],
  '3': [
    {
      publicId: 'mission-3',
      order: 0,
      name: '플래너 작성',
      description: '새로운 플래너를 작성하고 저장해주세요.',
      missionUrl: 'https://example.com/planner',
      estimatedDuration: 15,
    },
  ],
  '4': [],
  '5': [],
};

const mockTests: Test[] = [
  {
    publicId: '1',
    title: 'New maze 3',
    description: 'Notion 서비스 사용성 테스트',
    status: TestStatus.PUBLISHED,
    url: 'https://notion.so',
    sdkStatus: true,
    owner: mockUsers[0],
    members: mockUsers,
    isPublic: false,
    targetAgeGroup: [],
    targetGender: [],
  },
  {
    publicId: '2',
    title: 'New maze 2',
    description: '',
    status: TestStatus.DRAFT,
    url: '',
    sdkStatus: false,
    owner: mockUsers[0],
    members: mockUsers,
    isPublic: false,
    targetAgeGroup: [],
    targetGender: [],
  },
  {
    publicId: '3',
    title: '셀프플레너',
    description: '플래너 앱 테스트',
    status: TestStatus.PUBLISHED,
    url: 'https://example.com',
    sdkStatus: true,
    owner: mockUsers[0],
    members: mockUsers,
    isPublic: false,
    targetAgeGroup: [],
    targetGender: [],
  },
  {
    publicId: '4',
    title: '테스트 4',
    description: '네 번째 테스트입니다.',
    status: TestStatus.DRAFT,
    url: '',
    sdkStatus: false,
    owner: mockUsers[0],
    members: mockUsers,
    isPublic: false,
    targetAgeGroup: [],
    targetGender: [],
  },
  {
    publicId: '5',
    title: '테스트 5',
    description: '다섯 번째 테스트입니다.',
    status: TestStatus.PUBLISHED,
    url: 'https://example.com/test5',
    sdkStatus: true,
    owner: mockUsers[0],
    members: mockUsers,
    isPublic: false,
    targetAgeGroup: [],
    targetGender: [],
  },
];

export const testsHandlers = [
  // GET /tests - 스터디(테스트) 목록 조회
  http.get(`${CLIENT_BASE_URL}/tests`, ({ request }) => {
    const url = new URL(request.url);
    const scope = url.searchParams.get('scope');

    if (scope === 'me') {
      return HttpResponse.json({
        tests: mockTests,
        total: mockTests.length,
      });
    }

    return HttpResponse.json({
      tests: [],
      total: 0,
    });
  }),

  // GET /tests/:id - 테스트 개별 조회
  http.get(`${CLIENT_BASE_URL}/tests/:id`, ({ params }) => {
    const { id } = params;
    const test = mockTests.find((t) => t.publicId === id);

    if (!test) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Test not found',
      });
    }

    const testDetail: TestDetail = {
      ...test,
      missions: mockMissions[id as string] || [],
    };

    return HttpResponse.json(testDetail);
  }),

  // POST /tests - 테스트 생성
  http.post(`${CLIENT_BASE_URL}/tests`, async () => {
    const newTestId = String(mockTests.length + 1);
    const newTest: Test = {
      publicId: newTestId,
      title: '새 테스트',
      description: '',
      status: TestStatus.DRAFT,
      url: '',
      sdkStatus: false,
      owner: mockUsers[0],
      members: [],
      isPublic: false,
      targetAgeGroup: [],
      targetGender: [],
    };

    mockTests.push(newTest);
    mockMissions[newTestId] = [];

    return HttpResponse.json(newTest, { status: 201 });
  }),

  // PUT /tests/:id - 테스트 수정
  http.put(`${CLIENT_BASE_URL}/tests/:id`, async ({ params, request }) => {
    const { id } = params;
    const testIndex = mockTests.findIndex((t) => t.publicId === id);

    if (testIndex === -1) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Test not found',
      });
    }

    const body = (await request.json()) as Partial<TestDetail>;
    const updatedTest: Test = {
      ...mockTests[testIndex],
      ...(body as Partial<Test>),
      publicId: id as string, // publicId는 변경되지 않도록
    };

    mockTests[testIndex] = updatedTest;

    // missions도 업데이트
    if (body.missions) {
      mockMissions[id as string] = body.missions;
    }

    const testDetail: TestDetail = {
      ...updatedTest,
      missions: mockMissions[id as string] || [],
    };

    return HttpResponse.json(testDetail);
  }),
];
