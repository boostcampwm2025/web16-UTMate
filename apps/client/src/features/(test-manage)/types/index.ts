export const enum TestStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
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
