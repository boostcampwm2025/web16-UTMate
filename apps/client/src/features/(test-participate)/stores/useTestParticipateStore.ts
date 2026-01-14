import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { MissionResult, TestSession, TestStep } from '../types';

export type MissionState = 'ready' | 'recording' | 'completed' | 'feedback';

interface TestParticipateState extends TestSession {
  // 현재 미션의 UI 상태 (복원용)
  currentMissionState: MissionState;

  // Actions
  startTest: (participantId: string) => void;
  setMissionState: (state: MissionState) => void;
  setMissionResultId: (id: string) => void;
  completeMission: (missionResult: MissionResult) => void;
  submitFeedback: (feedback: string) => void;
  clearSession: () => void;
  resetToStart: () => void;
}

const initialState = {
  currentStep: 'start' as TestStep,
  currentMissionIndex: 0,
  currentMissionState: 'ready' as MissionState,
  missionResults: [],
  overallFeedback: undefined,
  participantId: undefined,
  currentMissionResultId: undefined,
};

export const useTestParticipateStore = create<TestParticipateState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 테스트 시작
      startTest: (participantId: string) => {
        set({
          currentStep: 'mission',
          currentMissionIndex: 0,
          currentMissionState: 'ready',
          participantId,
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
        const { missionResults, currentMissionIndex } = get();
        const newMissionResults = [...missionResults, missionResult];

        // TODO: 백엔드에서 총 미션 수를 받아와야 하지만, 임시로 하드코딩
        const totalMissions = 2;

        if (currentMissionIndex < totalMissions - 1) {
          // 다음 미션으로
          set({
            missionResults: newMissionResults,
            currentMissionIndex: currentMissionIndex + 1,
            currentMissionState: 'ready',
            currentMissionResultId: undefined,
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
        set(initialState);
      },

      // 시작 화면으로 리셋 (데이터는 유지)
      resetToStart: () => {
        set({ currentStep: 'start' });
      },
    }),
    {
      name: 'test-participate-storage', // localStorage key
      partialize: (state) => ({
        // persist할 필드만 선택 (actions 제외)
        currentStep: state.currentStep,
        currentMissionIndex: state.currentMissionIndex,
        currentMissionState: state.currentMissionState,
        missionResults: state.missionResults,
        overallFeedback: state.overallFeedback,
        participantId: state.participantId,
        currentMissionResultId: state.currentMissionResultId,
      }),
    }
  )
);
