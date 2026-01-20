'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { CompleteStep } from '@/features/(test-participate)/components/CompleteStep';
import { FeedbackStep } from '@/features/(test-participate)/components/FeedbackStep';
import { MissionStep } from '@/features/(test-participate)/components/MissionStep';
import { ResumeTestStep } from '@/features/(test-participate)/components/ResumeTestStep';
import { TestParticipateLayout } from '@/features/(test-participate)/components/TestParticipateLayout';
import { TestStartStep } from '@/features/(test-participate)/components/TestStartStep';
import { useTestParticipateStore } from '@/features/(test-participate)/stores/useTestParticipateStore';
import {
  completeTestParticipation,
  getParticipant,
  getTestForParticipation,
  startTestParticipation,
} from '@/features/(test-participate)/api';
import type { ParticipantResponse } from '@/features/(test-participate)/types';

export default function TestParticipatePage() {
  const params = useParams();
  const testId = params.testId as string;

  // 이미 완료된 테스트인지 여부
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false);

  // 서버에서 가져온 참가자 정보 (이어하기용)
  const [participantData, setParticipantData] = useState<ParticipantResponse | null>(null);

  // React Query로 테스트 정보 가져오기
  const { data: testInfo } = useQuery({
    queryKey: ['test', testId],
    queryFn: () => getTestForParticipation(testId),
  });

  // testId별 Zustand store 인스턴스 가져오기
  const store = useTestParticipateStore(testId);

  // store에서 상태 및 액션 가져오기
  const currentStep = store((state) => state.currentStep);
  const currentMissionIndex = store((state) => state.currentMissionIndex);
  const needsResume = store((state) => state.needsResume);
  const isLoadingResume = store((state) => state.isLoadingResume);
  const participantId = store((state) => state.participantId);
  const startTest = store((state) => state.startTest);
  const resumeTest = store((state) => state.resumeTest);
  const submitFeedback = store((state) => state.submitFeedback);
  const clearSession = store((state) => state.clearSession);
  const setLoadingResume = store((state) => state.setLoadingResume);

  // 이어하기 진입 시 참가자 정보 조회 (서버에서 현재 상태 가져오기)
  useEffect(() => {
    const fetchParticipantStatus = async () => {
      if (needsResume && participantId && isLoadingResume) {
        const participant = await getParticipant(participantId);

        if (!participant) {
          // 참가자 정보가 없으면 세션 초기화
          clearSession();
          return;
        }

        if (participant.status === 'completed') {
          // 이미 완료된 테스트
          setIsAlreadyCompleted(true);
          clearSession();
          return;
        }

        // 참가자 정보 저장 (이어하기 화면에서 사용)
        setParticipantData(participant);
        setLoadingResume(false);
      }
    };

    fetchParticipantStatus();
  }, [needsResume, participantId, isLoadingResume, clearSession, setLoadingResume]);

  // 이어하기 확인 핸들러
  const handleConfirmResume = () => {
    if (participantData && testInfo) {
      resumeTest(participantData.missionResults, testInfo.missions.length);
    }
  };

  // 테스트 시작 mutation
  const startTestMutation = useMutation({
    mutationFn: () => startTestParticipation(testId),
    onSuccess: (data) => {
      startTest(data.id, data.missionResults);
    },
    onError: (error) => {
      console.error('Failed to start test:', error);
      alert('테스트 시작에 실패했습니다.');
    },
  });

  // 테스트 완료 mutation
  const completeTestMutation = useMutation({
    mutationFn: (feedback: string) => {
      if (!participantId) throw new Error('참가자 정보가 없습니다.');
      return completeTestParticipation(participantId, feedback);
    },
    onSuccess: (_, feedback) => {
      submitFeedback(feedback);
    },
    onError: (error) => {
      console.error('Failed to complete test:', error);
      alert('테스트 완료 처리에 실패했습니다.');
    },
  });

  // 현재 단계에 따른 프로그레스 계산
  const getCurrentStepNumber = (): number => {
    if (!testInfo) return 0;
    switch (currentStep) {
      case 'start':
        return 0;
      case 'mission':
        return currentMissionIndex + 1;
      case 'feedback':
        return testInfo.missions.length + 1;
      case 'complete':
        return testInfo.missions.length + 2;
      default:
        return 0;
    }
  };

  const getTotalSteps = (): number => {
    if (!testInfo) return 0;
    return testInfo.missions.length + 2; // 미션들 + 피드백 + 완료
  };

  const getStepDescription = (): string => {
    if (!testInfo) return '';
    switch (currentStep) {
      case 'start':
        return '테스트 시작 전';
      case 'mission':
        return `미션 ${currentMissionIndex + 1} / ${testInfo.missions.length}`;
      case 'feedback':
        return '전체 피드백';
      case 'complete':
        return '완료';
      default:
        return '';
    }
  };

  // testInfo가 없으면 로딩 화면 표시
  if (!testInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  // 이미 완료된 테스트인 경우
  if (isAlreadyCompleted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-4xl">✅</div>
          <h2 className="mb-2 text-xl font-bold">이미 완료된 테스트입니다</h2>
          <p className="text-muted-foreground mb-6">
            이 테스트는 이미 참여를 완료하셨습니다.
            <br />
            참여해 주셔서 감사합니다!
          </p>
          <a
            href="/"
            className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  // 이어하기 로딩 중
  if (needsResume && isLoadingResume) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-muted-foreground">진행 상황을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <>
      {/* 이어하기 안내 */}
      {needsResume && participantData ? (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
          <ResumeTestStep
            testInfo={testInfo}
            participantData={participantData}
            onConfirmResume={handleConfirmResume}
          />
        </div>
      ) : currentStep === 'start' ? (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
          <TestStartStep
            testInfo={testInfo}
            onStart={() => startTestMutation.mutate()}
            isLoading={startTestMutation.isPending}
          />
        </div>
      ) : currentStep === 'complete' ? (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
          <CompleteStep />
        </div>
      ) : (
        <TestParticipateLayout
          currentStep={getCurrentStepNumber()}
          totalSteps={getTotalSteps()}
          stepDescription={getStepDescription()}
        >
          {currentStep === 'mission' && (
            <MissionStep
              key={testInfo.missions[currentMissionIndex].publicId}
              testId={testId}
              mission={testInfo.missions[currentMissionIndex]}
              missionNumber={currentMissionIndex + 1}
              totalMissions={testInfo.missions.length}
            />
          )}

          {currentStep === 'feedback' && (
            <FeedbackStep
              onSubmit={(feedback) => completeTestMutation.mutate(feedback)}
              isLoading={completeTestMutation.isPending}
            />
          )}
        </TestParticipateLayout>
      )}
    </>
  );
}
