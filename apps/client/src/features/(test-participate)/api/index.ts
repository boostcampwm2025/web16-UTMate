import type { ParticipantResponse, StartTestResponse, TestInfo } from '../types';

import { CLIENT_BASE_URL as API_BASE_URL } from '@/shared/constants/api';
import { clientFetcher } from '@/shared/utils/fetcher/clientFetcher';

/**
 * 테스트 정보 조회
 * GET /tests/:testId
 */
export async function getTestForParticipation(testId: string): Promise<TestInfo | null> {
  try {
    return await clientFetcher<TestInfo>(`${API_BASE_URL}/tests/${testId}`, {
      cache: 'no-store',
    });
  } catch (error: any) {
    // 404는 null 반환
    if (error.statusCode === 404) {
      return null;
    }
    console.error('Error fetching test:', error);
    throw error;
  }
}

/**
 * 테스트 시작 (참가자 생성 + 모든 미션 결과 PENDING 상태로 생성)
 * POST /tests/:testId/participants
 */
export async function startTestParticipation(testId: string): Promise<StartTestResponse> {
  return await clientFetcher<StartTestResponse>(`${API_BASE_URL}/tests/${testId}/participants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ testId }),
  });
}

/**
 * 미션 시작 (PENDING → IN_PROGRESS 상태 전이)
 * PATCH /mission-results/:missionResultId
 */
export async function startMission(missionResultId: string): Promise<void> {
  await clientFetcher<void>(`${API_BASE_URL}/mission-results/${missionResultId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'IN_PROGRESS' }),
  });
}

/**
 * 녹화 업로드 (녹화 종료 시 S3에 로그 파일 업로드)
 * POST /mission-results/:missionResultId/record
 */
export async function uploadMissionRecording(missionResultId: string): Promise<void> {
  await clientFetcher<void>(`${API_BASE_URL}/mission-results/${missionResultId}/record`, {
    method: 'POST',
  });
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
  await clientFetcher<void>(`${API_BASE_URL}/mission-results/${missionResultId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, feedback }),
  });
}

/**
 * 테스트 완료 (전체 피드백 제출 시)
 * PATCH /participants/:participantId
 */
export async function completeTestParticipation(participantId: string, feedback?: string): Promise<void> {
  await clientFetcher<void>(`${API_BASE_URL}/participants/${participantId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'COMPLETED', feedback }),
  });
}

/**
 * 참가자 정보 조회 (이어하기 진입 시 상태 확인용)
 * GET /participants/:participantId
 */
export async function getParticipant(participantId: string): Promise<ParticipantResponse | null> {
  try {
    return await clientFetcher<ParticipantResponse>(`${API_BASE_URL}/participants/${participantId}`, {
      cache: 'no-store',
    });
  } catch (error: any) {
    // 404는 null 반환
    if (error.statusCode === 404) {
      return null;
    }
    console.error('Error fetching participant:', error);
    return null;
  }
}
