import type { SimpleMissionResult } from '@/types/dashboard';
import type { eventWithTime } from '@rrweb/types';

const BASE_URL = 'http://localhost:3000';

export const getTestResult = async (testid: string): Promise<SimpleMissionResult[]> => {
  // TODO: 현재 임시 API이므로 나중에 API로 대체해야 합니다.
  const response = await fetch(`${BASE_URL}/mission-results`);
  if (!response.ok) {
    throw new Error('Failed to fetch test results');
  }
  return response.json();
};

export const getMissionResult = async (testid: string, missionResultId: string) => {
  // TODO: 현재 임시 API이므로 나중에 API로 대체해야 합니다.
  const response = await fetch(`${BASE_URL}/mission-results/${missionResultId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch mission result');
  }
  return response.json();
};

export const getMissionResultLogs = async (missionId: string, sessionId: string) => {
  const response = await fetch(
    `${BASE_URL}/storage/replay_log/missions/${missionId}/${sessionId}.log.jsonl`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch mission result logs');
  }

  // .jsonl 파일은 각 줄이 하나의 JSON 객체인 형식이므로 이에 맞게 파싱
  const text = await response.text();
  const lines = text
    .split('\n')
    .filter((line) => line.trim() !== '') // 빈 줄 제거
    .map((line) => JSON.parse(line)); // 각 줄을 JSON으로 파싱

  return lines as eventWithTime[];
};
