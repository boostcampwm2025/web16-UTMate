import { EventType, IncrementalSource } from '@rrweb/types';
import type { eventWithTime } from '@rrweb/types';

export type ScrollDirection = 'Up' | 'Down';

export interface GroupedInteractionLog {
  log: eventWithTime;
  count: number;
  endTime?: number;
  scrollDirection?: ScrollDirection;
}

type IncrementalSnapshotEvent = eventWithTime & {
  type: EventType.IncrementalSnapshot;
  data: {
    source: IncrementalSource;
    // rrweb-player 버전/타입 정의에 따라 scroll 데이터의 shape이 달라질 수 있어 안전하게 처리
    [key: string]: unknown;
  };
};

function isIncrementalSnapshotEvent(log: eventWithTime): log is IncrementalSnapshotEvent {
  return log.type === EventType.IncrementalSnapshot;
}

function isInteractionSource(source: IncrementalSource): boolean {
  return (
    source === IncrementalSource.MouseInteraction ||
    source === IncrementalSource.Scroll ||
    source === IncrementalSource.TouchMove ||
    source === IncrementalSource.Input
  );
}

function getScrollY(log: IncrementalSnapshotEvent): number {
  const y = log.data?.y;
  return typeof y === 'number' ? y : 0;
}

function getScrollDirection(prevY: number, currentY: number): ScrollDirection | undefined {
  if (currentY > prevY) return 'Down';
  if (currentY < prevY) return 'Up';
  return undefined;
}

/**
 * 클릭/스크롤/터치/입력 등 "주요 인터랙션" 이벤트만 추출하고,
 * 연속된 스크롤은 방향(Up/Down) 기준으로 그룹화합니다.
 */
export function groupLogsByType(logs: eventWithTime[]): GroupedInteractionLog[] {
  type InternalGroup = GroupedInteractionLog & { lastScrollY?: number };

  const result: InternalGroup[] = [];
  let lastEntry: InternalGroup | undefined;

  for (const log of logs) {
    if (!isIncrementalSnapshotEvent(log)) continue;

    const source = log.data.source;
    if (!isInteractionSource(source)) continue;

    // 스크롤 이벤트 처리 (연속 스크롤 그룹화 + 방향 판정)
    if (source === IncrementalSource.Scroll) {
      const currentY = getScrollY(log);

      if (
        lastEntry &&
        isIncrementalSnapshotEvent(lastEntry.log) &&
        lastEntry.log.data.source === IncrementalSource.Scroll
      ) {
        const lastScrollLog = lastEntry.log as IncrementalSnapshotEvent;
        const prevY = lastEntry.lastScrollY ?? getScrollY(lastScrollLog);
        const direction = getScrollDirection(prevY, currentY);

        // 방향이 없거나(제자리), 이전 방향과 같다면 합침
        // 또는 이전 방향이 아직 정해지지 않았다면(첫 이벤트 후 두번째), 현재 방향으로 설정하고 합침
        if (!direction || direction === lastEntry.scrollDirection || !lastEntry.scrollDirection) {
          lastEntry.count += 1;
          lastEntry.endTime = log.timestamp;
          lastEntry.lastScrollY = currentY;
          if (direction) lastEntry.scrollDirection = direction;
          continue;
        }
      }

      const newEntry: InternalGroup = {
        log,
        count: 1,
        endTime: log.timestamp,
        scrollDirection: undefined, // 첫 이벤트만으로는 방향을 확정할 수 없음
        lastScrollY: currentY,
      };
      result.push(newEntry);
      lastEntry = newEntry;
      continue;
    }

    // 스크롤 외 다른 이벤트는 개별 그룹
    const newEntry: InternalGroup = { log, count: 1, endTime: log.timestamp };
    result.push(newEntry);
    lastEntry = newEntry;
  }

  // 내부 필드(lastScrollY) 제거
  return result.map(({ lastScrollY, ...entry }) => entry);
}

export function getEventLabel(log: eventWithTime): string {
  if (log.type === EventType.IncrementalSnapshot) {
    switch (log.data.source) {
      case IncrementalSource.MouseInteraction:
        return '클릭';
      case IncrementalSource.Scroll:
        return '스크롤';
      case IncrementalSource.TouchMove:
        return '터치';
      case IncrementalSource.Input:
        return '입력';
      default:
        return `기타(${log.data.source})`;
    }
  }
  return `이벤트 타입(${log.type})`;
}
