'use client';

import { useState, useEffect } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getTestByIdClient } from '@/features/(test-detail)/api';
import { QueryBoundary } from '@/shared/components/QueryBoundary';

import { MissionResultDetail } from './MissionResultDetail';
import { TestMissionTab } from './TestMissionTab';

export function TestMissionResults({ testId }: { testId: string }) {
  const [selectedMissionId, setSelectedMissionId] = useState<number>(1);

  // 테스트 상세 정보 (미션 목록 포함)
  const { data: testDetail } = useSuspenseQuery({
    queryKey: ['testDetail', testId],
    queryFn: () => getTestByIdClient(testId),
  });

  const missions = testDetail.missions || [];

  // 초기 선택 미션 설정
  useEffect(() => {
    if (missions.length > 0 && selectedMissionId === null) {
      // publicId가 '1', '2', '3' 형식이므로 직접 숫자로 변환
      const firstMissionId = Number(missions[0].publicId) || missions[0].order + 1;
      setSelectedMissionId(firstMissionId);
    }
  }, [missions, selectedMissionId]);

  return (
    <div className="w-full space-y-4">
      {/* 미션 목록 섹션 */}
      <QueryBoundary>
        <TestMissionTab
          missions={missions}
          selectedMissionId={selectedMissionId}
          onMissionClick={setSelectedMissionId}
        />
      </QueryBoundary>

      {/* 선택된 미션 상세 섹션 */}
      <QueryBoundary>
        <MissionResultDetail testId={testId} selectedMissionId={selectedMissionId} />
      </QueryBoundary>
    </div>
  );
}
