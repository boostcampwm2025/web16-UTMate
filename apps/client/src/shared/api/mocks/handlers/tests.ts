import { http, HttpResponse } from 'msw';
import type { Test, TestType, User } from '@/features/(test-manage)/types';

// Mock 데이터
const mockUsers: User[] = [
  {
    id: 1,
    name: '문성',
    profileImageUrl: null,
  },
];

const mockTests: Test[] = [
  {
    id: 1,
    name: 'New maze 3',
    type: 'LIVE' as TestType,
    integrationUrl: 'https://notion.so',
    participants: 3,
    creator: mockUsers[0],
  },
  {
    id: 2,
    name: 'New maze 2',
    type: 'DRAFT' as TestType,
    integrationUrl: '',
    participants: 0,
    creator: mockUsers[0],
  },
  {
    id: 3,
    name: '셀프플레너',
    type: 'LIVE' as TestType,
    integrationUrl: '',
    participants: 1,
    creator: mockUsers[0],
  },
];

export const testsHandlers = [
  // GET /tests - 스터디(테스트) 목록 조회
  http.get('http://localhost:3000/tests', ({ request }) => {
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
  http.get('http://localhost:3000/tests/:id', ({ params }) => {
    const { id } = params;
    const test = mockTests.find((t) => t.id === Number(id));

    if (!test) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Test not found',
      });
    }

    return HttpResponse.json(test);
  }),

  // POST /tests - 테스트 생성
  http.post('http://localhost:3000/tests', async () => {
    const newTest: Test = {
      id: mockTests.length + 1,
      name: '새 테스트',
      type: 'DRAFT' as TestType,
      integrationUrl: '',
      participants: 0,
      creator: mockUsers[0],
    };

    mockTests.push(newTest);

    return HttpResponse.json(newTest, { status: 201 });
  }),

  // PUT /tests/:id - 테스트 수정
  http.put('http://localhost:3000/tests/:id', async ({ params, request }) => {
    const { id } = params;
    const testIndex = mockTests.findIndex((t) => t.id === Number(id));

    if (testIndex === -1) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Test not found',
      });
    }

    const body = await request.json();
    const updatedTest = {
      ...mockTests[testIndex],
      ...(body as Partial<Test>),
      id: Number(id), // ID는 변경되지 않도록
    };

    mockTests[testIndex] = updatedTest;

    return HttpResponse.json(updatedTest);
  }),
];
