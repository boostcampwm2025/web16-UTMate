'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { MissionDetail } from '../types';
import { ListOrdered, Info, Link, Clock } from 'lucide-react';

function MissionInfoItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
      <span className="text-xl text-blue-500">{icon}</span>
      <div>
        <div className="text-xs font-semibold text-gray-500">{title}</div>
        <div className="text-base font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
}

interface MissionInfoProps {
  missionLogs: MissionDetail;
}

export function MissionInfo({ missionLogs }: MissionInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>미션 정보</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <MissionInfoItem
          icon={<ListOrdered size={20} />}
          title="미션 순서"
          value={missionLogs.missionOrder + 1}
        />
        <MissionInfoItem icon={<Info size={20} />} title="미션 이름" value={missionLogs.name} />
        <MissionInfoItem
          icon={<Info size={20} />}
          title="미션 설명"
          value={missionLogs.description}
        />
        <MissionInfoItem
          icon={<Link size={20} />}
          title="미션 URL"
          value={missionLogs.missionUrl}
        />
        <MissionInfoItem
          icon={<Clock size={20} />}
          title="예상 소요 시간"
          value={missionLogs.estimatedDuration}
        />
      </CardContent>
    </Card>
  );
}
