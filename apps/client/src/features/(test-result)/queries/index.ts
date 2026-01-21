import { queryOptions } from '@tanstack/react-query';
import { getTestParticipantsResults } from '../apis/client';

export const testParticipantsResultsQuery = (testId: string) =>
  queryOptions({
    queryKey: ['testParticipantsResults', testId],
    queryFn: () => getTestParticipantsResults(testId),
  });
