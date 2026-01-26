'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { MissionDetail } from '../types';
import {
  ListOrdered,
  Info,
  Link,
  Clock,
  TrendingDown,
  CheckCircle2,
  Timer,
  MousePointerClick,
} from 'lucide-react';

function formatDuration(minutes: number | undefined | null): string {
  if (minutes == null || isNaN(minutes)) return '-';
  if (minutes < 60) return `${Math.round(minutes)}분`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
}

export function MissionInfo({ missionLogs }: MissionInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="">미션 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          <MissionInfoItem
            icon={<ListOrdered size={18} />}
            title="미션 순서"
            value={`${missionLogs.missionOrder + 1}번째 미션`}
          />
          <MissionInfoItem icon={<Info size={18} />} title="미션 이름" value={missionLogs.name} />
          <MissionInfoItem
            icon={<Clock size={18} />}
            title="예상 소요 시간"
            value={formatDuration(missionLogs.estimatedDuration)}
          />

          <MissionInfoItem
            icon={<Info size={18} />}
            title="미션 설명"
            value={missionLogs.description || '등록된 설명이 없습니다.'}
            isFullWidth
          />

          <MissionInfoItem
            icon={<Link size={18} />}
            title="연결된 URL"
            value={
              <a
                href={missionLogs.missionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 transition-all hover:underline"
              >
                {missionLogs.missionUrl}
              </a>
            }
            isFullWidth
          />

          <MissionInfoItem
            icon={<CheckCircle2 size={18} className="text-green-500" />}
            title="성공률"
            value={
              <div className="flex items-center gap-3">
                <span>{missionLogs.successRate}%</span>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${missionLogs.successRate}%` }}
                  />
                </div>
              </div>
            }
          />
          <MissionInfoItem
            icon={<TrendingDown size={18} className="text-red-400" />}
            title="이탈률"
            value={`${missionLogs.dropRate}%`}
          />
          <MissionInfoItem
            icon={<Timer size={18} />}
            title="평균 소요 시간"
            value={formatDuration(
              missionLogs.averageDuration != null ? missionLogs.averageDuration / 1000 / 60 : null,
            )}
          />
          <MissionInfoItem
            icon={<Timer size={18} />}
            title="평균 유휴 시간"
            value={formatDuration(
              missionLogs.averageIdleTime != null ? missionLogs.averageIdleTime / 1000 / 60 : null,
            )}
          />
          <MissionInfoItem
            icon={<MousePointerClick size={18} />}
            title="평균 분노 클릭"
            value={
              missionLogs.averageRageClickCount != null
                ? `${missionLogs.averageRageClickCount}회`
                : '-'
            }
          />
          <MissionInfoItem
            icon={<MousePointerClick size={18} />}
            title="마우스 스래싱"
            value={
              missionLogs.averageMouseThrashingCount != null
                ? `${missionLogs.averageMouseThrashingCount}회`
                : '-'
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface MissionInfoProps {
  missionLogs: MissionDetail;
}

function MissionInfoItem({
  icon,
  title,
  value,
  isFullWidth = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  isFullWidth?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1.5 p-2 ${isFullWidth ? 'col-span-full' : ''}`}>
      <div className="flex items-center gap-2 text-gray-500">
        <span className="text-gray-400">{icon}</span>
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="pl-7 text-[16px] font-semibold break-all text-gray-900">{value}</div>
    </div>
  );
}
