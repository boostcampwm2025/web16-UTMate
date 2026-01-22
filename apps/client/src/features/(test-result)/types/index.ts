import { TestStatus } from '@/features/(test-manage)/types';

type MissionResultStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';

interface MissionResult {
  id: number;
  participantId: string;
  missionId: string;
  status: MissionResultStatus;
  duration: number;
  feedback: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SimpleMissionResult extends Pick<
  MissionResult,
  'id' | 'participantId' | 'missionId'
> {}

export interface TestResultSummary {
  id: number;
  title: string;
  status: TestStatus;
  description: string;
  startDate?: string;
  endDate?: string;
  totalParticipants: number;
}

// 참여자 결과 관련 타입 추가
export type ParticipantMissionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'IN_PROGRESS';

export interface ParticipantMissionResult {
  missionResultId: string;
  missionId: number;
  missionOrder: number;
  status: ParticipantMissionStatus;
  duration?: number;
  feedback?: string | null;
  createdAt?: string;
}

export interface ParticipantResult {
  participantId: string;
  persona: string;
  missionResults: ParticipantMissionResult[];
}

// 주요 피드백 관련 타입 추가
export interface MainFeedback {
  participantId: string;
  content: string;
  createdAt: string;
}

// 특정 미션의 결과 (participant 정보 포함)
export interface MissionResultWithParticipant extends ParticipantMissionResult {
  participantId: string;
  persona: string;
}

export type MissionResultDetail = {
  id: string;
  status: MissionResultStatus;
  feedback: string | null;
  missionId: string;
  presignedUrl: string;
};

export type MissionDetail = {
  id: string;
  missionOrder: number;
  name: string;
  description: string;
  missionUrl: string;
  estimatedDuration: number;

  successRate: number;
  dropRate: number;
  averageDuration: number;
  averageIdleTime: number;
  averageRageClickCount: number;
  averageMouseThrashingCount: number;
  missionResults: MissionResults[];
};

export type MissionResults = {
  id: string;
  status: ParticipantMissionStatus;
  duration?: number;
  feedback?: string;
  participantId: string;
  persona: string;
};
// 참여자 상세 조회는 ParticipantResult와 동일한 구조
export type ParticipantDetail = ParticipantResult;
