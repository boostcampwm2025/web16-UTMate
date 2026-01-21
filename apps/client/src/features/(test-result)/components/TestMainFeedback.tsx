'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { getTestMainFeedback } from '../apis/client';

interface TestMainFeedbackProps {
  testId: string;
}

export function TestMainFeedback({ testId }: TestMainFeedbackProps) {
  const { data: feedbacks } = useSuspenseQuery({
    queryKey: ['testMainFeedback', testId],
    queryFn: () => getTestMainFeedback(testId),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">주요 피드백</CardTitle>
      </CardHeader>
      <CardContent>
        {feedbacks.length > 0 ? (
          <ul className="space-y-3">
            {feedbacks.map((feedback) => (
              <li key={feedback.id} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <p className="text-muted-foreground text-sm leading-relaxed">{feedback.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground py-4 text-center text-sm">
            수집된 주요 피드백이 없습니다.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
