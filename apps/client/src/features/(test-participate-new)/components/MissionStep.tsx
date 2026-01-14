'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';

import { finishMissionRecording, startMission } from '../api';
import type { Mission } from '../types';

interface MissionStepProps {
  mission: Mission;
  missionNumber: number;
  totalMissions: number;
  participantId?: string; // API 연동 시 사용
  missionResultId?: string; // 현재 미션 결과 ID
  onMissionResultIdChange?: (id: string) => void; // 미션 결과 ID 업데이트
  onNext: (completed: boolean, feedback?: string, missionResultId?: string) => void;
}

type MissionState = 'ready' | 'recording' | 'completed' | 'feedback';

export function MissionStep({
  mission,
  missionNumber,
  totalMissions,
  participantId,
  missionResultId,
  onMissionResultIdChange,
  onNext,
}: MissionStepProps) {
  const [state, setState] = useState<MissionState>('ready');
  const [missionCompleted, setMissionCompleted] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState('');
  const [missionWindow, setMissionWindow] = useState<Window | null>(null);

  // TODO: 창 닫힘 자동 감지 기능 활성화 (필요시 주석 해제)
  // useEffect(() => {
  //   if (!missionWindow || state !== 'recording') return;
  //
  //   const interval = setInterval(() => {
  //     if (missionWindow.closed) {
  //       clearInterval(interval);
  //       finishRecordingMutation.mutate();
  //     }
  //   }, 1000);
  //
  //   return () => clearInterval(interval);
  // }, [missionWindow, state]);

  // 미션 시작 mutation
  const startMissionMutation = useMutation({
    mutationFn: () => {
      if (!participantId) {
        throw new Error('Participant ID가 없습니다.');
      }
      return startMission(mission.publicId, participantId);
    },
    onSuccess: (data) => {
      if (onMissionResultIdChange) {
        onMissionResultIdChange(data.id);
      }
      const newWindow = window.open(mission.missionUrl, '_blank', 'width=1200,height=800');
      setMissionWindow(newWindow);
      setState('recording');
    },
    onError: (error) => {
      console.error('Failed to start mission:', error);
      alert('미션 시작에 실패했습니다.');
    },
  });

  // 녹화 종료 mutation
  const finishRecordingMutation = useMutation({
    mutationFn: () => {
      if (!missionResultId) {
        throw new Error('Mission Result ID가 없습니다.');
      }
      return finishMissionRecording(missionResultId);
    },
    onSuccess: () => {
      if (missionWindow && !missionWindow.closed) {
        missionWindow.close();
      }
      setState('completed');
    },
    onError: (error) => {
      console.error('Failed to finish recording:', error);
      alert('녹화 종료에 실패했습니다.');
    },
  });

  const handleOpenMission = () => {
    startMissionMutation.mutate();
  };

  const handleStopRecording = () => {
    finishRecordingMutation.mutate();
  };

  const handleMissionResult = (completed: boolean) => {
    setMissionCompleted(completed);
    setState('feedback');
  };

  const handleNext = () => {
    if (missionCompleted === null) return;
    // missionResultId를 onNext에 전달 (API 연동 시 사용)
    onNext(missionCompleted, feedback || undefined, missionResultId);
  };

  const isStateReached = (targetState: MissionState) => {
    const stateOrder = ['ready', 'recording', 'completed', 'feedback'];
    return stateOrder.indexOf(state) >= stateOrder.indexOf(targetState);
  };

  const isStateActive = (targetState: MissionState) => {
    return state === targetState;
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

        {/* 1. 미션 수행 페이지 열기 */}
        <div className={!isStateActive('ready') ? 'opacity-50' : ''}>
          <Button
            onClick={handleOpenMission}
            disabled={!isStateActive('ready')}
            className="w-full"
            size="lg"
          >
            미션 수행 페이지 열기 (새 창)
          </Button>
        </div>

        {/* 2. 녹화 종료 */}
        {isStateReached('recording') && (
          <div className={!isStateActive('recording') ? 'opacity-50' : ''}>
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm">새 창에서 미션을 수행해주세요.</p>
                <p className="text-muted-foreground text-xs">
                  미션을 완료했다면 아래 버튼을 눌러주세요.
                </p>
              </div>
              <Button
                onClick={handleStopRecording}
                disabled={!isStateActive('recording')}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                녹화 종료
              </Button>
            </div>
          </div>
        )}

        {/* 3. 미션 완료 여부 */}
        {isStateReached('completed') && (
          <div className={!isStateActive('completed') ? 'opacity-50' : ''}>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">미션 완료 여부</h3>
                <p className="text-muted-foreground text-sm">미션을 성공적으로 완료하셨나요?</p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => handleMissionResult(true)}
                  disabled={!isStateActive('completed')}
                  variant="default"
                  className="flex-1"
                  size="lg"
                >
                  성공
                </Button>
                <Button
                  onClick={() => handleMissionResult(false)}
                  disabled={!isStateActive('completed')}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  실패
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 4. 피드백 */}
        {isStateReached('feedback') && (
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
