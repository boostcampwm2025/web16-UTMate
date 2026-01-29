'use client';

import Link from 'next/link';
import { useSuspenseQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { AnimalAvatar } from '@/shared/components/AnimalAvatar';
import { generateNicknameFromId } from '@/shared/utils/nickname';

import { getTestMainFeedback } from '../apis/client';
import { formatDistanceToNow } from '../utils/dates';
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
    <Card className="flex h-full flex-col">
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
                className="hover:bg-accent hover:text-accent-foreground block rounded-lg p-2 transition-all duration-200"
              >
                <MainFeedbackItem feedback={feedback} />
              </Link>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground py-4 text-center text-sm">아직 결과가 없습니다.</p>
        )}
      </CardContent>
    </Card>
  );
}

interface MainFeedbackItemProps {
  feedback: MainFeedback;
}

function MainFeedbackItem({ feedback }: MainFeedbackItemProps) {
  const nickname = generateNicknameFromId(feedback.participantId);
  return (
    <li className="flex items-start gap-3">
      <AnimalAvatar name={nickname.split(' ')[1]} className="my-auto" />

      {/* 피드백 내용 */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{nickname}</span>
            {feedback.personaTag.length > 0 && (
              <span className="flex gap-1">
                {feedback.personaTag.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-muted text-muted-foreground border-muted-foreground/10 rounded-full border px-2 py-0.5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            )}
          </div>

          <span className="text-muted-foreground text-xs">
            {formatDistanceToNow(feedback.createdAt)}
          </span>
        </div>
        <p className="text-muted-foreground line-clamp-1 text-sm leading-relaxed">
          {feedback.content}
        </p>
      </div>
    </li>
  );
}
