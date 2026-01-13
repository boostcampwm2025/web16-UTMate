'use client';

import { Progress } from '@/shared/components/ui/progress';

interface TestProgressBarProps {
  currentStep: number;
  totalSteps: number;
  description?: string;
}

export function TestProgressBar({ currentStep, totalSteps, description }: TestProgressBarProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full space-y-3 border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {currentStep} / {totalSteps} ({percentage}%)
          </p>
          {description && <p className="text-muted-foreground text-xs">{description}</p>}
        </div>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
