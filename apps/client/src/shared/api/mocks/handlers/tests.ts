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
  http.get('http://localhost:3000/tests?scope=me', () => {
    return HttpResponse.json({
      tests: mockTests,
      total: mockTests.length,
    });
  }),
];
