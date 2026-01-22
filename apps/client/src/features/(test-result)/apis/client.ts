import { CLIENT_BASE_URL } from '@/shared/constants/api';
import { clientFetcher } from '@/shared/utils/fetcher/clientFetcher';

import type {
  MainFeedback,
  MissionResultWithParticipant,
  TestResultSummary,
  ParticipantResult,
  MissionResultDetail,
} from '../types';

export const getTestResultSummary = async (testId: string): Promise<TestResultSummary> => {
  return clientFetcher<TestResultSummary>(`${CLIENT_BASE_URL}/tests/${testId}/result`);
};

export const getTestParticipantsResults = async (testId: string): Promise<ParticipantResult[]> => {
  return clientFetcher<ParticipantResult[]>(`${CLIENT_BASE_URL}/tests/${testId}/result/participants`);
};

export const getTestMainFeedback = async (testId: string): Promise<MainFeedback[]> => {
  return clientFetcher<MainFeedback[]>(`${CLIENT_BASE_URL}/tests/${testId}/result/mainfeedback`);
};

export const getTestMissionsResultById = async (
  missionId: string,
): Promise<MissionResultWithParticipant[]> => {
  return clientFetcher<MissionResultWithParticipant[]>(`${CLIENT_BASE_URL}/missions/${missionId}/result`);
};

export const getMissionResultById = async (
  missionResultId: string,
): Promise<MissionResultDetail> => {
  return clientFetcher<MissionResultDetail>(`${CLIENT_BASE_URL}/mission-results/${missionResultId}`);
};

/**
 * URL에서 JSONL 파일의 텍스트를 가져옴
 * 브라우저가 Content-Encoding: gzip 헤더를 자동으로 처리하므로 단순히 텍스트만 반환
 */
export const getMissionResultLogsByUrl = async (
  url: string,
): Promise<string> => {

  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch event logs: ${response.status} ${response.statusText}`);
  }

  return await response.text();
};

