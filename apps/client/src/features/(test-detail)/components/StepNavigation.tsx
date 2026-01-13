import { Loader2 } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

import { TestFormStep } from './TestFormSidebar';

interface StepNavigationProps {
  currentStep: TestFormStep;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
}

export function StepNavigation({
  currentStep,
  loading,
  onPrev,
  onNext,
  onSave,
}: StepNavigationProps) {
  const isFirstStep = currentStep === TestFormStep.TEST_INFO;
  const isLastStep = currentStep === TestFormStep.TEST_SDK;

  return (
    <div className="shrink-0 border-t bg-white px-8 py-4">
      <div className="mx-auto flex max-w-4xl justify-between">
        {!isFirstStep ? (
          <Button variant="outline" onClick={onPrev}>
            이전
          </Button>
        ) : (
          <div />
        )}

        {isLastStep ? (
          <Button onClick={onSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            저장하기
          </Button>
        ) : (
          <Button onClick={onNext}>다음</Button>
        )}
      </div>
    </div>
  );
}
