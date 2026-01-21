import { Injectable } from '@nestjs/common';
import {
  EventType,
  type eventWithTime,
  IncrementalSource,
  MouseInteractions,
  mousePosition,
} from '@rrweb/types';

import {
  ACTIVE_SOURCES,
  IDLE_THRESHOLD,
  RAGE_CLICK_MAX_DISTANCE,
  RAGE_CLICK_MIN_CLICKS,
  RAGE_CLICK_TIMEFRAME,
} from './const';

@Injectable()
export class AnalyzerService {
  analyze(logs: Buffer): string {
    // buffer를 문자열로 변환
    const logString = logs.toString('utf-8');
    // jsonl의 각 줄을 파싱하여 rrweb eventWithTime 객체 배열로 변환
    const logEntries: eventWithTime[] = logString
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as eventWithTime);

    // 예시: duration 분석
    const duration = this.analyzeDuration(logEntries);
    const timeToFirstInteraction = this.analyzeTimeToFirstInteraction(logEntries);
    return `duration: ${duration}ms, time to first interaction: ${timeToFirstInteraction}ms`;
  }

  /**
   * 미션 수행의 걸린 시간을 분석합니다.
   *
   * @param events rrweb eventWithTime 객체 배열
   * @returns 분석된 세션의 총 지속 시간 (밀리초 단위)
   */
  private analyzeDuration(events: eventWithTime[]): number {
    if (events.length === 0) return 0;
    const startTime = events[0].timestamp;
    const endTime = events[events.length - 1].timestamp;
    return endTime - startTime;
  }

  /**
   * 첫번째 클릭까지 걸린 시간을 분석합니다.
   *
   * @param events rrweb eventWithTime 객체 배열
   * @returns 첫번째 클릭까지 걸린 시간 (밀리초 단위) 또는 null (클릭 이벤트가 없는 경우)
   */
  private analyzeTimeToFirstInteraction(events: eventWithTime[]): number | null {
    const startTime = events[0].timestamp;
    const firstInteraction = events.find(
      (event) =>
        event.type === EventType.IncrementalSnapshot &&
        event.data.source === IncrementalSource.MouseInteraction &&
        event.data.type === MouseInteractions.Click,
    );
    if (!firstInteraction) return null;
    return firstInteraction.timestamp - startTime;
  }

  /**
   * IDLE_THRESHOLD(10초) 이상 무동작 구간에 대한 idle time을 분석합니다.
   *
   * @param events rrweb eventWithTime 객체 배열
   * @returns 분석된 idle time (밀리초 단위)
   */
  private analyzeIdleTime(events: eventWithTime[]): number {
    let idleTime = 0;
    let lastInteractionTime = events[0].timestamp;

    for (const event of events) {
      if (
        event.type === EventType.IncrementalSnapshot &&
        ACTIVE_SOURCES.includes(event.data.source)
      ) {
        const gap = event.timestamp - lastInteractionTime;
        if (gap >= IDLE_THRESHOLD) {
          idleTime += gap;
        }
        lastInteractionTime = event.timestamp;
      }
    }

    return idleTime;
  }

  /**
   * 사용자의 rage click 횟수를 분석합니다.
   * RAGE_CLICK_TIMEFRAME(1초) 이내에
   * RAGE_CLICK_MIN_CLICKS(3회) 이상,
   * x좌표와 y좌표가 RAGE_CLICK_MAX_DISTANCE(100px) 이내에 클릭이 발생한 경우를 분노 클릭으로 간주합니다.
   *
   * @param events rrweb eventWithTime 객체 배열
   * @returns 분석된 rage click 횟수
   */
  private analyzeRageClick(events: eventWithTime[]): number {
    let rageClickCount = 0;
    const clickDatas: { timestamp: number; x: number; y: number }[] = [];

    // 클릭 이벤트 데이터 수집
    for (const event of events) {
      if (
        event.type === EventType.IncrementalSnapshot &&
        event.data.source === IncrementalSource.MouseInteraction &&
        event.data.type === MouseInteractions.Click &&
        event.data.x &&
        event.data.y
      ) {
        clickDatas.push({ timestamp: event.timestamp, x: event.data.x, y: event.data.y });
      }
    }

    for (let pivot = 0; pivot < clickDatas.length; pivot++) {
      let clusterCount = 1;
      for (let candidate = pivot + 1; candidate < clickDatas.length; candidate++) {
        // 처음 클릭과의 시간 차이 확인
        if (clickDatas[candidate].timestamp - clickDatas[pivot].timestamp > RAGE_CLICK_TIMEFRAME) {
          break;
        }
        // 좌표 거리 계산
        if (
          Math.abs(clickDatas[candidate].x - clickDatas[pivot].x) > RAGE_CLICK_MAX_DISTANCE ||
          Math.abs(clickDatas[candidate].y - clickDatas[pivot].y) > RAGE_CLICK_MAX_DISTANCE
        ) {
          break;
        }
        clusterCount++;
      }

      // 클러스터 내 클릭 수가 최소 기준 이상인 경우 rage click으로 간주
      if (clusterCount >= RAGE_CLICK_MIN_CLICKS) {
        rageClickCount++;
        pivot += clusterCount - 1; // 이미 카운트된 클릭들은 건너뜀
      }
    }

    return rageClickCount;
  }
}
