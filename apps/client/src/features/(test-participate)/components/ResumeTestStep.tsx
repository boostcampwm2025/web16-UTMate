'use client';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

import { useTestParticipateStore } from '../stores/useTestParticipateStore';
import type { TestInfo } from '../types';

interface ResumeTestStepProps {
  testInfo: TestInfo;
  testId: string;
}

export function ResumeTestStep({ testInfo, testId }: ResumeTestStepProps) {
  const store = useTestParticipateStore(testId);

  const currentStep = store((state) => state.currentStep);
  const currentMissionIndex = store((state) => state.currentMissionIndex);
  const currentMissionState = store((state) => state.currentMissionState);
  const confirmResume = store((state) => state.confirmResume);

  const getProgressMessage = () => {
    if (currentStep === 'mission') {
      const missionNumber = currentMissionIndex + 1;

      if (currentMissionState === 'ready') {
        return `미션 ${missionNumber}을 시작하려던 중`;
      } else if (currentMissionState === 'recording') {
        return `미션 ${missionNumber} 수행 중`;
      } else if (currentMissionState === 'completed' || currentMissionState === 'feedback') {
        return `미션 ${missionNumber} 완료 직전`;
      }
    } else if (currentStep === 'feedback') {
      return '전체 피드백 작성 중';
    }

    return '진행 중';
  };

  const getCurrentMission = () => {
    if (currentStep === 'mission') {
      return testInfo.missions[currentMissionIndex];
    }
    return null;
  };

  const mission = getCurrentMission();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">이어서 하시겠습니까?</CardTitle>
        <CardDescription>이전에 진행하던 테스트가 있습니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 진행 상황 표시 */}
        <div className="bg-muted space-y-3 rounded-lg p-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary h-2 w-2 rounded-full" />
            <p className="font-medium">진행 상황</p>
          </div>
          <p className="text-muted-foreground pl-4 text-sm">{getProgressMessage()}이었습니다</p>

          {mission && (
            <div className="pl-4 pt-2">
              <p className="text-sm font-medium">{mission.name}</p>
              <p className="text-muted-foreground mt-1 text-xs">{mission.description.split('\n')[0]}</p>
            </div>
          )}
        </div>

        {/* 안내 메시지 */}
        <div className="space-y-2">
          <p className="text-sm">
            이어하기를 선택하시면 <span className="font-semibold">저장된 지점부터</span> 계속 진행하실 수 있습니다.
          </p>
        </div>

        {/* 이어하기 버튼 */}
        <Button onClick={confirmResume} className="w-full" size="lg">
          이어서 진행하기
        </Button>
      </CardContent>
    </Card>
  );
}
