import type { eventWithTime } from '@rrweb/types';

import type { ParticipantResult, ParticipantMissionResult, SimpleMissionResult, MainFeedback, MissionResultWithParticipant } from '../types';
import { CLIENT_BASE_URL } from '@/shared/constants/api';
import type { ApiErrorResponse } from '@/shared/types/api';
import type { TestSummary } from '../types';

//TODO : 기존 MVP 에서 사용하던 API 호출 함수, 추후 제거
export const getTestResult = async (testid: string): Promise<SimpleMissionResult[]> => {
  // TODO: 현재 임시 API이므로 나중에 API로 대체해야 합니다.
  const response = await fetch(`${CLIENT_BASE_URL}/mission-results`);
  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '테스트 결과를 불러오는데 실패했습니다.');
  }
  return response.json();
};



export const getMissionResult = async (testid: string, missionResultId: string) => {
  // TODO: 현재 임시 API이므로 나중에 API로 대체해야 합니다.
  const response = await fetch(`${CLIENT_BASE_URL}/mission-results/${missionResultId}`, {
    credentials: 'include',
  });
  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '미션 결과를 불러오는데 실패했습니다.');
  }
  return response.json();
};

export const getMissionResultLogs = async (url: string) => {
  const response = await fetch(url, {
    credentials: 'include',
  });
  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '미션 결과 로그를 불러오는데 실패했습니다.');
  }

  try {
    const text = await response.text();

    const lines = text
      .split('\n')
      .filter((line) => line.trim() !== '') // 빈 줄 제거
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch (e) {
          console.warn(line);
          // 뭉쳐진 JSON 처리 시도 (예: {"a":1}{"b":2} -> {"a":1})
          // 정규식 등으로 분리하거나, 일단은 무시하고 넘어감
          return null;
        }
      });

    return lines as eventWithTime[];
  } catch (error) {
    console.error(error);
  }
};

// 새 대시보드 페이지에서 사용되는 코드
export const getTestSummary = async (testId: string): Promise<TestSummary> => {
  const response = await fetch(`${CLIENT_BASE_URL}/tests/${testId}/result`, {
    credentials: 'include',
  });
  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '테스트 요약 정보를 불러오는데 실패했습니다.');
  }
  return response.json();
};

export const getTestParticipantsResults = async (testId: string): Promise<ParticipantResult[]> => {
  const response = await fetch(`${CLIENT_BASE_URL}/tests/${testId}/result/participants`, {
    credentials: 'include',
  });
  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '참여자 결과 정보를 불러오는데 실패했습니다.');
  }
  return response.json();
};

export const getTestMainFeedback = async (testId: string): Promise<MainFeedback[]> => {
  const response = await fetch(`${CLIENT_BASE_URL}/tests/${testId}/result/mainfeedback`, {
    credentials: 'include',
  });
  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '주요 피드백 정보를 불러오는데 실패했습니다.');
  }
  return response.json();
};

// GET /missions/:missionId/result - 특정 미션의 결과 조회
export const getTestMissionsResultById = async (missionId: number): Promise<MissionResultWithParticipant[]> => {
  const response = await fetch(`${CLIENT_BASE_URL}/missions/${missionId}/result`, {
    credentials: 'include',
  });
  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '미션 결과를 불러오는데 실패했습니다.');
  }
  return response.json();
};
