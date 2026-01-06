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
}

export function TestFormSidebar({ currentStep, missions, onStepChange }: TestFormSidebarProps) {
  return (
    <aside className="w-80 shrink-0 border-r bg-gray-50 p-6">
      <nav className="space-y-6">
        {/* 스텝 목록 - 첫 번째와 두 번째만 */}
        <div className="space-y-3">
          {STEPS.slice(0, 2).map((item) => {
            const isActive = currentStep === item.step;

            return (
              <button
                key={item.step}
                onClick={() => onStepChange(item.step)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors',
                  isActive && 'bg-white shadow-sm ring-2 ring-blue-500',
                  !isActive && 'hover:bg-gray-100',
                )}
              >
                <div
                  className={cn(
                    'flex size-12 shrink-0 items-center justify-center rounded-full',
                    isActive && 'bg-blue-500 text-white',
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
            );
          })}
        </div>

        {/* 미션 목록 */}
        {missions && missions.length > 0 && (
          <div className="space-y-3 border-t pt-4">
            <h4 className="text-xs font-semibold uppercase text-gray-500">미션 목록</h4>
            <div className="space-y-2">
              {missions.map((mission, index) => (
                <div
                  key={mission.id}
                  className={cn(
                    'flex items-center gap-2 rounded-lg p-2 text-sm',
                    mission.name ? 'bg-white' : 'border border-dashed border-gray-300 bg-gray-50',
                  )}
                >
                  <CheckCircle2 className="size-4 shrink-0 text-green-500" />
                  <span className="min-w-0 flex-1 truncate text-gray-700">
                    {mission.name || `미션 ${index + 1} (이름 없음)`}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">총 {missions.length}개의 미션</p>
          </div>
        )}

        {/* 스텝 목록 - 세 번째 (SDK 연동) */}
        <div className="space-y-3 border-t pt-4">
          {STEPS.slice(2).map((item) => {
            const isActive = currentStep === item.step;

            return (
              <button
                key={item.step}
                onClick={() => onStepChange(item.step)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors',
                  isActive && 'bg-white shadow-sm ring-2 ring-blue-500',
                  !isActive && 'hover:bg-gray-100',
                )}
              >
                <div
                  className={cn(
                    'flex size-12 shrink-0 items-center justify-center rounded-full',
                    isActive && 'bg-blue-500 text-white',
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
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
