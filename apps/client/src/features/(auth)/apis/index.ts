/**
 * GitHub OAuth 로그인 관련 API
 */

import type { User } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * GitHub OAuth 콜백 처리
 * GitHub에서 받은 code를 백엔드로 전송하여 사용자 정보와 토큰을 받아옴
 */
export async function handleGithubCallback(code: string): Promise<{ user: User; token: string }> {
  const response = await fetch(`${API_BASE_URL}/api/auth/github/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
    credentials: 'include', // 쿠키 포함
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'GitHub 로그인에 실패했습니다.');
  }

  return response.json();
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('로그아웃에 실패했습니다.');
  }

  // 로컬 스토리지 정리
  localStorage.removeItem('auth_token');
}

/**
 * 현재 로그인한 사용자 정보 가져오기
 */
export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('사용자 정보를 가져오는데 실패했습니다.');
  }

  return response.json();
}

/**
 * 회원 탈퇴
 */
export async function deleteUser(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('회원 탈퇴에 실패했습니다.');
  }

  // 로컬 스토리지 정리
  localStorage.removeItem('auth_token');
}
