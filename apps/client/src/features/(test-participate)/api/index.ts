import type { TestInfo, TestSession } from '../types';

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
export async function startTestParticipation(testId: string): Promise<{ participantId: string }> {
  const response = await fetch(`${API_BASE_URL}/participants`, {
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

  const data = await response.json();

  // 로컬스토리지에 participantId 저장
  localStorage.setItem('participantId', data.participantId);

  return data;
}

// 2. 미션 시작 (미션 수행 페이지 열기)
export async function startMission(
  missionId: string,
  participantId: string
): Promise<{ id: string }> {
  const response = await fetch(`${API_BASE_URL}/missionResult`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      missionId,
      participantsId: participantId, // 백엔드 스펙대로 participantsId
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to start mission');
  }

  return await response.json();
}

// 3. 녹화 종료 (녹화 종료 버튼 클릭)
export async function finishMissionRecording(missionResultId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/missionResult/${missionResultId}/finish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      endTime: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to finish mission recording');
  }
}

// 4. 미션 결과 제출 (다음 버튼 클릭)
export async function submitMissionResult(
  missionResultId: string,
  status: 'SUCCESS' | 'FAILED',
  feedback?: string
): Promise<void> {
  const body: { status: string; feedback?: string } = { status };
  if (feedback) {
    body.feedback = feedback;
  }

  const response = await fetch(`${API_BASE_URL}/missionResult/${missionResultId}`, {
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
export async function completeTestParticipation(
  participantId: string,
  overallFeedback: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/participants/${participantId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      status: 'complete',
      overallFeedback,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to complete test participation');
  }

  // 로컬스토리지에서 participantId 제거
  localStorage.removeItem('participantId');
}

// 6. 세션 복원 (페이지 새로고침 시 진행 상황 조회)
// TODO: 백엔드 API 준비 필요 - GET /participants/:participantId/progress
export async function getParticipantProgress(
  participantId: string
): Promise<TestSession | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/participants/${participantId}/progress`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch participant progress');
    }

    const data = await response.json();

    // 백엔드 응답을 TestSession 형태로 변환
    // 예상 응답 형태:
    // {
    //   participantId: string;
    //   status: 'in_progress' | 'complete';
    //   currentMissionIndex: number;
    //   missionResults: [{ missionPublicId, completed, feedback }];
    //   overallFeedback?: string;
    // }
    const session: TestSession = {
      currentStep:
        data.status === 'complete'
          ? 'complete'
          : data.currentMissionIndex === -1
            ? 'feedback'
            : 'mission',
      currentMissionIndex: Math.max(0, data.currentMissionIndex),
      missionResults: data.missionResults || [],
      overallFeedback: data.overallFeedback,
      participantId: data.participantId,
    };

    return session;
  } catch (error) {
    console.error('Error fetching participant progress:', error);
    return null;
  }
}
