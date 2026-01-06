'use client';

import { FileText, ListTodo, Code, CheckCircle2 } from 'lucide-react';

import type { TestMission } from '@/features/(test-manage)/types';
import { cn } from '@/shared/utils';

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
    title: '테스트 정보',
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
    description: '테스트 배포 & 실행',
  },
];

interface TestFormSidebarProps {
  currentStep: TestFormStep;
  missions: TestMission[];
  onStepChange: (step: TestFormStep) => void;
  onMissionClick: (missionId: number) => void;
}

export function TestFormSidebar({
  currentStep,
  missions,
  onStepChange,
  onMissionClick,
}: TestFormSidebarProps) {
  return (
    <aside className="w-80 shrink-0 border-r bg-gray-50 p-6">
      <nav className="space-y-3">
        {STEPS.map((item) => {
          const isActive = currentStep === item.step;
          const isMissionStep = item.step === TestFormStep.TEST_MISSIONS;

          return (
            <div key={item.step}>
              <button
                onClick={() => onStepChange(item.step)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors',
                  isActive && 'bg-white shadow-sm ring-2 ring-primary',
                  !isActive && 'hover:bg-gray-100',
                )}
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
                      'text-sm font-semibold',
                      isActive && 'text-blue-900',
                      !isActive && 'text-gray-700',
                    )}
                  >
                    {item.title}
                  </h3>
                  <p className="truncate text-xs text-gray-500">{item.description}</p>
                </div>
              </button>

              {/* 미션 목록 - 미션 설정 스텝의 하위 요소 */}
              {isMissionStep && missions && missions.length > 0 && (
                <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
                  {missions.map((mission, index) => {
                    const hasName = mission.name && mission.name.trim();
                    const displayName = hasName ? mission.name : `미션 ${index + 1}`;

                    return (
                      <button
                        key={mission.id}
                        onClick={() => onMissionClick(mission.id)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-md p-2 text-sm transition-colors',
                          hasName
                            ? 'bg-white hover:bg-gray-50'
                            : 'border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100',
                        )}
                      >
                        <CheckCircle2 className="size-3.5 shrink-0 text-green-500" />
                        <span
                          className={cn(
                            'min-w-0 flex-1 truncate text-left text-xs',
                            hasName ? 'text-gray-700' : 'text-gray-400 italic',
                          )}
                        >
                          {displayName}
                        </span>
                      </button>
                    );
                  })}
                  <p className="px-2 pt-1 text-xs text-gray-500">총 {missions.length}개</p>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
