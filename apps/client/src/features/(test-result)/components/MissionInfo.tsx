'use client';

import { Info, Link, Clock } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatDurationFromMilliSeconds } from '../utils/format';
import { MetricCard } from './MetricCard';
import type { MissionDetail } from '../types';

interface MissionInfoProps {
  missionLogs: MissionDetail;
}

export function MissionInfo({ missionLogs }: MissionInfoProps) {
  return (
    <Card className="gap-2 overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">미션 정보</CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10">
              {missionLogs.missionOrder + 1}번째 미션
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-0">
        {/* Mission Overview Section */}
        <div className="grid gap-4 px-6 md:grid-cols-2">
          <div className="flex flex-col justify-between">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
              <Info size={16} /> 미션 정보
            </h3>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold text-gray-900">{missionLogs.name}</p>
              <p className="rounded-lg bg-gray-50 p-4 text-base leading-relaxed text-gray-700">
                {missionLogs.description || '등록된 설명이 없습니다.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-2">
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                <Clock size={16} /> 예상 소요 시간
              </h3>
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-900">
                {formatDurationFromMilliSeconds(missionLogs.estimatedDuration)}
              </div>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                <Link size={16} /> 연결된 URL
              </h3>
              <a
                href={missionLogs.missionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
              >
                <div className="group-hover:text-primary flex-1 truncate text-sm font-medium text-gray-700">
                  {missionLogs.missionUrl}
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Performance Metrics Section */}
        <div className="px-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            성과 지표
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            <MetricCard
              label="성공률"
              value={`${missionLogs.successRate}%`}
              description={
                <MetricExplanation
                  formula="성공한 사용자 수 ÷ 전체 사용자 수 × 100"
                  description="미션을 성공적으로 완료한 사용자의 비율입니다. 성공률이 높을수록 미션의 난이도가 적절하다는 것을 의미해요."
                />
              }
            />
            <MetricCard
              label="이탈률"
              value={`${missionLogs.dropRate}%`}
              description={
                <MetricExplanation
                  formula="이탈한 사용자 수 ÷ 전체 사용자 수 × 100"
                  description="미션을 완료하지 못하고 중단한 사용자의 비율입니다. 이탈률이 높다면 미션이 너무 어렵거나 오류가 있을 수 있어요."
                />
              }
            />
            <MetricCard
              label="평균 소요 시간"
              value={formatDurationFromMilliSeconds(missionLogs.averageDuration)}
              description={
                <MetricExplanation
                  formula="∑(완료 미션 소요 시간) ÷ 완료 미션 수"
                  description="사용자들이 미션을 완료하는 데 걸린 평균 시간입니다."
                />
              }
            />

            <MetricCard
              label="평균 유휴 시간"
              value={formatDurationFromMilliSeconds(missionLogs.averageIdleTime)}
              description={
                <MetricExplanation
                  formula="∑(10초 이상 무동작 시간) ÷ 전체 미션 수"
                  description="사용자가 아무런 행동을 하지 않고 머무른 평균 시간입니다. 고민하거나 길을 잃었을 가능성이 있어요."
                />
              }
            />

            <MetricCard
              label="평균 분노 클릭"
              value={`${missionLogs.averageRageClickCount.toFixed(1)}회`}
              description={
                <MetricExplanation
                  formula="1초 이내 3회 이상 클릭 (거리 100px 이내)"
                  description="사용자가 답답함을 느껴 빠르게 여러 번 클릭한 평균 횟수입니다. 시스템 반응이 느리거나 클릭이 안 된다고 느낄 때 발생해요."
                />
              }
            />

            <MetricCard
              label="평균 마우스 스래싱"
              value={`${missionLogs.averageMouseThrashingCount.toFixed(1)}회`}
              description={
                <MetricExplanation
                  formula="1초 이내 급격한 마우스 이동 (거리 500px, 굴곡도 5 이상)"
                  description="사용자가 마우스를 의도 없이 빠르게 흔든 평균 횟수입니다. 혼란스러워하거나 무엇을 해야 할지 모를 때 나타날 수 있어요."
                />
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricExplanation({ formula, description }: { formula: string; description: string }) {
  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-center rounded-xl bg-slate-100 px-4 py-8 text-center">
        <span className="text-lg leading-relaxed font-medium break-keep text-slate-700">
          {formula}
        </span>
      </div>
      <p className="text-base leading-relaxed break-keep text-gray-600">{description}</p>
    </div>
  );
}
