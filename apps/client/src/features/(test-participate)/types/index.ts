// 백엔드 GET /tests/:id 응답 타입
export interface Mission {
  publicId: string;
  order: number;
  name: string;
  description: string;
  missionUrl: string;
  estimatedDuration: number; // 분 단위
}

export interface TestInfo {
  publicId: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  url: string;
  sdkStatus: boolean;
  missions: Mission[];
}

// 미션 결과 타입 (클라이언트 상태 관리용)
export interface MissionResult {
  missionPublicId: string;
  completed: boolean;
  feedback?: string;
}

// 테스트 세션 상태 (클라이언트 상태 관리용)
export type TestStep = 'start' | 'mission' | 'feedback' | 'complete';

export interface TestSession {
  currentStep: TestStep;
  currentMissionIndex: number;
  missionResults: MissionResult[];
  overallFeedback?: string;
  participantId?: string; // API 연동 시 사용
  currentMissionResultId?: string; // 현재 미션의 결과 ID
}

// 미션 진행 상황 조회 응답 타입 (GET /participants/:id/mission-progress)
export interface MissionProgress {
  finishedMissionCount: number;
  isPendingMissionExist: boolean;
  pendingMissionId?: string;
}

// 백엔드 MissionResult 상태
export type MissionResultStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

// 백엔드 Participant 상태
export type ParticipantStatus = 'ongoing' | 'completed';

// 백엔드 MissionResult 응답 타입
export interface MissionResultFromServer {
  id: string;
  missionId: string;
  status: MissionResultStatus;
}

// POST /tests/:testId/participants 응답 타입
export interface StartTestResponse {
  participantId: string;
  missionResults: MissionResultFromServer[];
}

// GET /participants/:id 응답 타입 (이어하기용)
export interface ParticipantResponse {
  status: ParticipantStatus;
  missionResults: MissionResultFromServer[];
}
