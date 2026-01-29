import { clientFetcher } from '@/shared/utils/fetcher/clientFetcher';
import { CLIENT_BASE_URL } from '@/shared/constants/api';

import type { SearchTestResponse } from '../types';

export interface TestSearchParams {
  gender?: string;
  age?: string;
  interests?: string[];
  page?: number;
  limit?: number;
}

export const searchTests = async (params: TestSearchParams) => {
  const { gender, age, interests, page, limit } = params;

  const searchParams = new URLSearchParams();

  if (gender) searchParams.append('gender', gender);
  if (age) searchParams.append('age', age);
  if (interests) {
    interests.forEach((interest) => searchParams.append('interests', interest));
  }
  if (page) searchParams.append('page', page.toString());
  if (limit) searchParams.append('limit', limit.toString());

  const response = await clientFetcher<SearchTestResponse>(
    `${CLIENT_BASE_URL}/tests/search?${searchParams.toString()}`,
  );

  return response;
};
