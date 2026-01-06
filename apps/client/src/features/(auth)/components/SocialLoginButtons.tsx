import { Button } from '@/shared/components/ui/button';
import { GithubIcon } from '@/shared/components/icons/GithubIcon';

export default function SocialLoginButtons({
  handleGithubLogin,
}: {
  handleGithubLogin: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full"
      onClick={handleGithubLogin}
    >
      <GithubIcon className="mr-2 h-4 w-4" />
      GitHub로 로그인
    </Button>
  );
}
