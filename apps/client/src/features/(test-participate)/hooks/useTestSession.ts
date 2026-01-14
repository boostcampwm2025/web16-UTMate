import { useEffect, useState } from 'react';

import type { TestSession } from '../types';

interface UseTestSessionOptions {
  testId: string;
}

/**
 * 테스트 세션 상태를 관리하고 localStorage에 저장/복원하는 커스텀 훅
 */
export function useTestSession({ testId }: UseTestSessionOptions) {
  const getStorageKey = () => `test-session-${testId}`;

  const loadSessionFromStorage = (): TestSession => {
    if (typeof window === 'undefined') {
      return {
        currentStep: 'start',
        currentMissionIndex: 0,
        missionResults: [],
        overallFeedback: undefined,
      };
    }

    try {
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load session from localStorage:', error);
    }

    return {
      currentStep: 'start',
      currentMissionIndex: 0,
      missionResults: [],
      overallFeedback: undefined,
    };
  };

  const [session, setSession] = useState<TestSession>(loadSessionFromStorage);

  // 세션이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(getStorageKey(), JSON.stringify(session));
      } catch (error) {
        console.error('Failed to save session to localStorage:', error);
      }
    }
  }, [session, testId]);

  // 세션 초기화 (테스트 완료 후 등)
  const clearSession = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(getStorageKey());
      } catch (error) {
        console.error('Failed to clear session from localStorage:', error);
      }
    }
    setSession({
      currentStep: 'start',
      currentMissionIndex: 0,
      missionResults: [],
      overallFeedback: undefined,
    });
  };

  return {
    session,
    setSession,
    clearSession,
  };
}
