import { NextResponse, NextRequest } from 'next/server';

import { getCurrentUseronServer } from '@/features/(auth)/apis/server';
import type { User } from '@/features/(auth)/types';

export async function proxy(request: NextRequest) {
  let user: User | null = null;
  try {
    user = await getCurrentUseronServer();
  } catch (error) {
    user = null;
  }

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  //해당 경로에 접근할 때만 프록시가 실행됨
  matcher: ['/workspace', '/tests/:path*', '/profile'], // `/participate/:testId`는 제외
};
