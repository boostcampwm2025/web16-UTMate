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

export interface GetTestsResponse {
  tests: Test[];
  total: number;
}
