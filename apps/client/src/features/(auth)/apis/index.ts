/**
 * GitHub OAuth 로그인 관련 API
 */


import { CLIENT_BASE_URL } from '@/shared/constants/api';
import { clientFetcher } from '@/shared/utils/fetcher/clientFetcher';

import type { User } from '../types';


/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  await clientFetcher<void>(`${CLIENT_BASE_URL}/auth/logout`, {
    method: 'POST',
  });
}

/**
 * 현재 로그인한 사용자 정보 가져오기
 */
export async function getCurrentUser(): Promise<User> {
  return clientFetcher<User>(`${CLIENT_BASE_URL}/users/me`);
}

/**
 * 회원 탈퇴
 */
export async function deleteUser(): Promise<void> {
  await clientFetcher<void>(`${CLIENT_BASE_URL}/users/me`, {
    method: 'DELETE',
  });
}
