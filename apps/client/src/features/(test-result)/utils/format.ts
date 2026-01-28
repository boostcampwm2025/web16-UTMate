export const formatTimestamp = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatRelativeTime = (timestamp: number, startTime: number): string => {
  const diffMs = timestamp - startTime;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffSeconds < 60) {
    return `${diffSeconds}초`;
  } else if (diffMinutes < 60) {
    const remainingSeconds = diffSeconds % 60;
    return remainingSeconds > 0 ? `${diffMinutes}분 ${remainingSeconds}초` : `${diffMinutes}분`;
  } else {
    const remainingMinutes = diffMinutes % 60;
    const remainingSeconds = diffSeconds % 60;
    if (remainingMinutes > 0 && remainingSeconds > 0) {
      return `${diffHours}시간 ${remainingMinutes}분 ${remainingSeconds}초`;
    } else if (remainingMinutes > 0) {
      return `${diffHours}시간 ${remainingMinutes}분`;
    } else {
      return `${diffHours}시간`;
    }
  }
};

export const formatDuration = (minutes: number | undefined | null): string => {
  if (minutes == null || isNaN(minutes)) return '-';
  if (minutes < 60) return `${Math.round(minutes)}분`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
};