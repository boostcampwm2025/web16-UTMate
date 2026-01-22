'use client';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

import type { ParticipantResponse, TestInfo } from '../types';

interface ResumeTestStepProps {
  testInfo: TestInfo;
  participantData: ParticipantResponse;
  onConfirmResume: () => void;
}

export function ResumeTestStep({ testInfo, participantData, onConfirmResume }: ResumeTestStepProps) {
  // 서버 데이터에서 진행 상황 계산
  const missionResults = participantData.missionResults;
  const completedCount = missionResults.filter(
    (mr) => mr.status === 'SUCCESS' || mr.status === 'FAILED'
  ).length;

  // 첫 번째 진행 중이거나 대기 중인 미션 찾기
  const inProgressMission = missionResults.find((mr) => mr.status === 'IN_PROGRESS');
  const pendingMission = missionResults.find((mr) => mr.status === 'PENDING');
  const currentMission = inProgressMission || pendingMission;

  // 현재 미션 인덱스 계산
  const currentMissionIndex = currentMission
    ? missionResults.findIndex((mr) => mr.id === currentMission.id)
    : completedCount;

  // 모든 미션 완료 여부
  const allMissionsCompleted = completedCount === testInfo.missions.length;

  const getProgressMessage = () => {
    if (allMissionsCompleted) {
      return '모든 미션 완료, 피드백 작성 중';
    }

    const missionNumber = currentMissionIndex + 1;

    if (inProgressMission) {
      return `미션 ${missionNumber} 수행 중`;
    }

    return `미션 ${missionNumber}을 시작하려던 중`;
  };

  const getCurrentMissionInfo = () => {
    if (allMissionsCompleted) {
      return null;
    }
    return testInfo.missions[currentMissionIndex];
  };

  const mission = getCurrentMissionInfo();

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
          <p className="text-muted-foreground pl-4 text-sm">
            {completedCount > 0 && `${completedCount}개 미션 완료, `}
            {getProgressMessage()}이었습니다
          </p>

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
        <Button onClick={onConfirmResume} className="w-full" size="lg">
          이어서 진행하기
        </Button>
      </CardContent>
    </Card>
  );
}
