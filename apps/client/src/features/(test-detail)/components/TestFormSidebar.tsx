'use client';

import { FileText, ListTodo, Code } from 'lucide-react';

import type { TestMission } from '@/features/(test-manage)/types';
import { cn } from '@/shared/utils';

import { SidebarMissionTab } from './SidebarMissionTab';

export enum TestFormStep {
  TEST_INFO = 1,
  TEST_MISSIONS = 2,
  TEST_SDK = 3,
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
  onStepChange: (step: TestFormStep) => void;
  onMissionClick: (missionId: number) => void;
  onAddMission: () => void;
  onDeleteMission: (missionId: number) => void;
  onMoveMission: (fromIndex: number, toIndex: number) => void;
}

export function TestFormSidebar({
  currentStep,
  missions,
  selectedMissionIndex,
  onStepChange,
  onMissionClick,
  onAddMission,
  onDeleteMission,
  onMoveMission,
}: TestFormSidebarProps) {
  return (
    <aside className="w-80 shrink-0 border-r px-4 py-6">
      <nav className="space-y-3">
        {STEPS.map((item) => {
          const isActive = currentStep === item.step;
          const isMissionStep = item.step === TestFormStep.TEST_MISSIONS;

          const handleStepChange = () => {
            onStepChange(item.step);
          };

          return (
            <div key={item.step}>
              <button
                onClick={handleStepChange}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-100"
              >
                <div
                  className={cn(
                    'flex size-12 shrink-0 items-center justify-center rounded-full',
                    isActive && 'bg-primary text-white',
                    !isActive && 'bg-gray-200 text-gray-600',
                  )}
                >
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className={cn(
                      'text-lg font-bold',
                      isActive && 'text-blue-900',
                      !isActive && 'text-gray-700',
                    )}
                  >
                    {item.title}
                  </h3>
                  <p className="truncate text-sm text-gray-500">{item.description}</p>
                </div>
              </button>

              {/* 미션 목록 - 미션 설정 스텝의 하위 요소 */}
              {isMissionStep && (
                <SidebarMissionTab
                  missions={missions}
                  selectedMissionIndex={selectedMissionIndex}
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
