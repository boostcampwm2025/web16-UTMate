'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import { CompleteStep } from '@/features/(test-participate-new)/components/CompleteStep';
import { FeedbackStep } from '@/features/(test-participate-new)/components/FeedbackStep';
import { MissionStep } from '@/features/(test-participate-new)/components/MissionStep';
import { TestParticipateLayout } from '@/features/(test-participate-new)/components/TestParticipateLayout';
import { TestStartStep } from '@/features/(test-participate-new)/components/TestStartStep';
import type {
  MissionResult,
  TestInfo,
  TestSession,
  TestStep,
} from '@/features/(test-participate-new)/types';

// TODO: API로 테스트 데이터 가져오기
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

  // TODO: API로 테스트 정보 가져오기
  const [testInfo] = useState<TestInfo>(MOCK_TEST);

  // 세션 상태 관리
  const [session, setSession] = useState<TestSession>({
    currentStep: 'start',
    currentMissionIndex: 0,
    missionResults: [],
    overallFeedback: undefined,
  });

  // 현재 단계에 따른 프로그레스 계산
  const getCurrentStepNumber = (): number => {
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
    return testInfo.missions.length + 2; // 미션들 + 피드백 + 완료
  };

  const getStepDescription = (): string => {
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

  // 시작 버튼 클릭
  const handleStart = () => {
    setSession((prev) => ({
      ...prev,
      currentStep: 'mission',
      currentMissionIndex: 0,
    }));
  };

  // 미션 완료
  const handleMissionComplete = (completed: boolean, feedback?: string) => {
    const missionResult: MissionResult = {
      missionPublicId: testInfo.missions[session.currentMissionIndex].publicId,
      completed,
      feedback,
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
      }));
    } else {
      setSession((prev) => ({
        ...prev,
        currentStep: 'feedback',
      }));
    }
  };

  // 전체 피드백 제출
  const handleFeedbackSubmit = (feedback: string) => {
    setSession((prev) => ({
      ...prev,
      overallFeedback: feedback,
      currentStep: 'complete',
    }));

    // TODO: API로 전체 세션 데이터 제출
    console.log('세션 완료:', {
      testId,
      missionResults: session.missionResults,
      overallFeedback: feedback,
    });
  };

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
              mission={testInfo.missions[session.currentMissionIndex]}
              missionNumber={session.currentMissionIndex + 1}
              totalMissions={testInfo.missions.length}
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
