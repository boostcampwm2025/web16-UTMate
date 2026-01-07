/**
 * 인증 관련 타입 정의
 */

/**
 * 사용자 정보
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  githubId: string;
  createdAt: string;
}

/**
 * GitHub OAuth 로그인 응답
 */
export interface GithubLoginResponse {
  user: User;
  token: string;
}
