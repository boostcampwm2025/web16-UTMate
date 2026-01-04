import type { eventWithTime } from '@rrweb/types';

import type { SimpleMissionResult } from '../types';

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

export const getMissionResultLogs = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch mission result logs');
  }
  console.log('fetched logs from url:', url);

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
