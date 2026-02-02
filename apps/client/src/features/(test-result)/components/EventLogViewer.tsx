import { useState, useMemo } from 'react';
import { Angry, Activity, Hourglass, AlertCircle } from 'lucide-react';
import type { eventWithTime } from '@rrweb/types';

import { EventLogItem } from '@/features/(test-result)/components/EventLogItem';
import type { EventLogDisplayItem } from '@/features/(test-result)/utils/log';
import { groupLogsByType } from '@/features/(test-result)/utils/log';
import type { AnalyzerResult } from '../types';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils';

interface EventLogViewerProps {
  logs: eventWithTime[];
  analysisData?: AnalyzerResult;
  onLogClick: (timestamp: number) => void;
}

type FilterType = 'ALL' | 'ANOMALY' | 'GENERAL';

export function EventLogViewer({ logs, analysisData, onLogClick }: EventLogViewerProps) {
  const [filter, setFilter] = useState<FilterType>('ALL');

  const groupedLogs = useMemo(() => groupLogsByType(logs), [logs]);

  // 전체 로그 중 가장 빠른 시간을 기준 시간으로 설정
  const startTime = useMemo(() => {
    if (logs.length === 0) return 0;
    return logs.reduce(
      (min, log) => (log.timestamp < min ? log.timestamp : min),
      logs[0].timestamp,
    );
  }, [logs]);

  const combinedLogs = useMemo(() => {
    const list: EventLogDisplayItem[] = [];

    // 일반 로그 추가
    groupedLogs.forEach((log) => {
      list.push({
        type: 'rrweb',
        data: log,
        timestamp: log.log.timestamp,
      });
    });

    // 분석 데이터 추가
    if (analysisData) {
      if (analysisData.rageClickCount) {
        analysisData.rageClickCount.forEach((item) => {
          list.push({ type: 'rageClick', data: item, timestamp: item.timestamp });
        });
      }
      if (analysisData.mouseThrashingCount) {
        analysisData.mouseThrashingCount.forEach((item) => {
          list.push({ type: 'mouseThrashing', data: item, timestamp: item.timestamp });
        });
      }
      if (analysisData.idleTime) {
        analysisData.idleTime.forEach((item) => {
          list.push({ type: 'idle', data: item, timestamp: item.timestamp });
        });
      }
    }

    // 시간순 정렬
    return list.sort((a, b) => a.timestamp - b.timestamp);
  }, [groupedLogs, analysisData]);

  const filteredLogs = useMemo(() => {
    if (filter === 'ALL') return combinedLogs;
    if (filter === 'ANOMALY') {
      return combinedLogs.filter(
        (item) =>
          item.type === 'rageClick' || item.type === 'mouseThrashing' || item.type === 'idle',
      );
    }
    if (filter === 'GENERAL') {
      // rrweb 이벤트 전체 필터링
      return combinedLogs.filter((item) => item.type === 'rrweb');
    }
    return combinedLogs;
  }, [combinedLogs, filter]);

  const summary = useMemo(() => {
    if (!analysisData) return null;
    const rage = analysisData.rageClickCount?.length || 0;
    const thrashing = analysisData.mouseThrashingCount?.length || 0;
    const idle = analysisData.idleTime?.length || 0;
    return { rage, thrashing, idle, total: rage + thrashing + idle };
  }, [analysisData]);

  return (
    <div className="flex h-full w-full flex-col space-y-4 p-4">
      {/* 1. 상단 요약 카드 */}
      {summary && summary.total > 0 && (
        <div className="flex flex-col gap-2 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span>발견된 이상현상</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {summary.rage > 0 && (
              <Badge
                variant="outline"
                className="gap-1.5 border px-2 py-1 font-medium text-red-600"
              >
                <Angry className="h-3 w-3" />
                레이지 클릭 {summary.rage}회
              </Badge>
            )}
            {summary.thrashing > 0 && (
              <Badge
                variant="outline"
                className="gap-1.5 border px-2 py-1 font-medium text-orange-600"
              >
                <Activity className="h-3 w-3" />
                마우스 흔들기 {summary.thrashing}회
              </Badge>
            )}
            {summary.idle > 0 && (
              <Badge
                variant="outline"
                className="gap-1.5 border px-2 py-1 font-medium text-blue-600"
              >
                <Hourglass className="h-3 w-3" />
                유휴 시간 {summary.idle}회
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* 2. 필터 탭 */}
      <div className="grid w-full grid-cols-3 gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 px-1',
            filter === 'ALL' && 'bg-gray-200 font-semibold text-gray-900 hover:bg-gray-200',
          )}
          onClick={() => setFilter('ALL')}
        >
          전체
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 px-1',
            filter === 'ANOMALY' && 'bg-gray-200 font-semibold text-gray-900 hover:bg-gray-200',
          )}
          onClick={() => setFilter('ANOMALY')}
        >
          이상현상
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 px-1',
            filter === 'GENERAL' && 'bg-gray-200 font-semibold text-gray-900 hover:bg-gray-200',
          )}
          onClick={() => setFilter('GENERAL')}
        >
          일반
        </Button>
      </div>

      {/* 3. 리스트 */}
      <ol className="min-h-0 w-full flex-1 space-y-2 overflow-y-auto pr-1">
        {filteredLogs.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-slate-400">
            표시할 이벤트가 없습니다
          </div>
        ) : (
          filteredLogs.map((entry, index) => (
            <li
              key={`${entry.type}-${entry.timestamp}-${index}`}
              id={`log-item-${entry.type}-${entry.timestamp}`}
            >
              <EventLogItem item={entry} startTime={startTime} onLogClick={onLogClick} />
            </li>
          ))
        )}
      </ol>
    </div>
  );
}
