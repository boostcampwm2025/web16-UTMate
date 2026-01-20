import { useMemo } from 'react';
import { create, StoreApi, UseBoundStore } from 'zustand';
import { persist } from 'zustand/middleware';

import type { MissionResult, MissionResultFromServer, TestSession, TestStep } from '../types';

export type MissionState = 'ready' | 'recording' | 'completed' | 'feedback';

interface TestParticipateState extends TestSession {
  // 현재 미션의 UI 상태
  currentMissionState: MissionState;

  // 이어하기 관련 상태
  needsResume: boolean;
  isLoadingResume: boolean;

  // 서버에서 받은 미션 결과 목록 (미션 시작 시 생성됨)
  serverMissionResults: MissionResultFromServer[];

  // Actions
  startTest: (participantId: string, missionResults: MissionResultFromServer[]) => void;
  resumeTest: (missionResults: MissionResultFromServer[], totalMissions: number) => void;
  setMissionState: (state: MissionState) => void;
  setMissionResultId: (id: string) => void;
  completeMission: (missionResult: MissionResult) => void;
  submitFeedback: (feedback: string) => void;
  clearSession: () => void;
  resetToStart: () => void;
  setLoadingResume: (loading: boolean) => void;
}

const initialState = {
  currentStep: 'start' as TestStep,
  currentMissionIndex: 0,
  currentMissionState: 'ready' as MissionState,
  missionResults: [] as MissionResult[],
  overallFeedback: undefined,
  participantId: undefined,
  currentMissionResultId: undefined,
  serverMissionResults: [] as MissionResultFromServer[],
};

// testId별 store 인스턴스를 캐시
const storeCache = new Map<string, UseBoundStore<StoreApi<TestParticipateState>>>();

// testId별 store 생성 함수
function createTestParticipateStore(testId: string) {
  return create<TestParticipateState>()(
    persist(
      (set, get) => ({
        ...initialState,
        needsResume: false,
        isLoadingResume: false,

        // 테스트 시작 (새로 시작)
        startTest: (participantId: string, missionResults: MissionResultFromServer[]) => {
          const firstPendingMission = missionResults.find((mr) => mr.status === 'PENDING');

          set({
            currentStep: 'mission',
            currentMissionIndex: 0,
            currentMissionState: 'ready',
            participantId,
            needsResume: false,
            isLoadingResume: false,
            serverMissionResults: missionResults,
            currentMissionResultId: firstPendingMission?.id,
            missionResults: [],
          });
        },

        // 이어하기 (서버에서 받은 상태로 복원)
        resumeTest: (missionResults: MissionResultFromServer[], totalMissions: number) => {
          // 완료된 미션 수 계산 (PENDING이 아닌 것들)
          const completedCount = missionResults.filter(
            (mr) => mr.status === 'SUCCESS' || mr.status === 'FAILED'
          ).length;

          // 첫 번째 PENDING 미션 찾기
          const firstPendingMission = missionResults.find((mr) => mr.status === 'PENDING');
          const firstInProgressMission = missionResults.find((mr) => mr.status === 'IN_PROGRESS');

          // IN_PROGRESS가 있으면 그것부터, 없으면 첫 PENDING부터
          const currentMission = firstInProgressMission || firstPendingMission;
          const currentIndex = currentMission
            ? missionResults.findIndex((mr) => mr.id === currentMission.id)
            : completedCount;

          // 모든 미션이 완료되었으면 피드백 단계로
          const allCompleted = completedCount === totalMissions;

          // 완료된 미션들의 결과 생성
          const completedMissionResults: MissionResult[] = missionResults
            .filter((mr) => mr.status === 'SUCCESS' || mr.status === 'FAILED')
            .map((mr) => ({
              missionPublicId: mr.missionId,
              completed: mr.status === 'SUCCESS',
            }));

          set({
            currentStep: allCompleted ? 'feedback' : 'mission',
            currentMissionIndex: currentIndex,
            currentMissionState: firstInProgressMission ? 'ready' : 'ready',
            needsResume: false,
            isLoadingResume: false,
            serverMissionResults: missionResults,
            currentMissionResultId: currentMission?.id,
            missionResults: completedMissionResults,
          });
        },

        // 미션 상태 변경 (ready → recording → completed → feedback)
        setMissionState: (state: MissionState) => {
          set({ currentMissionState: state });
        },

        // 미션 결과 ID 설정
        setMissionResultId: (id: string) => {
          set({ currentMissionResultId: id });
        },

        // 미션 완료 및 다음 미션으로 이동
        completeMission: (missionResult: MissionResult) => {
          const { missionResults, currentMissionIndex, serverMissionResults } = get();
          const newMissionResults = [...missionResults, missionResult];

          const totalMissions = serverMissionResults.length;

          if (currentMissionIndex < totalMissions - 1) {
            const nextMissionResult = serverMissionResults[currentMissionIndex + 1];

            set({
              missionResults: newMissionResults,
              currentMissionIndex: currentMissionIndex + 1,
              currentMissionState: 'ready',
              currentMissionResultId: nextMissionResult?.id,
            });
          } else {
            set({
              missionResults: newMissionResults,
              currentStep: 'feedback',
              currentMissionState: 'ready',
            });
          }
        },

        // 전체 피드백 제출 및 완료
        submitFeedback: (feedback: string) => {
          set({
            overallFeedback: feedback,
            currentStep: 'complete',
          });
        },

        // 세션 초기화 (localStorage도 삭제)
        clearSession: () => {
          set({ ...initialState, needsResume: false, isLoadingResume: false });
        },

        // 시작 화면으로 리셋 (데이터는 유지)
        resetToStart: () => {
          set({ currentStep: 'start' });
        },

        // 이어하기 로딩 상태 설정
        setLoadingResume: (loading: boolean) => {
          set({ isLoadingResume: loading });
        },
      }),
      {
        name: `test-participate-${testId}`, // testId별 localStorage key
        partialize: (state) => ({
          // localStorage에는 participantId만 저장
          // 나머지 상태는 서버에서 가져옴
          participantId: state.participantId,
        }),
        onRehydrateStorage: () => (state) => {
          // localStorage에서 복원된 후 실행
          if (state && state.participantId) {
            // participantId가 있으면 이어하기 필요
            state.needsResume = true;
            state.isLoadingResume = true;
          }
        },
      }
    )
  );
}

// testId별 store 인스턴스 가져오기 (캐시 사용)
export function getTestParticipateStore(testId: string) {
  if (!storeCache.has(testId)) {
    storeCache.set(testId, createTestParticipateStore(testId));
  }
  return storeCache.get(testId)!;
}

// React 컴포넌트에서 사용할 hook
export function useTestParticipateStore(testId: string) {
  const store = useMemo(() => getTestParticipateStore(testId), [testId]);
  return store;
}

// 타입 export
export type { TestParticipateState };
