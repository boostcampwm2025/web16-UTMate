import { CLIENT_BASE_URL } from '@/shared/constants/api';
import { clientFetcher } from '@/shared/utils/fetcher/clientFetcher';

import type { User, PersonaData } from '../types';

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

/**
 * 페르소나 생성
 */
export async function createPersona(persona: PersonaData): Promise<void> {
  await clientFetcher<void>(`${CLIENT_BASE_URL}/users/persona`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(persona),
  });
}

/**
 * 페르소나 수정
 */
export async function updatePersona(persona: PersonaData): Promise<void> {
  await clientFetcher<void>(`${CLIENT_BASE_URL}/users/persona`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(persona),
  });
}

/**
 * 페르소나 저장 (생성 또는 수정 자동 판단)
 */
export async function savePersona(persona: PersonaData): Promise<void> {
  // 먼저 GET으로 존재 여부 확인
  const existing = await getPersona();

  if (existing) {
    // 이미 존재하면 PUT으로 수정
    await updatePersona(persona);
  } else {
    // 없으면 POST로 생성
    await createPersona(persona);
  }
}

/**
 * 페르소나 조회
 */
export async function getPersona(): Promise<PersonaData | null> {
  try {
    return await clientFetcher<PersonaData>(`${CLIENT_BASE_URL}/users/persona`);
  } catch (error) {
    // 페르소나가 없으면 null 반환
    return null;
  }
}
