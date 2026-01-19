import type { MissionProgress, ParticipantResponse, StartTestResponse, TestInfo } from '../types';

import { CLIENT_BASE_URL as API_BASE_URL } from '@/shared/constants/api';

// 테스트 정보 조회
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching test:', error);
    throw error;
  }
}

// 1. 테스트 시작 (시작 버튼 클릭)
// POST /tests/:testId/participants
// 응답: { participantId, missionResults: [{ id, missionId, status }] }
export async function startTestParticipation(testId: string): Promise<StartTestResponse> {
  const response = await fetch(`${API_BASE_URL}/tests/${testId}/participants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ testId }),
  });

  if (!response.ok) {
    throw new Error('Failed to start test participation');
  }

  const data: StartTestResponse = await response.json();

  // 로컬스토리지에 participantId 저장
  localStorage.setItem('participantId', data.participantId);

  return data;
}

// 2. 미션 시작 (미션 수행 페이지 열기) - 미션 결과 생성
// POST /missions/:missionPublicId/missionResult
export async function startMission(
  missionId: string,
  participantId: string,
): Promise<{ missionResultId: string }> {
  const response = await fetch(`${API_BASE_URL}/missions/${missionId}/missionResult`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(participantId),
  });

  if (!response.ok) {
    throw new Error('Failed to start mission');
  }

  return await response.json();
}

// 3. 녹화 업로드 (녹화 종료 버튼 클릭) - S3에 로그 파일 업로드
// POST /mission-results/:publicId/record
export async function uploadMissionRecording(missionResultId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/mission-results/${missionResultId}/record`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('녹화 업로드에 실패했습니다.');
  }
}

// 4. 미션 결과 제출 (다음 버튼 클릭)
// PATCH /mission-results/:publicId
export async function submitMissionResult(
  missionResultId: string,
  status: 'SUCCESS' | 'FAILED',
  feedback?: string,
): Promise<void> {
  const body: { status: string; feedback?: string } = { status };
  if (feedback) {
    body.feedback = feedback;
  }

  const response = await fetch(`${API_BASE_URL}/mission-results/${missionResultId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to submit mission result');
  }
}

// 5. 테스트 완료 (제출하기 버튼 클릭)
// PATCH /participants/:publicId
export async function completeTestParticipation(
  participantId: string,
  feedback?: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/participants/${participantId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      status: 'completed',
      feedback,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to complete test participation');
  }

  // 로컬스토리지에서 participantId 제거
  localStorage.removeItem('participantId');
}

// 6. 미션 진행 상황 조회 (이어하기 및 현재 미션 확인용)
// GET /participants/:publicId/mission-progress
export async function getMissionProgress(participantId: string): Promise<MissionProgress | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/participants/${participantId}/mission-progress`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch mission progress');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching mission progress:', error);
    return null;
  }
}

// 7. 참가자 정보 조회 (이어하기 진입 시)
// GET /participants/:publicId
// 응답: { status, missionResults: [{ id, missionId, status }] }
export async function getParticipant(participantId: string): Promise<ParticipantResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/participants/${participantId}`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        // 참가자가 없으면 로컬스토리지 삭제
        localStorage.removeItem('participantId');
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
