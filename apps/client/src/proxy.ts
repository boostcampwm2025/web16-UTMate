import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  // /test 경로에서만 동작
  if (!request.nextUrl.pathname.startsWith('/test')) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // 기존 쿠키 확인
  const existingSessionId = request.cookies.get('session_id');

  if (!existingSessionId) {
    // TODO: 실제로는 NestJS API 호출해서 세션 ID 발급받아야 함
    // 임시로 UUID 생성
    const sessionId = `tester-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    response.cookies.set('session_id', sessionId, {
      httpOnly: false, // SDK가 읽을 수 있어야 함
      secure: false, // 개발 환경에서는 false
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1일
      path: '/',
    });
  }

  return response;
}

export const config = {
  matcher: '/test/:path*',
};
