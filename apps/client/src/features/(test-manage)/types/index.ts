import type { Interest } from '@/features/(auth)/types';

export const enum TestStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DEMO = 'DEMO',
}

export interface UserSummary {
  publicId: string;
  username: string;
  avatarUrl: string;
}

export interface Test {
  publicId: string;
  title: string;
  description: string;
  status: TestStatus;
  url: string;
  sdkStatus: boolean;
  owner: UserSummary;
  members: UserSummary[];
  // 타겟 페르소나 설정
  isPublic: boolean; // 공개/비공개 (필수)
  targetGenders: string[]; // 필수 - 전체 선택 시 모든 성별
  targetAges: string[]; // 필수 - 전체 선택 시 모든 연령대
  targetInterests: Interest[]; // 선택사항 - 비어있으면 모든 관심사 대상
}

export interface TestMission {
  publicId: string;
  order: number;
  name: string;
  description: string;
  missionUrl: string;
  estimatedDuration: number; // 예상 소요시간 (분 단위)
}

export interface TestDetail extends Test {
  missions: TestMission[];
}

export type GetTestsResponse = Test[];
