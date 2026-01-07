export const enum TestType {
  DRAFT = 'DRAFT',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED',
}

export interface User {
  id: number;
  name: string;
  profileImageUrl: string | null;
}

export interface Test {
  id: number;
  name: string;
  type: TestType;
  integrationUrl: string;
  participants: number;
  creator: User;
}

export interface TestMission {
  id: number;
  name: string;
  description: string;
  url: string;
  estimatedDuration?: number; // 예상 소요시간 (분 단위)
}

export interface TestDetail extends Test {
  missions: TestMission[];
}

export interface GetTestsResponse {
  tests: Test[];
  total: number;
}
