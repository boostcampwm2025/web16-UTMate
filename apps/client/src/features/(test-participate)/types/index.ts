// ===== 백엔드 API 응답 타입 =====

/** 테스트 상태 */
export type TestStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';

/** 미션 정보 (GET /tests/:id 응답의 일부) */
export interface Mission {
  publicId: string;
  order: number;
  name: string;
  description: string;
  missionUrl: string;
  estimatedDuration: number; // 분 단위
}

/** 테스트 정보 (GET /tests/:id 응답) */
export interface TestInfo {
  publicId: string;
  title: string;
  description: string;
  status: TestStatus;
  url: string;
  sdkStatus: boolean;
  missions: Mission[];
}

/** 미션 결과 상태 */
export type MissionResultStatus = 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILED';

/** 참가자 상태 */
export type ParticipantStatus = 'ongoing' | 'completed';

/** 서버에서 받은 미션 결과 */
export interface MissionResultFromServer {
  id: string;
  missionId: string;
  status: MissionResultStatus;
}

/** 테스트 시작 응답 (POST /tests/:testId/participants) */
export interface StartTestResponse {
  id: string; // participantId (백엔드에서 id로 반환)
  missionResults: MissionResultFromServer[];
}

/** 참가자 정보 응답 (GET /participants/:id) */
export interface ParticipantResponse {
  status: ParticipantStatus;
  missionResults: MissionResultFromServer[];
}

// ===== 클라이언트 상태 관리용 타입 =====

/** 테스트 진행 단계 */
export type TestStep = 'start' | 'mission' | 'feedback' | 'complete';

/** 클라이언트 측 미션 결과 (store에서 관리) */
export interface MissionResult {
  missionPublicId: string;
  completed: boolean;
  feedback?: string;
}

/** 테스트 세션 상태 (store에서 관리) */
export interface TestSession {
  currentStep: TestStep;
  currentMissionIndex: number;
  missionResults: MissionResult[];
  overallFeedback?: string;
  participantId?: string;
  currentMissionResultId?: string;
}
