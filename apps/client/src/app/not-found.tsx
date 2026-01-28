import { Signpost } from 'lucide-react';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6">
      <div className="container flex flex-col-reverse items-center justify-center gap-12 md:flex-row md:gap-24">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="text-primary text-9xl font-black">404</div>
          <h1 className="mt-4 text-3xl font-bold text-gray-800 md:text-4xl">Page not found</h1>
          <p className="text-muted-foreground mt-4 text-lg">
            요청하신 페이지가 존재하지 않거나 이동했을 수 있습니다.
            <br />
            URL을 다시 확인해주세요.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="group h-12 px-8 text-lg">
              <Link href="/">
                <Signpost className="mr-2 h-4 w-4 transition-transform duration-800 group-hover:rotate-y-180" />
                홈으로 돌아가기
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative w-full max-w-[300px] md:max-w-[500px]">
          <img src="/not-found.webp" alt="404 Illustration" />
        </div>
      </div>
    </div>
  );
}
