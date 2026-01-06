import SocialLoginButtons from './SocialLoginButtons';

export function LoginForm() {
  const handleGithubLogin = () => {
    // GitHub OAuth2 로그인 처리
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/callback/github`;

    // GitHub OAuth2 인증 URL로 리다이렉트
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user user:email`;
  };

  return (
    <div className="w-full space-y-6">
      <SocialLoginButtons handleGithubLogin={handleGithubLogin} />
    </div>
  );
}
