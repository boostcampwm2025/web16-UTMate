import { useMutation } from '@tanstack/react-query';

import type { MissionResult, TestInfo, TestSession } from '../types';

interface UseTestParticipationOptions {
  testInfo: TestInfo | undefined;
  session: TestSession;
  setSession: (session: TestSession | ((prev: TestSession) => TestSession)) => void;
}

/**
 * 테스트 참여 관련 mutation 로직을 관리하는 커스텀 훅
 */
export function useTestParticipation({
  testInfo,
  session,
  setSession,
}: UseTestParticipationOptions) {
  // 테스트 시작 mutation
  // TODO: 백엔드 API 준비되면 startTestParticipation(testId) 사용
  const startTestMutation = useMutation({
    mutationFn: async () => {
      // 임시로 Mock 데이터 반환
      return { participantId: `participant-${Date.now()}` };
    },
    onSuccess: (data) => {
      setSession((prev) => ({
        ...prev,
        currentStep: 'mission',
        currentMissionIndex: 0,
        participantId: data.participantId,
      }));
    },
    onError: (error) => {
      console.error('Failed to start test:', error);
      alert('테스트 시작에 실패했습니다.');
    },
  });

  // 미션 결과 제출 mutation
  // TODO: 백엔드 API 준비되면 submitMissionResult 사용
  const submitMissionMutation = useMutation({
    mutationFn: async ({
      missionResultId,
      completed,
      feedback,
    }: {
      missionResultId: string;
      completed: boolean;
      feedback?: string;
    }) => {
      // 임시로 성공 반환
      return Promise.resolve();
    },
    onSuccess: (_, variables) => {
      if (!testInfo) return;

      const missionResult: MissionResult = {
        missionPublicId: testInfo.missions[session.currentMissionIndex].publicId,
        completed: variables.completed,
        feedback: variables.feedback,
      };

      setSession((prev) => ({
        ...prev,
        missionResults: [...prev.missionResults, missionResult],
      }));

      // 다음 미션으로 이동 또는 피드백 단계로
      if (session.currentMissionIndex < testInfo.missions.length - 1) {
        setSession((prev) => ({
          ...prev,
          currentMissionIndex: prev.currentMissionIndex + 1,
          currentMissionResultId: undefined,
        }));
      } else {
        setSession((prev) => ({
          ...prev,
          currentStep: 'feedback',
        }));
      }
    },
    onError: (error) => {
      console.error('Failed to submit mission result:', error);
      alert('미션 결과 제출에 실패했습니다.');
    },
  });

  // 테스트 완료 mutation
  // TODO: 백엔드 API 준비되면 completeTestParticipation 사용
  const completeTestMutation = useMutation({
    mutationFn: async (feedback: string) => {
      // 임시로 성공 반환
      return Promise.resolve();
    },
    onSuccess: (_, feedback) => {
      setSession((prev) => ({
        ...prev,
        overallFeedback: feedback,
        currentStep: 'complete',
      }));

      console.log('세션 완료:', {
        participantId: session.participantId,
        missionResults: session.missionResults,
        overallFeedback: feedback,
      });
    },
    onError: (error) => {
      console.error('Failed to complete test:', error);
      alert('테스트 완료 처리에 실패했습니다.');
    },
  });

  // 시작 버튼 클릭
  const handleStart = () => {
    startTestMutation.mutate();
  };

  // 미션 완료 (다음 버튼 클릭 시 MissionStep에서 호출됨)
  const handleMissionComplete = (
    completed: boolean,
    feedback?: string,
    missionResultId?: string
  ) => {
    // Mock 모드에서는 missionResultId가 임시로 생성되므로 항상 존재
    submitMissionMutation.mutate({
      missionResultId: missionResultId || 'temp',
      completed,
      feedback,
    });
  };

  // 전체 피드백 제출
  const handleFeedbackSubmit = (feedback: string) => {
    completeTestMutation.mutate(feedback);
  };

  return {
    handleStart,
    handleMissionComplete,
    handleFeedbackSubmit,
  };
}
