/**
 * 인증 관련 타입 정의
 */

/**
 * 사용자 정보 (백엔드 UserSummaryDto와 일치)
 */
export interface User {
  publicId: string;
  username: string;
  avatarUrl: string;
  email?: string;
}

/**
 * GitHub OAuth 로그인 응답
 */
export interface GithubLoginResponse {
  user: User;
  token: string;
}

// Export persona types
export * from './persona';
