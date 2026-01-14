'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { CompleteStep } from '@/features/(test-participate)/components/CompleteStep';
import { FeedbackStep } from '@/features/(test-participate)/components/FeedbackStep';
import { MissionStep } from '@/features/(test-participate)/components/MissionStep';
import { ResumeTestStep } from '@/features/(test-participate)/components/ResumeTestStep';
import { TestParticipateLayout } from '@/features/(test-participate)/components/TestParticipateLayout';
import { TestStartStep } from '@/features/(test-participate)/components/TestStartStep';
import { useTestParticipateStore } from '@/features/(test-participate)/stores/useTestParticipateStore';
import type { TestInfo } from '@/features/(test-participate)/types';

// TODO: 백엔드 API 준비되면 제거
const MOCK_TEST: TestInfo = {
  publicId: '1',
  title: '사용성 테스트',
  description: '제품의 주요 기능을 테스트하고 피드백을 제공해주세요.',
  status: 'ACTIVE',
  url: 'https://example.com',
  sdkStatus: true,
  missions: [
    {
      publicId: 'm1',
      order: 1,
      name: '홈페이지 탐색',
      description: '홈페이지에 접속하여\n주요 기능을 확인해보세요.',
      missionUrl: 'https://ryurain.info',
      estimatedDuration: 3,
    },
    {
      publicId: 'm2',
      order: 2,
      name: '로그인 기능 테스트',
      description: '로그인 버튼을 찾아\n클릭해주세요.',
      missionUrl: 'https://ryurain.info/login',
      estimatedDuration: 5,
    },
  ],
};

export default function TestParticipatePage() {
  const params = useParams();
  const testId = params.testId as string;

  // React Query로 테스트 정보 가져오기 (임시로 Mock 데이터 사용)
  // TODO: 백엔드 API 준비되면 getTestForParticipation(testId)로 변경
  const { data: testInfo } = useQuery({
    queryKey: ['test', testId],
    queryFn: async () => {
      // 임시로 Mock 데이터 반환
      return MOCK_TEST;
    },
  });

  // Zustand store에서 상태 및 액션 가져오기
  const currentStep = useTestParticipateStore((state) => state.currentStep);
  const currentMissionIndex = useTestParticipateStore((state) => state.currentMissionIndex);
  const needsResume = useTestParticipateStore((state) => state.needsResume);
  const startTest = useTestParticipateStore((state) => state.startTest);
  const submitFeedback = useTestParticipateStore((state) => state.submitFeedback);

  // 테스트 시작 mutation
  // TODO: 백엔드 API 준비되면 startTestParticipation(testId) 사용
  const startTestMutation = useMutation({
    mutationFn: async () => {
      // 임시로 Mock 데이터 반환
      return { participantId: `participant-${Date.now()}` };
    },
    onSuccess: (data) => {
      startTest(data.participantId);
    },
    onError: (error) => {
      console.error('Failed to start test:', error);
      alert('테스트 시작에 실패했습니다.');
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
      submitFeedback(feedback);
    },
    onError: (error) => {
      console.error('Failed to complete test:', error);
      alert('테스트 완료 처리에 실패했습니다.');
    },
  });

  const handleStart = () => {
    startTestMutation.mutate();
  };

  const handleFeedbackSubmit = (feedback: string) => {
    completeTestMutation.mutate(feedback);
  };

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

  return (
    <>
      {/* 이어하기 안내 */}
      {needsResume ? (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
          <ResumeTestStep testInfo={testInfo} />
        </div>
      ) : /* 시작 단계는 프로그레스 바 없이 */
      currentStep === 'start' ? (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
          <TestStartStep testInfo={testInfo} onStart={handleStart} />
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
              mission={testInfo.missions[currentMissionIndex]}
              missionNumber={currentMissionIndex + 1}
              totalMissions={testInfo.missions.length}
            />
          )}

          {currentStep === 'feedback' && <FeedbackStep onSubmit={handleFeedbackSubmit} />}
        </TestParticipateLayout>
      )}
    </>
  );
}
