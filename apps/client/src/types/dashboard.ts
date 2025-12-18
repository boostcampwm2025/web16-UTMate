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
