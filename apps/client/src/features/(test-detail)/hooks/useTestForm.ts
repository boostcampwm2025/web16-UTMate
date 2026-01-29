'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import type { TestDetail } from '@/features/(test-manage)/types';
import { updateTest } from '@/shared/api/test';
import type { UpdateTestMission } from '@/shared/api/test';
import type { Interest } from '@/features/(auth)/types';

import { TestFormStep } from '../components/TestFormSidebar';
import { testFormSchema, type TestFormValues } from '../schemas/testForm';
import { MAX_MISSIONS } from '../constants';

export function useTestForm(initialData: TestDetail) {
  const router = useRouter();

  // UI 상태
  const [step, setStep] = useState<TestFormStep>(TestFormStep.TEST_INFO);
  const [selectedMissionIndex, setSelectedMissionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 타겟 페르소나 상태 (initialData에서 초기값 설정)
  // 성별과 연령대는 전체 선택이 기본값, 관심사는 빈 배열(선택사항)
  const [targetGenders, setTargetGenders] = useState<string[]>(initialData.targetGenders || []);
  const [targetAges, setTargetAges] = useState<string[]>(initialData.targetAges || []);
  const [targetInterests, setTargetInterests] = useState<Interest[]>(
    initialData.targetInterests || [],
  );
  const [isPublic, setIsPublic] = useState<boolean>(initialData.isPublic);

  // react-hook-form 설정
  const form = useForm<TestFormValues>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      title: initialData.title,
      description: initialData.description,
      url: initialData.url || 'https://', // 빈 값이면 https:// 기본값
      missions:
        initialData.missions?.map((mission) => ({
          publicId: mission.publicId,
          order: mission.order,
          name: mission.name,
          description: mission.description,
          missionUrl: mission.missionUrl || initialData.url || 'https://', // 빈 값이면 https:// 기본값
          estimatedDuration: mission.estimatedDuration,
        })) || [],
      // 타겟 페르소나 설정
      isPublic: initialData.isPublic || false,
      targetGenders: initialData.targetGenders || [],
      targetAges: initialData.targetAges || [],
      targetInterests: initialData.targetInterests || [],
    },
    mode: 'onChange',
  });

  const { control, handleSubmit, watch, trigger, setFocus, formState } = form;

  // useFieldArray로 missions 관리
  const fieldArray = useFieldArray({
    control,
    name: 'missions',
  });

  const { fields, append, remove, move } = fieldArray;

  const watchedTitle = watch('title');
  const watchedMissions = watch('missions');
  const watchUrl = watch('url');

  // === Mission Handlers ===
  const handleAddMission = () => {
    if (fields.length >= MAX_MISSIONS) {
      return;
    }

    append({
      publicId: `temp-${Date.now()}`,
      order: fields.length,
      name: '',
      description: '',
      missionUrl: watchUrl || 'https://', // 기본값으로 테스트 URL 설정
      estimatedDuration: 0,
    });
    setSelectedMissionIndex(fields.length);
  };

  const handleDeleteMission = (publicId: string) => {
    const deletedIndex = fields.findIndex((field) => field.publicId === publicId);
    if (deletedIndex === -1) return;

    remove(deletedIndex);

    if (selectedMissionIndex > deletedIndex) {
      setSelectedMissionIndex(selectedMissionIndex - 1);
    } else if (selectedMissionIndex === deletedIndex) {
      setSelectedMissionIndex(Math.max(0, deletedIndex - 1));
    }
  };

  const handleMoveMission = (fromIndex: number, toIndex: number) => {
    move(fromIndex, toIndex);

    let newSelectedIndex = selectedMissionIndex;

    if (selectedMissionIndex === fromIndex) {
      newSelectedIndex = toIndex;
    } else if (fromIndex < toIndex) {
      if (selectedMissionIndex > fromIndex && selectedMissionIndex <= toIndex) {
        newSelectedIndex = selectedMissionIndex - 1;
      }
    } else {
      if (selectedMissionIndex >= toIndex && selectedMissionIndex < fromIndex) {
        newSelectedIndex = selectedMissionIndex + 1;
      }
    }

    setSelectedMissionIndex(newSelectedIndex);
  };

  const handleMissionClick = (missionPublicId: string) => {
    const missionIndex = fields.findIndex((m) => m.publicId === missionPublicId);
    if (missionIndex === -1) return;

    if (step !== TestFormStep.TEST_MISSIONS) {
      setStep(TestFormStep.TEST_MISSIONS);
    }

    setSelectedMissionIndex(missionIndex);

    setTimeout(() => {
      const missionElement = document.getElementById(`mission-${missionPublicId}`);
      if (missionElement) {
        missionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // === Target Persona Handlers ===
  const handleToggleInterest = (interest: Interest) => {
    setTargetInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );
  };

  // === Step Navigation ===
  const handleNextStep = async () => {
    let isValid = false;

    if (step === TestFormStep.TEST_INFO) {
      isValid = await trigger(['title', 'description', 'url']);
    } else if (step === TestFormStep.TEST_MISSIONS) {
      isValid = await trigger('missions');
    } else {
      isValid = await trigger();
    }

    if (isValid && step < TestFormStep.TEST_SDK) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > TestFormStep.TEST_INFO) {
      setStep(step - 1);
    }
  };

  // === Form Submission ===
  const onSubmit = async (data: TestFormValues) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const missionsWithOrder: UpdateTestMission[] = data.missions.map((mission, index) => ({
        publicId: mission.publicId?.startsWith('temp-') ? undefined : mission.publicId,
        order: index,
        name: mission.name,
        description: mission.description,
        url: mission.missionUrl,
        estimatedDuration: mission.estimatedDuration,
      }));

      await updateTest(initialData.publicId, {
        title: data.title,
        description: data.description,
        url: data.url,
        missions: missionsWithOrder,
        // 타겟 페르소나 설정 추가
        isPublic,
        // 성별/연령대는 필수이므로 항상 전송, 관심사는 선택사항이므로 비어있으면 undefined
        targetGenders,
        targetAges,
        targetInterests,
      });

      await minLoadingTime;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);

      router.push(`/tests/${initialData.publicId}`);
    } catch (err) {
      await minLoadingTime;
      setError(err instanceof Error ? err.message : '저장에 실패했습니다. 다시 시도해주세요.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await handleSubmit(onSubmit)();
  };

  // === Computed Values ===
  const displayTestName = watchedTitle || initialData.title;

  const missionsForSidebar = fields.map((field, index) => ({
    publicId: field.publicId || `temp-${index}`,
    order: index,
    name: watchedMissions[index]?.name || '',
    description: watchedMissions[index]?.description || '',
    missionUrl: watchedMissions[index]?.missionUrl || '',
    estimatedDuration: watchedMissions[index]?.estimatedDuration || 0,
  }));

  return {
    // Form
    form,
    fields,

    // UI State
    step,
    setStep,
    selectedMissionIndex,
    setSelectedMissionIndex,
    loading,
    success,
    error,

    // Computed
    displayTestName,
    missionsForSidebar,

    // Handlers
    handlers: {
      // Mission
      addMission: handleAddMission,
      deleteMission: handleDeleteMission,
      moveMission: handleMoveMission,
      missionClick: handleMissionClick,

      // Step Navigation
      nextStep: handleNextStep,
      prevStep: handlePrevStep,

      // Form
      save: handleSave,

      // Target Persona
      targetGender: targetGenders,
      setTargetGender: setTargetGenders,
      targetAgeGroup: targetAges,
      setTargetAgeGroup: setTargetAges,
      targetInterests,
      toggleInterest: handleToggleInterest,
      isPublic,
      setIsPublic,
    },
  };
}
