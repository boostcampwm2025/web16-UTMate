import { BASE_URL } from '@/shared/constants/api';

export const getTests = async () => {
  const response = await fetch(`${BASE_URL}/tests`);
  return response.json();
};
