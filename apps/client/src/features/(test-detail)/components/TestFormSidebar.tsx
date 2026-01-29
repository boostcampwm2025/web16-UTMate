'use client';

import { FileText, ListTodo, Code, Settings, AlertCircle } from 'lucide-react';
import type { FieldErrors } from 'react-hook-form';

import type { TestMission } from '@/features/(test-manage)/types';
import { cn } from '@/shared/utils';

import { SidebarMissionTab } from './SidebarMissionTab';
import type { TestFormValues } from '../schemas/testForm';

export enum TestFormStep {
  TEST_INFO = 1,
  TEST_SETTINGS = 2,
  TEST_MISSIONS = 3,
  TEST_SDK = 4,
}

interface StepItem {
  step: TestFormStep;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const STEPS: StepItem[] = [
  {
    step: TestFormStep.TEST_INFO,
    icon: <FileText className="size-5" />,
    title: '테스트 기본 정보',
    description: '기본 정보 입력',
  },
  {
    step: TestFormStep.TEST_SETTINGS,
    icon: <Settings className="size-5" />,
    title: '테스트 설정',
    description: '타겟 사용자 설정',
  },
  {
    step: TestFormStep.TEST_MISSIONS,
    icon: <ListTodo className="size-5" />,
    title: '미션 설정',
    description: '테스트 미션 구성',
  },
  {
    step: TestFormStep.TEST_SDK,
    icon: <Code className="size-5" />,
    title: 'SDK 연동',
    description: '로그 수집을 위한 SDK 코드 연동',
  },
];

interface TestFormSidebarProps {
  currentStep: TestFormStep;
  missions: TestMission[];
  selectedMissionIndex: number;
  errors: FieldErrors<TestFormValues>;
  onStepChange: (step: TestFormStep) => void;
  onMissionClick: (missionPublicId: string) => void;
  onAddMission: () => void;
  onDeleteMission: (missionPublicId: string) => void;
  onMoveMission: (fromIndex: number, toIndex: number) => void;
}

export function TestFormSidebar({
  currentStep,
  missions,
  selectedMissionIndex,
  errors,
  onStepChange,
  onMissionClick,
  onAddMission,
  onMoveMission,
}: TestFormSidebarProps) {
  return (
    <aside className="w-80 shrink-0 border-r px-4 py-6">
      <nav className="space-y-3">
        {STEPS.map((item) => {
          const isActive = currentStep === item.step;
          const isMissionStep = item.step === TestFormStep.TEST_MISSIONS;

          // 유효성 검사 결과 확인
          let isInvalid = false;
          if (item.step === TestFormStep.TEST_INFO) {
            isInvalid = !!(errors.title || errors.description || errors.url);
          } else if (item.step === TestFormStep.TEST_MISSIONS) {
            isInvalid = !!errors.missions;
          }

          const handleStepChange = () => {
            onStepChange(item.step);
          };

          return (
            <div key={item.step}>
              <button
                onClick={handleStepChange}
                className="group flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-100"
              >
                <div
                  className={cn(
                    'flex size-12 shrink-0 items-center justify-center rounded-full',
                    isActive && 'bg-primary text-white',
                    !isActive && 'bg-gray-200 text-gray-600',
                    isInvalid && !isActive && 'bg-destructive/10 text-destructive',
                    isInvalid && isActive && 'bg-destructive/10 text-destructive',
                  )}
                >
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className={cn(
                      'text-lg font-bold',
                      isActive && !isInvalid && 'text-blue-900',
                      !isActive && !isInvalid && 'text-gray-700',
                      isInvalid && 'text-destructive',
                    )}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={cn('truncate text-sm', isInvalid ? 'text-red-400' : 'text-gray-500')}
                  >
                    {isInvalid ? '필수 입력 사항을 입력해주세요' : item.description}
                  </p>
                </div>
              </button>

              {/* 미션 목록 - 미션 설정 스텝의 하위 요소 */}
              {isMissionStep && (
                <SidebarMissionTab
                  missions={missions}
                  selectedMissionIndex={selectedMissionIndex}
                  errors={errors.missions}
                  onMissionClick={onMissionClick}
                  onAddMission={onAddMission}
                  onMoveMission={onMoveMission}
                />
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
