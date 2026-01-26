export const formatDistanceToNow = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();

  // 단위별 차이 계산
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const rtf = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' });

  // 1. 1분 미만 (60초 미만)
  if (diffInSeconds < 60) return '방금 전';

  // 2. 1시간 미만 (60분 미만)
  if (diffInMinutes < 60) return rtf.format(-diffInMinutes, 'minute');

  // 3. 하루 미만 (24시간 미만)
  if (diffInHours < 24) return rtf.format(-diffInHours, 'hour');

  // 4. 7일 미만
  if (diffInDays < 7) return rtf.format(-diffInDays, 'day');

  // 5. 30일 미만 (주 단위)
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return rtf.format(-weeks, 'week');
  }

  // 6. 1년 미만 (월 단위)
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return rtf.format(-months, 'month');
  }

  // 7. 1년 이상 (년 단위)
  const years = Math.floor(diffInDays / 365);
  return rtf.format(-years, 'year');
};
