import { useMemo } from 'react';
import { create, StoreApi, UseBoundStore } from 'zustand';
import { persist } from 'zustand/middleware';

import type { MissionResult, MissionResultFromServer, TestSession, TestStep } from '../types';

export type MissionState = 'ready' | 'recording' | 'completed' | 'feedback';

interface TestParticipateState extends TestSession {
  // 현재 미션의 UI 상태 (복원용)
  currentMissionState: MissionState;

  // 이어하기 관련 상태 (persist 안 함)
  needsResume: boolean;

  // 서버에서 받은 미션 결과 목록 (미션 시작 시 생성됨)
  serverMissionResults: MissionResultFromServer[];

  // Actions
  startTest: (participantId: string, missionResults: MissionResultFromServer[]) => void;
  setMissionState: (state: MissionState) => void;
  setMissionResultId: (id: string) => void;
  completeMission: (missionResult: MissionResult) => void;
  submitFeedback: (feedback: string) => void;
  clearSession: () => void;
  resetToStart: () => void;
  confirmResume: () => void;
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
        needsResume: false, // 초기값 (onRehydrateStorage에서 설정)

        // 테스트 시작
        startTest: (participantId: string, missionResults: MissionResultFromServer[]) => {
          // 첫 번째 PENDING 상태의 미션 결과 ID를 현재 미션 결과 ID로 설정
          const firstPendingMission = missionResults.find((mr) => mr.status === 'PENDING');

          set({
            currentStep: 'mission',
            currentMissionIndex: 0,
            currentMissionState: 'ready',
            participantId,
            needsResume: false,
            serverMissionResults: missionResults,
            currentMissionResultId: firstPendingMission?.id,
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

          // serverMissionResults에서 총 미션 수 가져오기
          const totalMissions = serverMissionResults.length;

          if (currentMissionIndex < totalMissions - 1) {
            // 다음 미션의 결과 ID 찾기
            const nextMissionResult = serverMissionResults[currentMissionIndex + 1];

            // 다음 미션으로
            set({
              missionResults: newMissionResults,
              currentMissionIndex: currentMissionIndex + 1,
              currentMissionState: 'ready',
              currentMissionResultId: nextMissionResult?.id,
            });
          } else {
            // 모든 미션 완료 → 피드백 단계로
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
          set({ ...initialState, needsResume: false });
        },

        // 시작 화면으로 리셋 (데이터는 유지)
        resetToStart: () => {
          set({ currentStep: 'start' });
        },

        // 이어하기 확인
        confirmResume: () => {
          set({ needsResume: false });
        },
      }),
      {
        name: `test-participate-${testId}`, // testId별 localStorage key
        partialize: (state) => ({
          // persist할 필드만 선택 (actions 제외)
          currentStep: state.currentStep,
          currentMissionIndex: state.currentMissionIndex,
          currentMissionState: state.currentMissionState,
          missionResults: state.missionResults,
          overallFeedback: state.overallFeedback,
          participantId: state.participantId,
          currentMissionResultId: state.currentMissionResultId,
          serverMissionResults: state.serverMissionResults,
        }),
        onRehydrateStorage: () => (state) => {
          // localStorage에서 복원된 후 실행
          if (state) {
            // 진행 중인 세션이 있고 아직 완료하지 않았다면 이어하기 필요
            const hasProgress =
              state.currentStep !== 'start' &&
              state.currentStep !== 'complete' &&
              state.participantId;

            if (hasProgress) {
              state.needsResume = true;
            }
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
