// Test Status
export type TestStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';

// Mission Success Criteria Type
export type SuccessCriteriaType =
  | 'URL_CHANGE'
  | 'BUTTON_CLICK'
  | 'INPUT_FILL'
  | 'SCROLL'
  | 'CUSTOM';

// Mission Result Status
export type MissionResultStatus = 'SUCCESS' | 'FAILED' | 'SKIPPED';

// Mission Status (client-side only)
export type MissionStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface Test {
  id: number;
  ownerId: string;
  testUrl: string;
  title: string;
  description: string;
  status: TestStatus;
  maxParticipants: number;
  createdAt: string;
  updatedAt: string;
}

export interface Mission {
  id: number;
  testId: number;
  orderNumber: number;
  title: string;
  description: string;
  successCriteriaType: SuccessCriteriaType;
  successCriteriaValue: string;
  createdAt: string;
}

export interface MissionResult {
  id: number;
  missionId: number;
  testSessionId: number;
  status: MissionResultStatus;
  feedback: string | null;
  durationSeconds: number;
  startedAt: string;
  finishedAt: string;
}

export interface TestSession {
  id: number;
  testId: number;
  userId?: string;
  currentMissionId: number;
  startedAt: string;
  completedAt?: string;
}

export interface TestWithMissions extends Test {
  missions: Mission[];
}

export type MissionStatusMap = Record<number, MissionStatus>;
