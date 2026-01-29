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
  {
    id: 'test-11',
    title: 'IT/게임 자기계발 스터디 플랫폼',
    description:
      '게임 개발 및 IT 기술 학습을 위한 스터디 매칭 서비스입니다. 20대 남성 유저를 타겟으로 한 추천 알고리즘을 테스트합니다.',
    url: 'https://it-game-study.io',
    missionsCount: 3,
    totalTimeMinutes: 25,
    participantsCount: 150,
    tags: ['남성', '20대', '자기계발', 'IT', '게임'],
  },
  {
    id: 'test-12',
    title: '어린이 동화 오디오북 서비스',
    description:
      '아이들을 위한 동화 오디오북 서비스입니다. 부모님과 아이가 함께 사용하는 화면의 편의성을 테스트합니다.',
    url: 'https://kids-audiobook.com',
    missionsCount: 4,
    totalTimeMinutes: 20,
    participantsCount: 78,
    tags: ['육아', '교육', '독서', '30대', '40대', '여성'],
  },
  {
    id: 'test-13',
    title: '주식 투자 포트폴리오 관리 앱',
    description:
      '나만의 투자 포트폴리오를 관리하고 수익률을 분석하세요. 복잡한 차트를 얼마나 쉽게 이해할 수 있는지 확인합니다.',
    url: 'https://stock-portfolio.app',
    missionsCount: 5,
    totalTimeMinutes: 30,
    participantsCount: 110,
    tags: ['주식', '금융', '재테크', '20대', '30대', '40대', '남성'],
  },
  {
    id: 'test-14',
    title: '신선식품 새벽배송 마켓 컬리퍼',
    description:
      '내일 아침 문 앞까지 신선한 식재료가 도착합니다! 장바구니 담기부터 결제까지의 과정을 테스트해주세요.',
    url: 'https://market-early.com',
    missionsCount: 4,
    totalTimeMinutes: 15,
    participantsCount: 320,
    tags: ['쇼핑', '요리', '가사', '20대', '30대', '40대', '50대', '여성'],
  },
  {
    id: 'test-15',
    title: '중고 악기 거래 커뮤니티',
    description:
      '안전하고 편리한 중고 악기 거래를 위한 커뮤니티입니다. 판매 게시글 등록 과정을 중점적으로 테스트합니다.',
    url: 'https://music-market.com',
    missionsCount: 3,
    totalTimeMinutes: 20,
    participantsCount: 45,
    tags: ['음악', '악기', '쇼핑', '커뮤니티', '10대', '20대', '30대'],
  },
  {
    id: 'test-16',
    title: '나만의 캠핑장 예약 가이드',
    description:
      '전국의 숨겨진 캠핑 명소를 찾아 예약하세요. 검색 필터와 지도 기능의 편의성을 평가해주세요.',
    url: 'https://camping-guide.net',
    missionsCount: 5,
    totalTimeMinutes: 25,
    participantsCount: 88,
    tags: ['아웃도어', '여행', '캠핑', '30대', '40대', '남성'],
  },
  {
    id: 'test-17',
    title: '반려식물 관리 및 커뮤니티',
    description:
      '식물 집사들을 위한 관리 일지와 커뮤니티 기능. 식물 성장 기록을 남기는 과정을 테스트합니다.',
    url: 'https://plant-care.io',
    missionsCount: 3,
    totalTimeMinutes: 15,
    participantsCount: 130,
    tags: ['인테리어', '취미', '커뮤니티', '20대', '30대', '여성'],
  },
  {
    id: 'test-18',
    title: 'AI 퍼스널 컬러 진단 서비스',
    description:
      '사진 한 장으로 나의 퍼스널 컬러를 찾아보세요. 진단 결과에 따른 화장품 추천 기능을 테스트합니다.',
    url: 'https://personal-color.ai',
    missionsCount: 2,
    totalTimeMinutes: 10,
    participantsCount: 450,
    tags: ['뷰티', '패션', 'AI', '10대', '20대', '여성'],
  },
  {
    id: 'test-19',
    title: '동네 기반 독서 모임 모집 앱',
    description:
      '우리 동네 독서 모임을 찾고 참여해보세요. 모임 개설 및 참여 신청 프로세스를 확인합니다.',
    url: 'https://local-bookclub.com',
    missionsCount: 3,
    totalTimeMinutes: 20,
    participantsCount: 60,
    tags: ['독서', '커뮤니티', '소셜', '20대', '30대', '40대'],
  },
  {
    id: 'test-20',
    title: '과학 뉴스 및 퀴즈 앱',
    description:
      '매일 새로운 과학 뉴스를 읽고 퀴즈를 풀어보세요. 콘텐츠 가독성과 퀴즈 인터랙션을 테스트합니다.',
    url: 'https://science-daily.app',
    missionsCount: 4,
    totalTimeMinutes: 15,
    participantsCount: 95,
    tags: ['과학', '교육', '뉴스', '10대', '20대', '남성'],
  },
  {
    id: 'test-21',
    title: '영화/드라마 리뷰 및 추천 서비스',
    description:
      '내가 본 영화와 드라마를 기록하고 취향에 맞는 작품을 추천받으세요. 별점 평가 및 리뷰 작성 기능을 테스트합니다.',
    url: 'https://movie-review.net',
    missionsCount: 3,
    totalTimeMinutes: 15,
    participantsCount: 210,
    tags: ['영화', '드라마', '미디어', '20대', '30대'],
  },
  {
    id: 'test-22',
    title: '홈트레이닝 코칭 및 챌린지',
    description:
      '전문 트레이너와 함께하는 홈트레이닝! 운동 챌린지 참여 및 인증 과정을 테스트합니다.',
    url: 'https://home-train.coach',
    missionsCount: 5,
    totalTimeMinutes: 30,
    participantsCount: 180,
    tags: ['운동', '건강', '자기계발', '20대', '30대', '여성'],
  },
  {
    id: 'test-23',
    title: '친환경 제품 펀딩 플랫폼',
    description:
      '지구를 위한 착한 소비, 친환경 제품 펀딩에 참여하세요. 펀딩 상세 페이지 정보 전달력을 확인합니다.',
    url: 'https://eco-funding.org',
    missionsCount: 4,
    totalTimeMinutes: 20,
    participantsCount: 125,
    tags: ['쇼핑', '사회', '환경', '20대', '30대'],
  },
  {
    id: 'test-24',
    title: '가상화폐 거래소 모의투자',
    description:
      '실전과 똑같은 환경에서 가상화폐 투자를 연습해보세요. 매수/매도 주문 기능의 사용성을 테스트합니다.',
    url: 'https://crypto-sim.com',
    missionsCount: 3,
    totalTimeMinutes: 25,
    participantsCount: 300,
    tags: ['금융', '주식', 'IT', '20대', '30대', '남성'],
  },
  {
    id: 'test-25',
    title: '반려견 산책 친구 찾기',
    description:
      '우리 강아지의 산책 친구를 찾아주세요. 위치 기반 매칭 및 채팅 기능을 중점적으로 테스트합니다.',
    url: 'https://dog-walk-friend.app',
    missionsCount: 3,
    totalTimeMinutes: 20,
    participantsCount: 82,
    tags: ['반려동물', '커뮤니티', '소셜', '20대', '30대'],
  },
  {
    id: 'test-26',
    title: '애니메이션 스트리밍 서비스',
    description:
      '최신 애니메이션을 가장 빠르게 만나보세요. 플레이어 기능 및 자막 설정 편의성을 평가합니다.',
    url: 'https://ani-stream.tv',
    missionsCount: 4,
    totalTimeMinutes: 40,
    participantsCount: 550,
    tags: ['애니메이션', '미디어', '10대', '20대'],
  },
  {
    id: 'test-27',
    title: '명품 의류 렌탈 서비스',
    description:
      '특별한 날을 위한 명품 의류 렌탈. 상품 검색부터 대여 신청, 반납 신청까지의 과정을 테스트해주세요.',
    url: 'https://luxury-rental.com',
    missionsCount: 5,
    totalTimeMinutes: 30,
    participantsCount: 65,
    tags: ['패션', '쇼핑', '20대', '30대', '여성'],
  },
  {
    id: 'test-28',
    title: '전시회/공연 예매 티켓팅',
    description:
      '보고 싶은 전시회와 공연 티켓을 예매하세요. 좌석 선택 UI의 편리함을 중점적으로 확인합니다.',
    url: 'https://ticket-booking.io',
    missionsCount: 3,
    totalTimeMinutes: 15,
    participantsCount: 140,
    tags: ['문화', '예술', '20대', '30대'],
  },
  {
    id: 'test-29',
    title: '직장인 점심 메뉴 추천 룰렛',
    description:
      '오늘 점심 뭐 먹지? 고민될 때 사용하는 룰렛 앱입니다. 룰렛 조작감과 결과 공유 기능을 테스트합니다.',
    url: 'https://lunch-roulette.fun',
    missionsCount: 2,
    totalTimeMinutes: 5,
    participantsCount: 400,
    tags: ['음식', '재미', '직장인', '20대', '30대'],
  },
  {
    id: 'test-30',
    title: '시니어 헬스케어 및 돌봄 매칭',
    description:
      '어르신을 위한 헬스케어 정보와 돌봄 서비스를 매칭해드립니다. 큰 글씨 모드와 간편한 UI를 테스트해주세요.',
    url: 'https://senior-care.net',
    missionsCount: 4,
    totalTimeMinutes: 25,
    participantsCount: 40,
    tags: ['건강', '복지', '50대', '60대 이상', '가족'],
  },
];

const GENDER_MAP: Record<string, string> = {
  MALE: '남성',
  FEMALE: '여성',
};

const AGE_MAP: Record<string, string> = {
  '10': '10대',
  '20': '20대',
  '30': '30대',
  '40': '40대',
  '50': '50대',
  '60+': '60대', // 데이터에는 '60대 이상'이라고 되어 있을 수 있으므로 부분 매칭 고려 필요하지만, 일단 단순 매핑
};

export const searchHandlers = [
  http.get('*/tests/search', ({ request }) => {
    const url = new URL(request.url);
    const gender = url.searchParams.get('gender');
    const age = url.searchParams.get('age');
    const interests = url.searchParams.getAll('interests');
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 5;

    let filteredTests = MOCK_TESTS;

    if (gender && GENDER_MAP[gender]) {
      filteredTests = filteredTests.filter((test) => test.tags.includes(GENDER_MAP[gender]));
    }

    if (age) {
      // Handle "10", "20", etc.
      if (AGE_MAP[age]) {
        filteredTests = filteredTests.filter((test) => test.tags.includes(AGE_MAP[age]));
      }
      // Handle direct match attempt (fallback)
      else if (age !== 'ALL') {
        filteredTests = filteredTests.filter((test) => test.tags.some((tag) => tag.includes(age)));
      }
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
