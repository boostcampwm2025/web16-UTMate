'use client';

import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';

import type { TestInfo } from '../types';

interface TestStartStepProps {
  testInfo: TestInfo;
  onStart: () => void;
  isLoading?: boolean;
}

export function TestStartStep({ testInfo, onStart, isLoading }: TestStartStepProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleStart = () => {
    if (!agreedToTerms) {
      alert('권한 동의가 필요합니다.');
      return;
    }
    onStart();
  };

  // 총 예상 소요시간 계산 (분)
  const totalEstimatedMinutes = testInfo.missions.reduce((sum, mission) => sum + mission.estimatedDuration, 0);

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-2xl">{testInfo.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 테스트 개요 */}
        <div className="space-y-2">
          <h3 className="font-semibold">테스트 개요</h3>
          <p className="text-muted-foreground text-sm">{testInfo.description}</p>
        </div>

        {/* 미션 정보 */}
        <div className="flex gap-8">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">미션 개수</p>
            <p className="text-2xl font-bold">{testInfo.missions.length}개</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">예상 소요시간</p>
            <p className="text-2xl font-bold">{totalEstimatedMinutes}분</p>
          </div>
        </div>

        {/* 권한 동의 설명 */}
        <div className="bg-muted space-y-3 rounded-lg p-4">
          <h4 className="font-semibold">권한 동의 안내</h4>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li>• 테스트 진행 중 사용자 행동 데이터가 수집됩니다.</li>
            <li>• 수집된 데이터는 테스트 분석 목적으로만 사용됩니다.</li>
            <li>• 개인을 식별할 수 있는 정보는 수집되지 않습니다.</li>
            <li>• 언제든지 테스트를 중단할 수 있습니다.</li>
            <li className="font-medium text-orange-600">• 테스트 시작 후 이전 단계로 되돌릴 수 없습니다.</li>
          </ul>
        </div>

        {/* 동의 체크박스 */}
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
          <Label htmlFor="terms" className="cursor-pointer text-sm font-medium leading-none">
            위 내용을 확인했으며, 테스트 참여에 동의합니다.
          </Label>
        </div>

        {/* 시작 버튼 */}
        <Button onClick={handleStart} disabled={!agreedToTerms || isLoading} className="w-full" size="lg">
          {isLoading ? '시작 중...' : '테스트 시작하기'}
        </Button>
      </CardContent>
    </Card>
  );
}
