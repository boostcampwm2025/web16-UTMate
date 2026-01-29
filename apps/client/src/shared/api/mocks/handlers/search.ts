import { http, HttpResponse } from 'msw';

import { SearchTestResponse, SearchTestResult } from '@/features/(test-search)/types';

const MOCK_TESTS: SearchTestResult[] = [
  {
    id: 'test-1',
    title: '초보자를 위한 금융 앱 사용성 테스트',
    description:
      '금융 앱을 처음 사용하는 분들을 대상으로, 회원가입부터 첫 이체까지의 과정을 테스트합니다. 여러분의 소중한 의견을 들려주세요.',
    url: 'https://finance-app.com',
    missionsCount: 5,
    totalTimeMinutes: 20,
    participantsCount: 42,
    tags: ['금융', '20대', '30대', '남성', '여성', 'IT'],
  },
  {
    id: 'test-2',
    title: '새로운 헬스케어 서비스 베타 테스터 모집',
    description:
      '집에서 간편하게 건강을 관리할 수 있는 새로운 헬스케어 서비스입니다. 운동 기록 기능과 식단 관리 기능을 중점적으로 테스트합니다.',
    url: 'https://health-care.co.kr',
    missionsCount: 3,
    totalTimeMinutes: 15,
    participantsCount: 15,
    tags: ['건강', '운동', '20대', '30대', '40대'],
  },
  {
    id: 'test-3',
    title: '반려동물 쇼핑몰 구매 경험 테스트',
    description:
      '강아지, 고양이 간식을 구매하는 과정에서 불편한 점은 없으셨나요? 반려동물 쇼핑몰의 리뉴얼된 UI를 체험해보세요.',
    url: 'https://pet-shop.com',
    missionsCount: 4,
    totalTimeMinutes: 10,
    participantsCount: 89,
    tags: ['반려동물', '쇼핑', '여성', '20대', '30대'],
  },
  {
    id: 'test-4',
    title: '글로벌 어학 학습 플랫폼 UX 리서치',
    description:
      '전 세계 언어를 배우는 즐거움! 새로운 어학 학습 앱의 학습 플로우를 테스트하고 더 나은 학습 경험을 만들어주세요.',
    url: 'https://lang-learn.io',
    missionsCount: 6,
    totalTimeMinutes: 30,
    participantsCount: 200,
    tags: ['외국어', '교육', '자기계발', '10대', '20대'],
  },
  {
    id: 'test-5',
    title: '직장인 생산성 향상 툴 기능 테스트',
    description:
      '업무 효율을 200% 높여주는 생산성 툴입니다. 프로젝트 관리 및 일정 공유 기능을 중점적으로 살펴봐주세요.',
    url: 'https://productivity-tool.net',
    missionsCount: 4,
    totalTimeMinutes: 25,
    participantsCount: 56,
    tags: ['생산성', '비즈니스', 'IT', '30대', '40대'],
  },
  {
    id: 'test-6',
    title: '최신 모바일 게임 CBT 참여자 모집',
    description:
      '화려한 그래픽과 타격감 넘치는 액션 RPG! 출시 전 밸런스 테스트에 참여하고 한정판 아이템을 받아가세요.',
    url: 'https://game-studio.com',
    missionsCount: 2,
    totalTimeMinutes: 40,
    participantsCount: 500,
    tags: ['게임', '10대', '20대', '남성'],
  },
  {
    id: 'test-7',
    title: '여행 계획 플래너 앱 사용성 평가',
    description:
      '복잡한 여행 계획, 이제 한 번에 해결하세요. 일정 짜기부터 예약까지 끊김 없는 경험을 제공하는지 확인해주세요.',
    url: 'https://travel-planner.app',
    missionsCount: 5,
    totalTimeMinutes: 15,
    participantsCount: 34,
    tags: ['여행', '20대', '30대', '여성'],
  },
  {
    id: 'test-8',
    title: 'AI 기반 사진 편집 앱 기능 테스트',
    description:
      '클릭 한 번으로 전문가처럼 보정해주는 AI 사진 편집 기능! 자연스러운 보정 결과가 나오는지 테스트해주세요.',
    url: 'https://ai-photo.io',
    missionsCount: 3,
    totalTimeMinutes: 10,
    participantsCount: 121,
    tags: ['사진', 'AI', '미디어', '10대', '20대'],
  },
  {
    id: 'test-9',
    title: '부동산 매물 검색 서비스 UI 개선',
    description:
      '원하는 조건의 집을 더 쉽고 빠르게 찾을 수 있도록 필터링 기능과 지도 UI를 개선했습니다. 사용성을 평가해주세요.',
    url: 'https://real-estate-search.com',
    missionsCount: 4,
    totalTimeMinutes: 20,
    participantsCount: 67,
    tags: ['부동산', '금융', '30대', '40대', '50대'],
  },
  {
    id: 'test-10',
    title: '나만의 인테리어 꾸미기 시뮬레이션',
    description:
      '가구를 미리 배치해보고 우리 집에 어울리는지 확인하세요. 3D 시뮬레이션 기능의 조작감을 테스트합니다.',
    url: 'https://interior-sim.com',
    missionsCount: 5,
    totalTimeMinutes: 35,
    participantsCount: 92,
    tags: ['인테리어', '쇼핑', '여성', '20대', '30대'],
  },
];

export const searchHandlers = [
  http.get('*/tests/search', ({ request }) => {
    const url = new URL(request.url);
    const gender = url.searchParams.get('gender');
    const age = url.searchParams.get('age');
    const interests = url.searchParams.getAll('interests');
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 5;

    let filteredTests = MOCK_TESTS;

    if (gender) {
      filteredTests = filteredTests.filter((test) => test.tags.includes(gender));
    }

    if (age) {
      filteredTests = filteredTests.filter((test) => test.tags.includes(age));
    }

    if (interests.length > 0) {
      filteredTests = filteredTests.filter((test) =>
        interests.some((interest) => test.tags.includes(interest)),
      );
    }

    const totalCount = filteredTests.length;
    const totalPage = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const paginatedTests = filteredTests.slice(startIndex, startIndex + limit);

    const mockResponse: SearchTestResponse = {
      tests: paginatedTests,
      totalPage,
    };

    return HttpResponse.json(mockResponse);
  }),
];
