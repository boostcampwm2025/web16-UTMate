'use client';

import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';

import type { Mission } from '../types';

interface MissionStepProps {
  mission: Mission;
  missionNumber: number;
  totalMissions: number;
  onNext: (completed: boolean, feedback?: string) => void;
}

type MissionState = 'ready' | 'recording' | 'completed' | 'feedback';

export function MissionStep({ mission, missionNumber, totalMissions, onNext }: MissionStepProps) {
  const [state, setState] = useState<MissionState>('ready');
  const [missionCompleted, setMissionCompleted] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState('');
  const [missionWindow, setMissionWindow] = useState<Window | null>(null);

  const handleOpenMission = () => {
    const newWindow = window.open(mission.missionUrl, '_blank', 'width=1200,height=800');
    setMissionWindow(newWindow);
    setState('recording');
  };

  const handleStopRecording = () => {
    if (missionWindow && !missionWindow.closed) {
      missionWindow.close();
    }
    setState('completed');
  };

  const handleMissionResult = (completed: boolean) => {
    setMissionCompleted(completed);
    setState('feedback');
  };

  const handleNext = () => {
    if (missionCompleted === null) return;
    onNext(missionCompleted, feedback || undefined);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">
            미션 {missionNumber} / {totalMissions}
          </p>
          <CardTitle className="text-2xl">{mission.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 미션 설명 */}
        <div className="space-y-2">
          <h3 className="font-semibold">미션 설명</h3>
          <p className="text-muted-foreground whitespace-pre-wrap text-sm">{mission.description}</p>
        </div>

        {/* 상태별 UI */}
        {state === 'ready' && (
          <Button onClick={handleOpenMission} className="w-full" size="lg">
            미션 수행 페이지 열기 (새 창)
          </Button>
        )}

        {state === 'recording' && (
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm">새 창에서 미션을 수행해주세요.</p>
              <p className="text-muted-foreground text-xs">
                미션을 완료했다면 아래 버튼을 눌러주세요.
              </p>
            </div>
            <Button onClick={handleStopRecording} variant="destructive" className="w-full" size="lg">
              녹화 종료
            </Button>
          </div>
        )}

        {state === 'completed' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">미션 완료 여부</h3>
              <p className="text-muted-foreground text-sm">미션을 성공적으로 완료하셨나요?</p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => handleMissionResult(true)}
                variant="default"
                className="flex-1"
                size="lg"
              >
                성공
              </Button>
              <Button
                onClick={() => handleMissionResult(false)}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                실패
              </Button>
            </div>
          </div>
        )}

        {state === 'feedback' && (
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm">
                {missionCompleted ? '✅ 미션 성공' : '❌ 미션 실패'}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">피드백 (선택)</h3>
              <p className="text-muted-foreground text-sm">
                이 미션에 대한 의견이 있다면 남겨주세요.
              </p>
              <Textarea
                placeholder="예: 버튼을 찾기 어려웠어요 / 설명이 명확했어요"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={handleNext} className="w-full" size="lg">
              다음
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
