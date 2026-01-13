// 클라이언트(브라우저)에서 사용하는 API URL
// 개발: http://localhost:8080/api
// 배포: http://utmate.me/api
export const CLIENT_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// 서버 사이드에서 사용하는 API URL (SSR)
// 개발: http://localhost:8080/api
// 배포: http://server:8080/api (내부 통신)
export const SERVER_BASE_URL =
  process.env.INTERNAL_API_URL || 'http://localhost:8080/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public code: number,
  ) {
    super(message);
  }
}
