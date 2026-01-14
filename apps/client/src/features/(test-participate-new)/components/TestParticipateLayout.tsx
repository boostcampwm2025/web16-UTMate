'use client';

import { ReactNode } from 'react';

import { TestProgressBar } from './TestProgressBar';

interface TestParticipateLayoutProps {
  currentStep: number;
  totalSteps: number;
  stepDescription?: string;
  children: ReactNode;
}

export function TestParticipateLayout({
  currentStep,
  totalSteps,
  stepDescription,
  children,
}: TestParticipateLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <TestProgressBar
        currentStep={currentStep}
        totalSteps={totalSteps}
        description={stepDescription}
      />
      <main className="flex flex-1 items-start justify-center px-6 pt-8">{children}</main>
    </div>
  );
}
