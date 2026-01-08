'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import type { TestDetail, TestMission } from '@/features/(test-manage)/types';
import { updateTest } from '@/features/(test-manage)/api';
import { Button } from '@/shared/components/ui/button';

import { BackToWorkspaceButton } from './BackToWorkspaceButton';
import { TestFormSidebar, TestFormStep } from './TestFormSidebar';
import { TestInfoStep } from './TestInfoStep';
import { TestMissionsStep } from './TestMissionsStep';
import { TestSdkStep } from './TestSdkStep';
import { MAX_MISSIONS } from '../constants';

interface TestFormProps {
  initialData: TestDetail;
}

export function TestForm({ initialData }: TestFormProps) {
  const queryClient = useQueryClient();
  const [test, setTest] = useState<TestDetail>(initialData);
  const [step, setStep] = useState<TestFormStep>(TestFormStep.TEST_INFO);

  // 폼 상태
  const [editName, setEditName] = useState(test.name);
  const [editUrl, setEditUrl] = useState(test.integrationUrl);
  const [missions, setMissions] = useState<TestMission[]>(test.missions || []);
  const [selectedMissionIndex, setSelectedMissionIndex] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleNameChange = (value: string) => {
    setEditName(value);
    if (error) setError('');
  };

  const handleUrlChange = (value: string) => {
    setEditUrl(value);
  };

  const handleAddMission = () => {
    // 미션 개수 제한 (최대 5개)
    if (missions.length >= MAX_MISSIONS) {
      setError(`미션은 최대 ${MAX_MISSIONS}개까지만 추가할 수 있습니다.`);
      setTimeout(() => setError(''), 3000);
      return;
    }

    const newMission: TestMission = {
      id: Date.now(), // 임시 ID
      description: '',
      url: '',
      estimatedDuration: undefined,
    };
    setMissions([...missions, newMission]);
    // 새로 추가된 미션을 선택
    setSelectedMissionIndex(missions.length);
  };

  const handleUpdateMission = (id: number, updatedMission: Partial<TestMission>) => {
    setMissions(
      missions.map((mission) => (mission.id === id ? { ...mission, ...updatedMission } : mission)),
    );
  };

  const handleDeleteMission = (id: number) => {
    const deletedIndex = missions.findIndex((mission) => mission.id === id);
    setMissions(missions.filter((mission) => mission.id !== id));

    // 선택된 미션 인덱스 업데이트
    if (selectedMissionIndex > deletedIndex) {
      // 삭제된 미션보다 뒤에 있던 미션을 선택했다면 인덱스 감소
      setSelectedMissionIndex(selectedMissionIndex - 1);
    } else if (selectedMissionIndex === deletedIndex) {
      // 선택된 미션을 삭제했다면 이전 미션 선택 (없으면 0)
      setSelectedMissionIndex(Math.max(0, deletedIndex - 1));
    }
  };

  const handleMoveMission = (fromIndex: number, toIndex: number) => {
    const newMissions = [...missions];
    const [movedMission] = newMissions.splice(fromIndex, 1);
    newMissions.splice(toIndex, 0, movedMission);
    setMissions(newMissions);

    // 선택된 미션 인덱스도 함께 업데이트
    let newSelectedIndex = selectedMissionIndex;

    if (selectedMissionIndex === fromIndex) {
      // 선택된 미션 자체가 이동하는 경우
      newSelectedIndex = toIndex;
    } else if (fromIndex < toIndex) {
      // 아래로 이동하는 경우
      if (selectedMissionIndex > fromIndex && selectedMissionIndex <= toIndex) {
        // 선택된 미션이 이동 범위 내에 있으면 위로 한 칸 이동
        newSelectedIndex = selectedMissionIndex - 1;
      }
    } else {
      // 위로 이동하는 경우
      if (selectedMissionIndex >= toIndex && selectedMissionIndex < fromIndex) {
        // 선택된 미션이 이동 범위 내에 있으면 아래로 한 칸 이동
        newSelectedIndex = selectedMissionIndex + 1;
      }
    }

    setSelectedMissionIndex(newSelectedIndex);
  };

  const handleMissionClick = (missionId: number) => {
    // 미션 인덱스 찾기
    const missionIndex = missions.findIndex((m) => m.id === missionId);
    if (missionIndex === -1) return;

    // 미션 설정 스텝으로 이동
    if (step !== TestFormStep.TEST_MISSIONS) {
      setStep(TestFormStep.TEST_MISSIONS);
    }

    // 해당 미션 선택
    setSelectedMissionIndex(missionIndex);

    // 해당 미션으로 스크롤
    setTimeout(() => {
      const missionElement = document.getElementById(`mission-${missionId}`);
      if (missionElement) {
        missionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleNextStep = async () => {
    // 다음 스텝으로 이동하기 전에 저장
    await handleSave();

    if (step < TestFormStep.TEST_SDK) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > TestFormStep.TEST_INFO) {
      setStep(step - 1);
    }
  };

  const handleSave = async () => {
    // 유효성 검사
    if (step === TestFormStep.TEST_INFO) {
      if (!editName.trim()) {
        setError('테스트 이름을 입력해주세요.');
        return;
      }

      if (editName.length < 2) {
        setError('테스트 이름은 최소 2자 이상이어야 합니다.');
        return;
      }
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // 실제 저장되는 느낌을 주기 위한 의도적인 지연 시작
      const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 600));

      // API 함수를 사용하여 테스트 업데이트
      const updatePromise = updateTest(test.id, {
        name: editName,
        integrationUrl: editUrl,
        missions,
      });

      // 최소 로딩 시간과 API 호출이 모두 완료될 때까지 대기
      const [updatedTest] = await Promise.all([updatePromise, minLoadingTime]);

      setTest(updatedTest);

      // 쿼리 무효화
      await queryClient.invalidateQueries({ queryKey: ['tests', test.id] });
      await queryClient.invalidateQueries({ queryKey: ['tests'] });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '저장에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
      console.error('저장 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayTestName = editName ? editName : test.name;

  return (
    <div className="flex min-h-screen flex-col">
      {/* 헤더 */}
      <div className="border-b bg-white px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackToWorkspaceButton />
            <div>
              <h1 className="text-2xl font-bold">{displayTestName}</h1>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex items-center gap-3">
            {success && <span className="text-sm text-green-600">✓ 저장되었습니다</span>}
            <Button onClick={handleSave} disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              저장
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 레이아웃 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <TestFormSidebar
          currentStep={step}
          missions={missions}
          selectedMissionIndex={selectedMissionIndex}
          onStepChange={setStep}
          onMissionClick={handleMissionClick}
          onAddMission={handleAddMission}
          onDeleteMission={handleDeleteMission}
          onMoveMission={handleMoveMission}
        />

        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-8 py-8">
            {step === TestFormStep.TEST_INFO && (
              <TestInfoStep
                name={editName}
                integrationUrl={editUrl}
                error={error}
                onNameChange={handleNameChange}
                onUrlChange={handleUrlChange}
                onNext={handleNextStep}
              />
            )}

            {step === TestFormStep.TEST_MISSIONS && (
              <TestMissionsStep
                missions={missions}
                selectedMissionIndex={selectedMissionIndex}
                onSelectedMissionIndexChange={setSelectedMissionIndex}
                onAddMission={handleAddMission}
                onUpdateMission={handleUpdateMission}
                onDeleteMission={handleDeleteMission}
                onMoveMission={handleMoveMission}
                onPrev={handlePrevStep}
                onNext={handleNextStep}
              />
            )}

            {step === TestFormStep.TEST_SDK && (
              <TestSdkStep
                test={test}
                onPrev={handlePrevStep}
                onSave={handleSave}
                loading={loading}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
