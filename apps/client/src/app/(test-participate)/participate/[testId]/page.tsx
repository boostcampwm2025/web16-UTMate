'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';

import {
  completeTestParticipation,
  getTestForParticipation,
  startTestParticipation,
  submitMissionResult,
} from '@/features/(test-participate-new)/api';
import { CompleteStep } from '@/features/(test-participate-new)/components/CompleteStep';
import { FeedbackStep } from '@/features/(test-participate-new)/components/FeedbackStep';
import { MissionStep } from '@/features/(test-participate-new)/components/MissionStep';
import { TestParticipateLayout } from '@/features/(test-participate-new)/components/TestParticipateLayout';
import { TestStartStep } from '@/features/(test-participate-new)/components/TestStartStep';
import { TestUnavailable } from '@/features/(test-participate-new)/components/TestUnavailable';
import type { MissionResult, TestInfo, TestSession } from '@/features/(test-participate-new)/types';

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
  const { data: testInfo, isLoading } = useQuery({
    queryKey: ['test', testId],
    queryFn: async () => {
      // 임시로 Mock 데이터 반환
      return MOCK_TEST;
    },
  });

  // TODO: Hook 순서 문제 해결 필요 - 조건부 return을 모든 Hook 선언 이후로 이동
  // // 로딩 중
  // if (isLoading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-gray-50">
  //       <div className="text-muted-foreground">로딩 중...</div>
  //     </div>
  //   );
  // }

  // // 테스트를 찾을 수 없음
  // if (!testInfo) {
  //   notFound();
  // }

  // // 테스트가 참여 불가능한 상태
  // if (testInfo.status !== 'ACTIVE') {
  //   return <TestUnavailable status={testInfo.status} />;
  // }

  // 세션 상태 관리
  const [session, setSession] = useState<TestSession>({
    currentStep: 'start',
    currentMissionIndex: 0,
    missionResults: [],
    overallFeedback: undefined,
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

  // 시작 버튼 클릭
  const handleStart = () => {
    startTestMutation.mutate();
  };

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

  // 미션 완료 (다음 버튼 클릭 시 MissionStep에서 호출됨)
  const handleMissionComplete = (completed: boolean, feedback?: string, missionResultId?: string) => {
    // Mock 모드에서는 missionResultId가 임시로 생성되므로 항상 존재
    submitMissionMutation.mutate({
      missionResultId: missionResultId || 'temp',
      completed,
      feedback
    });
  };

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
        testId,
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

  // 전체 피드백 제출
  const handleFeedbackSubmit = (feedback: string) => {
    completeTestMutation.mutate(feedback);
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
