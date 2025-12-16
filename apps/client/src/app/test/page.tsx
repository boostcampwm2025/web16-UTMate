'use client';

import { useState } from 'react';

import MissionPanel from '@/components/test/MissionPanel';
import MissionSidebar from '@/components/test/MissionSidebar';
import TestHeader from '@/components/test/TestHeader';
import { MissionStatusMap, TestWithMissions } from '@/types/test';

// Mock data - 나중에 API로 대체
const MOCK_TEST: TestWithMissions = {
  id: 1,
  ownerId: 'user-123',
  testUrl: 'https://example.com',
  title: '사용성 테스트',
  description: '제품의 주요 기능 테스트',
  status: 'ACTIVE',
  maxParticipants: 100,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  missions: [
    {
      id: 1,
      testId: 1,
      orderNumber: 1,
      title: '홈페이지 탐색',
      description: '홈페이지에 접속하여\n주요 기능을 확인해보세요.',
      successCriteriaType: 'URL_CHANGE',
      successCriteriaValue: 'https://example.com',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      testId: 1,
      orderNumber: 2,
      title: '로그인 버튼 클릭',
      description: '로그인 버튼을 찾아\n클릭해주세요.',
      successCriteriaType: 'BUTTON_CLICK',
      successCriteriaValue: '#login-button',
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      testId: 1,
      orderNumber: 3,
      title: '이메일 입력',
      description: '이메일 입력란에\n이메일을 입력해주세요.',
      successCriteriaType: 'INPUT_FILL',
      successCriteriaValue: 'input[type="email"]',
      createdAt: new Date().toISOString(),
    },
    {
      id: 4,
      testId: 1,
      orderNumber: 4,
      title: '페이지 스크롤',
      description: '페이지를 끝까지\n스크롤해주세요.',
      successCriteriaType: 'SCROLL',
      successCriteriaValue: '100%',
      createdAt: new Date().toISOString(),
    },
    {
      id: 5,
      testId: 1,
      orderNumber: 5,
      title: '결제 완료',
      description: '결제 프로세스를 완료하고\n완료 페이지로 이동해주세요.',
      successCriteriaType: 'URL_CHANGE',
      successCriteriaValue: '/checkout/complete',
      createdAt: new Date().toISOString(),
    },
  ],
};

export default function TestPage() {
  const [test] = useState<TestWithMissions>(MOCK_TEST);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [missionStatuses, setMissionStatuses] = useState<MissionStatusMap>(() => {
    const statuses: MissionStatusMap = {};
    test.missions.forEach((mission, index) => {
      statuses[mission.id] = index === 0 ? 'in_progress' : 'pending';
    });
    return statuses;
  });

  const currentMission = test.missions[currentMissionIndex];

  const handleMissionComplete = () => {
    setMissionStatuses((prev) => ({
      ...prev,
      [currentMission.id]: 'completed',
    }));

    // Move to next mission
    if (currentMissionIndex < test.missions.length - 1) {
      const nextMissionId = test.missions[currentMissionIndex + 1].id;
      setMissionStatuses((prev) => ({
        ...prev,
        [nextMissionId]: 'in_progress',
      }));
      setCurrentMissionIndex(currentMissionIndex + 1);
    } else {
      // Test completed
      alert('테스트를 완료했습니다! 🎉');
    }
  };

  const handleMissionSkip = () => {
    setMissionStatuses((prev) => ({
      ...prev,
      [currentMission.id]: 'skipped',
    }));

    // Move to next mission
    if (currentMissionIndex < test.missions.length - 1) {
      const nextMissionId = test.missions[currentMissionIndex + 1].id;
      setMissionStatuses((prev) => ({
        ...prev,
        [nextMissionId]: 'in_progress',
      }));
      setCurrentMissionIndex(currentMissionIndex + 1);
    } else {
      // Test completed with some skipped
      alert('테스트를 완료했습니다.');
    }
  };

  const handleQuit = () => {
    if (confirm('정말 테스트를 종료하시겠습니까?')) {
      window.location.href = '/';
    }
  };

  const handleMissionClick = (missionId: number) => {
    const index = test.missions.findIndex((m) => m.id === missionId);
    if (index !== -1 && missionStatuses[missionId] !== 'skipped') {
      setCurrentMissionIndex(index);
    }
  };

  // const handleProductEvent = (event: { type: string; data: unknown }) => {
  //   console.log('[TestPage] Product event:', event);
  //   // TODO: 이벤트 수집 및 분석
  //   // - 클릭 이벤트
  //   // - 네비게이션 이벤트
  //   // - 입력 이벤트 등
  // };

  return (
    <div className="flex flex-col h-screen bg-white">
      <TestHeader testName={test.title} />

      <div className="flex flex-1 overflow-hidden">
        <MissionSidebar
          missions={test.missions}
          missionStatuses={missionStatuses}
          currentMissionId={currentMission.id}
          onMissionClick={handleMissionClick}
        />

        <MissionPanel
          test={test}
          currentMission={currentMission}
          missionStatuses={missionStatuses}
          onComplete={handleMissionComplete}
          onSkip={handleMissionSkip}
          onQuit={handleQuit}
        />
      </div>
    </div>
  );
}
