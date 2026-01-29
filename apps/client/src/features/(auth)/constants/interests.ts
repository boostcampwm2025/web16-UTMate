import { Interest } from '../types/persona';

/**
 * 관심사 옵션 목록
 */
export const INTEREST_OPTIONS: Array<{ key: Interest; label: string }> = [
  { key: Interest.EDUCATION, label: '교육' },
  { key: Interest.LANGUAGES, label: '외국어' },
  { key: Interest.SELF_IMPROVEMENT, label: '자기계발' },
  { key: Interest.SCIENCE, label: '과학' },
  { key: Interest.READING, label: '독서' },
  { key: Interest.IT, label: 'IT' },
  { key: Interest.GAMING, label: '게임' },
  { key: Interest.PRODUCTIVITY, label: '생산성' },
  { key: Interest.BUSINESS, label: '비즈니스' },
  { key: Interest.AI, label: 'AI' },
  { key: Interest.MEDIA, label: '미디어' },
  { key: Interest.MOVIES, label: '영화' },
  { key: Interest.ANIMATION, label: '애니메이션' },
  { key: Interest.FASHION, label: '패션' },
  { key: Interest.BEAUTY, label: '뷰티' },
  { key: Interest.SHOPPING, label: '쇼핑' },
  { key: Interest.FINANCE, label: '금융' },
  { key: Interest.REAL_ESTATE, label: '부동산' },
  { key: Interest.STOCKS, label: '주식' },
  { key: Interest.MUSIC, label: '음악' },
  { key: Interest.INSTRUMENTS, label: '악기' },
  { key: Interest.TRAVEL, label: '여행' },
  { key: Interest.PHOTOGRAPHY, label: '사진' },
  { key: Interest.OUTDOORS, label: '아웃도어' },
  { key: Interest.SPORTS, label: '스포츠' },
  { key: Interest.HEALTH, label: '건강' },
  { key: Interest.FITNESS, label: '운동' },
  { key: Interest.COMMUNITY, label: '커뮤니티' },
  { key: Interest.SOCIAL, label: '소셜' },
  { key: Interest.PETS, label: '반려동물' },
  { key: Interest.PARENTING, label: '육아' },
  { key: Interest.INTERIOR, label: '인테리어' },
];

/**
 * 성별 옵션
 */
export const GENDER_OPTIONS = [
  { value: '남성' as const, label: '남성' },
  { value: '여성' as const, label: '여성' },
];

/**
 * 연령대 옵션
 */
export const AGE_GROUP_OPTIONS = [
  { value: '10대' as const, label: '10대' },
  { value: '20대' as const, label: '20대' },
  { value: '30대' as const, label: '30대' },
  { value: '40대' as const, label: '40대' },
  { value: '50대' as const, label: '50대' },
  { value: '60대 이상' as const, label: '60대 이상' },
];
