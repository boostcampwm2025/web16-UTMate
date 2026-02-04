import { AlertCircle, MousePointer, Timer } from 'lucide-react';

interface AnomalyTagsProps {
  totalIdleTime?: number;
  rageClickCount?: number;
  mouseThrashingCount?: number;
  compact?: boolean;
}

export function AnomalyTags({
  totalIdleTime,
  rageClickCount,
  mouseThrashingCount,
  compact = false,
}: AnomalyTagsProps) {
  const anomalies = [];

  // 이상현상 기준값 (필요시 조정 가능)
  const IDLE_THRESHOLD = 5000; // 5초 이상
  const RAGE_CLICK_THRESHOLD = 0; // 1회 이상
  const MOUSE_THRASHING_THRESHOLD = 0; // 1회 이상

  if (totalIdleTime && totalIdleTime > IDLE_THRESHOLD) {
    anomalies.push({
      icon: Timer,
      label: '장시간 대기',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    });
  }

  if (rageClickCount && rageClickCount > RAGE_CLICK_THRESHOLD) {
    anomalies.push({
      icon: MousePointer,
      label: '과도한 클릭',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    });
  }

  if (mouseThrashingCount && mouseThrashingCount > MOUSE_THRASHING_THRESHOLD) {
    anomalies.push({
      icon: AlertCircle,
      label: '불안정한 마우스',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    });
  }

  if (anomalies.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {anomalies.map((anomaly, idx) => {
          const Icon = anomaly.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-1 rounded-full border px-2 py-0.5 ${anomaly.bgColor} ${anomaly.borderColor}`}
              title={anomaly.label}
            >
              <Icon className={`h-3 w-3 ${anomaly.color}`} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {anomalies.map((anomaly, idx) => {
        const Icon = anomaly.icon;
        return (
          <div
            key={idx}
            className={`flex items-center gap-1 rounded-full border px-2 py-1 ${anomaly.bgColor} ${anomaly.borderColor}`}
          >
            <Icon className={`h-3 w-3 ${anomaly.color}`} />
            <span className={`text-xs font-medium ${anomaly.color}`}>{anomaly.label}</span>
          </div>
        );
      })}
    </div>
  );
}
