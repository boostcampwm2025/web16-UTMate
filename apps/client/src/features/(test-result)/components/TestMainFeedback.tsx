'use client';

import Link from 'next/link';
import { useSuspenseQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { generateNicknameFromId } from '@/shared/utils/nickname';

import { getTestMainFeedback } from '../apis/client';
import { formatRelativeDate } from '../utils/format';
import type { MainFeedback } from '../types';


interface TestMainFeedbackProps {
  testId: string;
}

export function TestMainFeedback({ testId }: TestMainFeedbackProps) {
  const { data: feedbacks } = useSuspenseQuery({
    queryKey: ['testMainFeedback', testId],
    queryFn: () => getTestMainFeedback(testId),
  });

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">전체 피드백</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {feedbacks.length > 0 ? (
          <ul className="space-y-2">
            {feedbacks.map((feedback) => (
              <Link
                key={feedback.participantId}
                href={`/tests/${testId}/result/participants/${feedback.participantId}`}
                className="block rounded-lg p-4 transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
              >
                <MainFeedbackItem feedback={feedback} />
              </Link>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground py-4 text-center text-sm">
            아직 결과가 없습니다.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface MainFeedbackItemProps {
  feedback: MainFeedback;
}

function MainFeedbackItem({ feedback }: MainFeedbackItemProps) {
  return (
    <li className="flex items-start gap-3">
      {/* 아바타 원형 플레이스홀더 */}
      {/* TODO 랜덤 아바타 컴포넌트 추가 */}
      {/* <div className="shrink-0 w-10 h-10 rounded-full border-2 border-gray-200 bg-gray-50" /> */}
      
      {/* 피드백 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-900">
            {generateNicknameFromId(feedback.participantId)}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeDate(feedback.createdAt)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feedback.content}
        </p>
      </div>
    </li>
  );
}

