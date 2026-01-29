import { TestStatus } from '@/features/(test-manage)/types';
export interface TestResultSummary {
  id: number;
  title: string;
  status: TestStatus;
  description: string;
  startDate?: string;
  endDate?: string;
  totalParticipants: number;
}

export type MissionResultStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'IN_PROGRESS' | 'DROP';
export type ParticipantMissionStatus = MissionResultStatus;

export interface ParticipantMissionResult {
  missionResultId: string;
  missionId: number;
  missionOrder: number;
  missionTitle: string;
  missionDescription: string;
  status: ParticipantMissionStatus;
  duration?: number;
  feedback?: string | null;
  createdAt?: string;
}

export interface ParticipantResult {
  participantId: string;
  persona: string;
  joinedAt: string;
  missionResults: ParticipantMissionResult[];
}

// 주요 피드백 관련 타입 추가
export interface MainFeedback {
  participantId: string;
  personaTags: string[];
  content: string;
  createdAt: string;
}

// 특정 미션의 결과 (participant 정보 포함)
export interface MissionResultWithParticipant extends ParticipantMissionResult {
  participantId: string;
  personaTags: string[];
}

export interface ActivitySegment {
  timestamp: number;
  duration: number;
  count?: number;
}

export interface AnalyzerResult {
  startTime: number;
  endTime: number;
  timeToFirstInteraction?: number;
  idleTime: ActivitySegment[];
  rageClickCount: ActivitySegment[];
  mouseThrashingCount: ActivitySegment[];
}

export type MissionResultDetail = {
  id: string;
  status: MissionResultStatus;
  feedback: string | null;
  missionId: string;
  presignedUrl: string;
  duration?: number;
  totalIdleTime?: number;
  rageClickCount?: number;
  mouseThrashingCount?: number;
  analysisData?: AnalyzerResult;
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
  personaTags: string[];
};
// 참여자 상세 조회는 ParticipantResult와 동일한 구조
export type ParticipantDetail = ParticipantResult;

// 테스트의 모든 미션과 각 미션의 결과
export type TestMissionsResults = {
  missions: MissionDetail[];
};
