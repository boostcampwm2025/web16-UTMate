'use client';

import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';

interface FeedbackStepProps {
  onSubmit: (feedback: string) => void;
}

export function FeedbackStep({ onSubmit }: FeedbackStepProps) {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    onSubmit(feedback);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-2xl">테스트 완료</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 안내 메시지 */}
        <div className="bg-muted rounded-lg p-4">
          <p className="text-sm">모든 미션을 완료하셨습니다! 🎉</p>
          <p className="text-muted-foreground text-xs">
            테스트 전체에 대한 의견을 자유롭게 남겨주세요.
          </p>
        </div>

        {/* 전체 피드백 입력 */}
        <div className="space-y-2">
          <h3 className="font-semibold">전체 피드백</h3>
          <p className="text-muted-foreground text-sm">
            테스트를 진행하면서 느낀 점이나 개선사항을 알려주세요.
          </p>
          <Textarea
            placeholder="예: 전반적으로 사용하기 편리했습니다. 다만 일부 버튼의 위치가 헷갈렸어요."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={6}
          />
        </div>

        {/* 제출 버튼 */}
        <Button onClick={handleSubmit} className="w-full" size="lg">
          제출하기
        </Button>
      </CardContent>
    </Card>
  );
}
