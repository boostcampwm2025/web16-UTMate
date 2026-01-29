export interface SearchTestResult {
  id: string;
  title: string;
  description: string;
  url: string;
  missionsCount: number;
  totalTimeMinutes: number;
  participantsCount: number;
  tags: string[];
}

export interface SearchTestResponse {
  tests: SearchTestResult[];
  totalPage: number;
}
