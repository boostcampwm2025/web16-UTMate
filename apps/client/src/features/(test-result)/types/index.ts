import { TestStatus } from "@/features/(test-manage)/types";


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

export interface TestSummary {
  id: number;
  title: string;
  status: TestStatus;
  description: string;
  startDate: string;
  endDate: string;
  totalParticipants: number;
}

// 참여자 결과 관련 타입 추가
export type ParticipantMissionStatus = 'SUCCESS' | 'FAILURE' | 'DROPPED' | 'IN_PROGRESS';

export interface ParticipantMissionResult {
  missionId: number;
  missionOrder: number;
  status: ParticipantMissionStatus;
}

export interface ParticipantResult {
  participantId: string;
  persona: string;
  missionResults: ParticipantMissionResult[];
}

// 주요 피드백 관련 타입 추가
export interface MainFeedback {
  id: number;
  content: string;
}
