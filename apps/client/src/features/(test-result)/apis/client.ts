import { CLIENT_BASE_URL } from '@/shared/constants/api';
import { clientFetcher } from '@/shared/utils/fetcher/clientFetcher';

import type {
  MainFeedback,
  MissionResultWithParticipant,
  TestSummary,
  ParticipantResult,
  MissionResultDetail,
} from '../types';

export const getTestSummary = async (testId: string): Promise<TestSummary> => {
  return clientFetcher<TestSummary>(`${CLIENT_BASE_URL}/tests/${testId}/result`);
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
