import { Button } from '@/shared/components/ui/button';
import { GithubIcon } from '@/shared/components/icons/GithubIcon';
import { CLIENT_BASE_URL } from '@/shared/constants/api';

/**
 * SocialLoginButtons - GitHub OAuth 로그인 버튼
 *
 * 백엔드 API로 a 태그 형식으로 리다이렉트
 * - GET localhost:8080/api/auth/github
 * - 백엔드에서 모든 OAuth 처리 (GitHub 인증 → 콜백 처리 → 쿠키 설정)
 * - 백엔드가 프론트 URL로 리다이렉트하면서 쿠키 전달
 */
export default function SocialLoginButtons() {
  // 환경변수에서 백엔드 API URL 가져오기

  return (
    <Button asChild size="lg" variant="default" className="h-12 w-full">
      <a href={`${CLIENT_BASE_URL}/auth/github`}>
        <GithubIcon className="mr-2 h-5 w-5" />
        GitHub로 로그인
      </a>
    </Button>
  );
}
