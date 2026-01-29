import { CheckCircle2, Circle, Clock, MinusCircle, XCircle } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils';

import { ParticipantMissionStatus } from '../types';

interface MissionStatusBadgeProps {
  status: ParticipantMissionStatus;
  className?: string;
}

const statusConfig = {
  PENDING: {
    label: '대기',
    className: 'bg-gray-100 text-gray-700 ring-gray-600/20',
    icon: Circle,
  },
  SUCCESS: {
    label: '성공',
    className: 'bg-green-50 text-green-700 ring-green-600/20',
    icon: CheckCircle2,
  },
  FAILED: {
    label: '실패',
    className: 'bg-red-50 text-red-700 ring-red-600/20',
    icon: XCircle,
  },
  IN_PROGRESS: {
    label: '진행중',
    className: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    icon: Clock,
  },
  DROP: {
    label: '이탈',
    className: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    icon: MinusCircle,
  },
} as const;

export function MissionStatusBadge({ status, className }: MissionStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        'gap-1.5 px-2.5 py-0.5 shadow-none ring-1 ring-inset',
        config.className,
        className,
      )}
      variant="secondary"
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}
