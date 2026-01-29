export enum Interest {
  EDUCATION = '교육',
  LANGUAGES = '외국어',
  SELF_IMPROVEMENT = '자기계발',
  SCIENCE = '과학',
  READING = '독서',
  IT = 'IT',
  GAMING = '게임',
  PRODUCTIVITY = '생산성',
  BUSINESS = '비즈니스',
  AI = 'AI',
  MEDIA = '미디어',
  MOVIES = '영화',
  ANIMATION = '애니메이션',
  FASHION = '패션',
  BEAUTY = '뷰티',
  SHOPPING = '쇼핑',
  FINANCE = '금융',
  REAL_ESTATE = '부동산',
  STOCKS = '주식',
  MUSIC = '음악',
  INSTRUMENTS = '악기',
  TRAVEL = '여행',
  PHOTOGRAPHY = '사진',
  OUTDOORS = '아웃도어',
  SPORTS = '스포츠',
  HEALTH = '건강',
  FITNESS = '운동',
  COMMUNITY = '커뮤니티',
  SOCIAL = '소셜',
  PETS = '반려동물',
  PARENTING = '육아',
  INTERIOR = '인테리어',
}

export type Gender = '남성' | '여성';

export type AgeGroup = '10대' | '20대' | '30대' | '40대' | '50대' | '60대 이상';

export interface PersonaData {
  gender: Gender;
  ageGroup: AgeGroup;
  interests: Interest[];
  description?: string;
}
