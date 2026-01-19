import type { ParticipantResponse, StartTestResponse, TestInfo } from '../types';

import { CLIENT_BASE_URL as API_BASE_URL } from '@/shared/constants/api';

/**
 * 테스트 정보 조회
 * GET /tests/:testId
 */
export async function getTestForParticipation(testId: string): Promise<TestInfo | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/tests/${testId}`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch test');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching test:', error);
    throw error;
  }
}

/**
 * 테스트 시작 (참가자 생성 + 모든 미션 결과 PENDING 상태로 생성)
 * POST /tests/:testId/participants
 */
export async function startTestParticipation(testId: string): Promise<StartTestResponse> {
  const response = await fetch(`${API_BASE_URL}/tests/${testId}/participants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ testId }),
  });

  if (!response.ok) {
    throw new Error('Failed to start test participation');
  }

  return await response.json();
}

/**
 * 녹화 업로드 (녹화 종료 시 S3에 로그 파일 업로드)
 * POST /mission-results/:missionResultId/record
 */
export async function uploadMissionRecording(missionResultId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/mission-results/${missionResultId}/record`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('녹화 업로드에 실패했습니다.');
  }
}

/**
 * 미션 결과 제출 (다음 버튼 클릭 시)
 * PATCH /mission-results/:missionResultId
 */
export async function submitMissionResult(
  missionResultId: string,
  status: 'SUCCESS' | 'FAILED',
  feedback?: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/mission-results/${missionResultId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status, feedback }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit mission result');
  }
}

/**
 * 테스트 완료 (전체 피드백 제출 시)
 * PATCH /participants/:participantId
 */
export async function completeTestParticipation(participantId: string, feedback?: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/participants/${participantId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status: 'completed', feedback }),
  });

  if (!response.ok) {
    throw new Error('Failed to complete test participation');
  }
}

/**
 * 참가자 정보 조회 (이어하기 진입 시 상태 확인용)
 * GET /participants/:participantId
 */
export async function getParticipant(participantId: string): Promise<ParticipantResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/participants/${participantId}`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch participant');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching participant:', error);
    return null;
  }
}
