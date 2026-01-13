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
}
