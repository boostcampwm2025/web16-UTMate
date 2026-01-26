import { EventType, IncrementalSource } from '@rrweb/types';
import type { eventWithTime } from '@rrweb/types';

export type ScrollDirection = 'Up' | 'Down';

export interface GroupedInteractionLog {
  log: eventWithTime;
  count: number;
  endTime?: number;
  scrollDirection?: ScrollDirection;
  targetInfo?: string; // 클릭/입력한 요소 정보
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
 * 이벤트에서 target element 정보를 추출합니다.
 */
function getTargetInfo(log: IncrementalSnapshotEvent): string | undefined {
  const source = log.data.source;

  if (source === IncrementalSource.MouseInteraction) {
    const id = (log.data as any).id;
    const interactionType = (log.data as any).type;
    const interactionNames: Record<number, string> = {
      0: 'MouseUp',
      1: 'MouseDown',
      2: 'Click',
      3: 'ContextMenu',
      4: 'DblClick',
      5: 'Focus',
      6: 'Blur',
      7: 'TouchStart',
      8: 'TouchEnd',
    };
    const typeName = interactionNames[interactionType] || `Type${interactionType}`;
    return id ? `요소 #${id} (${typeName})` : undefined;
  }

  if (source === IncrementalSource.Input) {
    const id = (log.data as any).id;
    const text = (log.data as any).text;
    const truncatedText = text && text.length > 20 ? text.slice(0, 20) + '...' : text;
    return id ? `요소 #${id}${truncatedText ? ` "${truncatedText}"` : ''}` : undefined;
  }

  return undefined;
}

/**
 * 클릭/스크롤/터치/입력 등 "주요 인터랙션" 이벤트만 추출하고,
 * 연속된 이벤트를 그룹화합니다.
 * - 스크롤: 방향(Up/Down) 기준으로 그룹화
 * - 클릭/입력: 같은 요소에 대해 2초 이내 발생하면 그룹화
 */
export function groupLogsByType(logs: eventWithTime[]): GroupedInteractionLog[] {
  type InternalGroup = GroupedInteractionLog & { lastScrollY?: number };

  const result: InternalGroup[] = [];
  let lastEntry: InternalGroup | undefined;
  const TIME_THRESHOLD = 2000; // 2초 이내 이벤트는 그룹화

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

    // 클릭/입력/터치 이벤트 처리 (같은 요소 + 짧은 시간 내 발생 시 그룹화)
    const currentId = (log.data as any).id;
    const timeDiff = lastEntry ? log.timestamp - (lastEntry.endTime || lastEntry.log.timestamp) : Infinity;

    if (
      lastEntry &&
      isIncrementalSnapshotEvent(lastEntry.log) &&
      lastEntry.log.data.source === source &&
      (lastEntry.log.data as any).id === currentId &&
      timeDiff <= TIME_THRESHOLD
    ) {
      // 같은 타입, 같은 요소, 짧은 시간 내 이벤트 → 그룹에 합침
      lastEntry.count += 1;
      lastEntry.endTime = log.timestamp;
      continue;
    }

    // 새로운 그룹 생성 (+ target 정보 추출)
    const targetInfo = getTargetInfo(log);
    const newEntry: InternalGroup = { log, count: 1, endTime: log.timestamp, targetInfo };
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
