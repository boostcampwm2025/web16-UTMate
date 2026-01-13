'use client';

import type { TestDetail } from '@/features/(test-manage)/types';

import { BackToWorkspaceButton } from './BackToWorkspaceButton';
import { SaveButton } from './SaveButton';
import { TestFormSidebar, TestFormStep } from './TestFormSidebar';
import { TestInfoStep } from './TestInfoStep';
import { TestMissionsStep } from './TestMissionsStep';
import { TestSdkStep } from './TestSdkStep';
import { useTestForm } from '../hooks/useTestForm';

interface TestFormProps {
  initialData: TestDetail;
}

export function TestForm({ initialData }: TestFormProps) {
  const {
    form,
    fields,
    step,
    setStep,
    selectedMissionIndex,
    setSelectedMissionIndex,
    loading,
    success,
    displayTestName,
    missionsForSidebar,
    handlers,
  } = useTestForm(initialData);

  const {
    register,
    formState: { errors },
  } = form;

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
          <SaveButton loading={loading} success={success} onSave={handlers.save} />
        </div>
      </div>

      {/* 메인 레이아웃 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <TestFormSidebar
          currentStep={step}
          missions={missionsForSidebar}
          selectedMissionIndex={selectedMissionIndex}
          onStepChange={setStep}
          onMissionClick={handlers.missionClick}
          onAddMission={handlers.addMission}
          onDeleteMission={handlers.deleteMission}
          onMoveMission={handlers.moveMission}
        />

        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-8 py-8">
            {step === TestFormStep.TEST_INFO && (
              <TestInfoStep register={register} errors={errors} onNext={handlers.nextStep} />
            )}

            {step === TestFormStep.TEST_MISSIONS && (
              <TestMissionsStep
                fields={fields}
                selectedMissionIndex={selectedMissionIndex}
                register={register}
                errors={errors}
                onSelectedMissionIndexChange={setSelectedMissionIndex}
                onDeleteMission={handlers.deleteMission}
                onPrev={handlers.prevStep}
                onNext={handlers.nextStep}
              />
            )}

            {step === TestFormStep.TEST_SDK && (
              <TestSdkStep
                testPublicId={initialData.publicId}
                onPrev={handlers.prevStep}
                onSave={handlers.save}
                loading={loading}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
