import { NotFound } from '@/shared/components/NotFound';

export default function TestNotFound() {
  return (
    <NotFound
      title="테스트를 찾을 수 없습니다"
      description="요청하신 테스트가 존재하지 않거나 삭제되었습니다."
      href="/"
      hrefText="홈으로 돌아가기"
    />
  );
}
