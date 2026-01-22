'use client';

import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';

import { startMission, submitMissionResult, uploadMissionRecording } from '../api';
import { useTestParticipateStore } from '../stores/useTestParticipateStore';
import type { Mission } from '../types';

interface MissionStepProps {
  testId: string;
  mission: Mission;
  missionNumber: number;
  totalMissions: number;
}

export function MissionStep({ testId, mission, missionNumber, totalMissions }: MissionStepProps) {
  const store = useTestParticipateStore(testId);

  // store에서 상태 및 액션 가져오기
  const currentMissionState = store((state) => state.currentMissionState);
  const missionResultId = store((state) => state.currentMissionResultId);
  const setMissionState = store((state) => state.setMissionState);
  const completeMission = store((state) => state.completeMission);

  // 로컬 상태
  const [missionCompleted, setMissionCompleted] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState('');
  const [missionWindow, setMissionWindow] = useState<Window | null>(null);

  // 컴포넌트 마운트 시 store의 상태로 동기화
  useEffect(() => {
    // 다음 미션으로 넘어갈 때 로컬 상태 초기화
    setMissionCompleted(null);
    setFeedback('');
    setMissionWindow(null);
  }, [mission.publicId]);

  // 미션 시작 mutation (PENDING → IN_PROGRESS)
  const startMissionMutation = useMutation({
    mutationFn: async () => {
      if (!missionResultId) throw new Error('미션 결과 ID가 없습니다.');
      await startMission(missionResultId);
    },
    onSuccess: () => {
      const newWindow = window.open(
        `${mission.missionUrl}?utmate-auth=${missionResultId}`,
        '_blank',
        'width=1200,height=800',
      );
      setMissionWindow(newWindow);
      setMissionState('recording');
    },
    onError: (error) => {
      console.error('Failed to start mission:', error);
      alert('미션 시작에 실패했습니다.');
    },
  });

  // 미션 수행 페이지 열기 (녹화 시작)
  const handleOpenMission = () => {
    // 이미 창이 열려있고 닫히지 않았다면 포커스만 주기
    if (missionWindow && !missionWindow.closed) {
      missionWindow.focus();
      return;
    }

    // recording 상태에서 다시 열기 (창이 닫힌 경우)
    if (currentMissionState === 'recording') {
      const newWindow = window.open(
        `${mission.missionUrl}?utmate-auth=${missionResultId}`,
        '_blank',
        'width=1200,height=800',
      );
      setMissionWindow(newWindow);
      return;
    }

    startMissionMutation.mutate();
  };

  // SDK에 flush 요청을 보내고 완료를 기다리는 함수
  const requestSdkFlush = (targetWindow: Window): Promise<void> => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        window.removeEventListener('message', handleMessage);
        // 타임아웃 시에도 진행 (SDK가 응답하지 않아도 계속 진행)
        resolve();
      }, 5000);

      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'UTM_SDK_FLUSH_COMPLETE') {
          clearTimeout(timeout);
          window.removeEventListener('message', handleMessage);
          if (event.data.success) {
            resolve();
          } else {
            // 실패해도 진행
            resolve();
          }
        }
      };

      window.addEventListener('message', handleMessage);

      // SDK에 flush 요청 전송
      targetWindow.postMessage({ type: 'UTM_SDK_FLUSH_REQUEST' }, '*');
    });
  };

  // 녹화 종료 mutation
  const finishRecordingMutation = useMutation({
    mutationFn: async () => {
      // SDK에 flush 요청을 보내고 완료를 기다림
      if (missionWindow && !missionWindow.closed) {
        await requestSdkFlush(missionWindow);
        missionWindow.close();
      }
      setMissionWindow(null);

      // SDK flush 완료 후 서버에 녹화 업로드 요청
      if (missionResultId) {
        await uploadMissionRecording(missionResultId);
      }
    },
    onSuccess: () => {
      setMissionState('completed');
    },
    onError: (error) => {
      console.error('Failed to finish recording:', error);
      alert('녹화 종료에 실패했습니다.');
    },
  });

  // 미션 결과 제출 mutation (다음 버튼 클릭 시)
  const submitMissionMutation = useMutation({
    mutationFn: async () => {
      if (!missionResultId) throw new Error('미션 결과 ID가 없습니다.');
      const status = missionCompleted ? 'SUCCESS' : 'FAILED';
      await submitMissionResult(missionResultId, status, feedback || undefined);
    },
    onSuccess: () => {
      completeMission({
        missionPublicId: mission.publicId,
        completed: missionCompleted!,
        feedback: feedback || undefined,
      });
    },
    onError: (error) => {
      console.error('Failed to submit mission result:', error);
      alert('미션 결과 제출에 실패했습니다.');
    },
  });

  const handleStopRecording = () => {
    finishRecordingMutation.mutate();
  };

  const handleMissionResult = (completed: boolean) => {
    setMissionCompleted(completed);
    setMissionState('feedback');
  };

  const handleNext = () => {
    if (missionCompleted === null) return;
    submitMissionMutation.mutate();
  };

  const isStateReached = (targetState: typeof currentMissionState) => {
    const stateOrder = ['ready', 'recording', 'completed', 'feedback'];
    return stateOrder.indexOf(currentMissionState) >= stateOrder.indexOf(targetState);
  };

  const isStateActive = (targetState: typeof currentMissionState) => {
    return currentMissionState === targetState;
  };

  return (
    <Card className="w-full max-w-3xl">
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
          <p className="text-muted-foreground text-sm whitespace-pre-wrap">{mission.description}</p>
        </div>

        {/* 1. 미션 수행 페이지 열기 */}
        <div className={!isStateActive('ready') && !isStateActive('recording') ? 'opacity-50' : ''}>
          <Button
            onClick={handleOpenMission}
            disabled={(!isStateActive('ready') && !isStateActive('recording')) || startMissionMutation.isPending}
            className="w-full"
            size="lg"
          >
            {startMissionMutation.isPending
              ? '시작 중...'
              : currentMissionState === 'recording'
                ? '미션 수행 페이지 다시 열기'
                : '미션 수행 페이지 열기 (새 창)'}
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
                disabled={!isStateActive('recording') || finishRecordingMutation.isPending}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                {finishRecordingMutation.isPending ? '데이터 전송 중...' : '녹화 종료'}
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
              <p className="text-sm">{missionCompleted ? '미션 성공' : '미션 실패'}</p>
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

            <Button
              onClick={handleNext}
              disabled={submitMissionMutation.isPending}
              className="w-full"
              size="lg"
            >
              {submitMissionMutation.isPending ? '제출 중...' : '다음'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
