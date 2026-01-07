import SocialLoginButtons from './SocialLoginButtons';

/**
 * LoginForm - GitHub OAuth 로그인
 *
 * 백엔드 API로 리다이렉트만 수행
 * - 프론트: localhost:3000/login에서 버튼 클릭 시 백엔드 API로 이동
 * - 백엔드: localhost:8080/api/auth/github로 GET 요청
 * - 백엔드에서 GitHub OAuth 처리 후 쿠키 설정하고 프론트로 리다이렉트
 */
export function LoginForm() {
  return (
    <div className="w-full space-y-6">
      <SocialLoginButtons />
    </div>
  );
}
