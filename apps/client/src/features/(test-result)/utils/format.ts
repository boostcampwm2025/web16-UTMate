export const formatTimestamp = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatRelativeTime = (timestamp: number, startTime: number) => {
    const diff = timestamp - startTime;
    const totalSeconds = Math.floor(diff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * 날짜 문자열을 상대 시간 표현으로 변환합니다.
 * 예: "오늘", "1일전", "2주전", "3개월전", "1년전"
 */
export const formatRelativeDate = (dateString?: string): string => {
  if (!dateString) return '시간 정보 없음';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return '오늘';
  if (diffInDays === 1) return '1일전';
  if (diffInDays < 7) return `${diffInDays}일전`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주전`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}개월전`;
  return `${Math.floor(diffInDays / 365)}년전`;
};