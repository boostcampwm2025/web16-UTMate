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