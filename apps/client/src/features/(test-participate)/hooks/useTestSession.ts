import { useEffect, useState } from 'react';

import { getParticipantProgress } from '../api';
import type { TestSession } from '../types';

interface UseTestSessionOptions {
  testId: string;
}

/**
 * 테스트 세션 상태를 관리하고 localStorage 및 백엔드에서 저장/복원하는 커스텀 훅
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
  const [isSessionRestored, setIsSessionRestored] = useState(false);

  // 초기 로드 시 백엔드에서 세션 복원 시도
  useEffect(() => {
    const restoreSessionFromBackend = async () => {
      const localSession = loadSessionFromStorage();

      // localStorage에 participantId가 있으면 백엔드에서 최신 상태 가져오기
      if (localSession.participantId) {
        try {
          // TODO: 백엔드 API 준비되면 주석 해제
          // const backendSession = await getParticipantProgress(localSession.participantId);
          // if (backendSession) {
          //   setSession(backendSession);
          // }
        } catch (error) {
          console.error('Failed to restore session from backend:', error);
        }
      }

      setIsSessionRestored(true);
    };

    restoreSessionFromBackend();
  }, [testId]);

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
    isSessionRestored,
  };
}
