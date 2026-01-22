const RANDOM_ADJECTIVES = [
  '날쌘',
  '똑똑한',
  '용감한',
  '귀여운',
  '빠른',
  '부지런한',
  '차분한',
  '활발한',
  '친절한',
  '명랑한',
  '신중한',
  '깜찍한',
  '당당한',
  '솔직한',
  '성실한',
  '열정적인',
  '창의적인',
];

const RANDOM_ANIMALS = [
  '다람쥐',
  '토끼',
  '고양이',
  '강아지',
  '햄스터',
  '여우',
  '곰',
  '펭귄',
  '토끼',
  '사자',
  '호랑이',
  '늑대',
  '오리',
  '올빼미',
  '참새',
  '부엉이',
  '물고기',
  '사슴',
];

/**
 * 문자열을 간단한 해시값으로 변환합니다.
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32bit 정수로 변환
  }
  return Math.abs(hash);
}

/**
 * id 문자열을 기반으로 일관된 닉네임을 생성합니다.
 * 형식: "형용사 동물 두자리숫자"
 * 예: "날쌘 다람쥐 88"
 */
export function generateNickname(id: string): string {
  const hash = simpleHash(id);
  
  const adjectiveIndex = hash % RANDOM_ADJECTIVES.length;
  const animalIndex = Math.floor(hash / RANDOM_ADJECTIVES.length) % RANDOM_ANIMALS.length;
  const number = (hash % 100).toString().padStart(2, '0');
  
  return `${RANDOM_ADJECTIVES[adjectiveIndex]} ${RANDOM_ANIMALS[animalIndex]} ${number}`;
}
