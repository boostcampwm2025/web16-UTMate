/**
 * GitHub OAuth 로그인 관련 API
 */

import type { User } from '../types';
import { CLIENT_BASE_URL } from '@/shared/constants/api';


/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  const response = await fetch(`${CLIENT_BASE_URL}/auth/logout`, {
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
  const response = await fetch(`${CLIENT_BASE_URL}/users/me`, {
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
  const response = await fetch(`${CLIENT_BASE_URL}/users/me`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('회원 탈퇴에 실패했습니다.');
  }

  // 로컬 스토리지 정리
  localStorage.removeItem('auth_token');
}
