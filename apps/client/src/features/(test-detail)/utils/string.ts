// URL 정규화 함수
export const normalizeUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};
