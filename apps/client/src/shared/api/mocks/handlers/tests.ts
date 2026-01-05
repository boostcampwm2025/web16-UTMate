import { http, HttpResponse } from 'msw';
import type { Test, TestType, User } from '@/features/(test-manage)/types';

// Mock 데이터
const mockUsers: User[] = [
  {
    id: 1,
    name: '김철수',
    profileImageUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: '이영희',
    profileImageUrl: 'https://i.pravatar.cc/150?img=2',
  },
];

const mockTests: Test[] = [
  {
    id: 1,
    name: '회원가입 플로우 개선 테스트',
    type: 'LIVE' as TestType,
    integrationUrl: 'https://example.com/signup',
    participants: 24,
    creator: mockUsers[0],
  },
  {
    id: 2,
    name: '상품 검색 사용성 테스트',
    type: 'LIVE' as TestType,
    integrationUrl: 'https://example.com/search',
    participants: 18,
    creator: mockUsers[1],
  },
  {
    id: 3,
    name: '결제 프로세스 UX 검증',
    type: 'DRAFT' as TestType,
    integrationUrl: 'https://example.com/checkout',
    participants: 0,
    creator: mockUsers[0],
  },
  {
    id: 4,
    name: '대시보드 레이아웃 테스트',
    type: 'COMPLETED' as TestType,
    integrationUrl: 'https://example.com/dashboard',
    participants: 45,
    creator: mockUsers[1],
  },
  {
    id: 5,
    name: '모바일 네비게이션 개선',
    type: 'LIVE' as TestType,
    integrationUrl: 'https://example.com/mobile',
    participants: 12,
    creator: mockUsers[0],
  },
];

export const testsHandlers = [
  // GET /tests - 스터디(테스트) 목록 조회
  http.get('http://localhost:3000/tests', () => {
    return HttpResponse.json({
      tests: mockTests,
      total: mockTests.length,
    });
  }),
];
