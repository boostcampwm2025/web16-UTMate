'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { CompleteStep } from '@/features/(test-participate)/components/CompleteStep';
import { FeedbackStep } from '@/features/(test-participate)/components/FeedbackStep';
import { MissionStep } from '@/features/(test-participate)/components/MissionStep';
import { TestParticipateLayout } from '@/features/(test-participate)/components/TestParticipateLayout';
import { TestStartStep } from '@/features/(test-participate)/components/TestStartStep';
import { useTestParticipation } from '@/features/(test-participate)/hooks/useTestParticipation';
import { useTestSession } from '@/features/(test-participate)/hooks/useTestSession';
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

  // 커스텀 훅: 세션 상태 관리 (localStorage + 백엔드 복원)
  const { session, setSession, isSessionRestored } = useTestSession({ testId });

  // 커스텀 훅: 테스트 참여 관련 mutation 로직
  const { handleStart, handleMissionComplete, handleFeedbackSubmit } = useTestParticipation({
    testInfo,
    session,
    setSession,
  });

  // 현재 단계에 따른 프로그레스 계산
  const getCurrentStepNumber = (): number => {
    if (!testInfo) return 0;
    switch (session.currentStep) {
      case 'start':
        return 0;
      case 'mission':
        return session.currentMissionIndex + 1;
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
    switch (session.currentStep) {
      case 'start':
        return '테스트 시작 전';
      case 'mission':
        return `미션 ${session.currentMissionIndex + 1} / ${testInfo.missions.length}`;
      case 'feedback':
        return '전체 피드백';
      case 'complete':
        return '완료';
      default:
        return '';
    }
  };

  // testInfo가 없거나 세션이 복원되지 않았으면 로딩 화면 표시
  if (!testInfo || !isSessionRestored) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  return (
    <>
      {/* 시작 단계는 프로그레스 바 없이 */}
      {session.currentStep === 'start' ? (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
          <TestStartStep testInfo={testInfo} onStart={handleStart} />
        </div>
      ) : session.currentStep === 'complete' ? (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
          <CompleteStep />
        </div>
      ) : (
        <TestParticipateLayout
          currentStep={getCurrentStepNumber()}
          totalSteps={getTotalSteps()}
          stepDescription={getStepDescription()}
        >
          {session.currentStep === 'mission' && (
            <MissionStep
              key={testInfo.missions[session.currentMissionIndex].publicId}
              mission={testInfo.missions[session.currentMissionIndex]}
              missionNumber={session.currentMissionIndex + 1}
              totalMissions={testInfo.missions.length}
              participantId={session.participantId}
              missionResultId={session.currentMissionResultId}
              onMissionResultIdChange={(id) =>
                setSession((prev) => ({ ...prev, currentMissionResultId: id }))
              }
              onNext={handleMissionComplete}
            />
          )}

          {session.currentStep === 'feedback' && (
            <FeedbackStep onSubmit={handleFeedbackSubmit} />
          )}
        </TestParticipateLayout>
      )}
    </>
  );
}
