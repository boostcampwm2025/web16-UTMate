import { Injectable } from '@nestjs/common';
import {
  EventType,
  type eventWithTime,
  IncrementalSource,
  MouseInteractions,
  mousePosition,
} from '@rrweb/types';

import { AnalyzerResult } from './dto/analyzer.dto';
import {
  ACTIVE_SOURCES,
  IDLE_THRESHOLD,
  MOUSE_THRASHING_MIN_DISTANCE,
  MOUSE_THRASHING_MIN_EVENTS,
  MOUSE_THRASHING_MIN_RATIO,
  MOUSE_THRASHING_TIMEFRAME,
  RAGE_CLICK_MAX_DISTANCE,
  RAGE_CLICK_MIN_CLICKS,
  RAGE_CLICK_TIMEFRAME,
} from './const';
import { ActivitySegment, EventCluster, Point, PointWithTime } from './interface';

@Injectable()
export class AnalyzerService {
  analyze(logs: Buffer) {
    // buffer를 문자열로 변환
    const logString = logs.toString('utf-8');
    // jsonl의 각 줄을 파싱하여 rrweb eventWithTime 객체 배열로 변환
    const logEntries: eventWithTime[] = logString
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as eventWithTime);

    const { startTime, endTime } = this.analyzeDuration(logEntries);
    const timeToFirstInteraction = this.analyzeTimeToFirstInteraction(logEntries);
    const idleTime = this.analyzeIdleTime(logEntries);
    const rageClickCount = this.analyzeRageClick(logEntries);
    const mouseThrashingCount = this.analyzeMouseThrashing(logEntries);

    return new AnalyzerResult(
      startTime,
      endTime,
      timeToFirstInteraction,
      idleTime,
      rageClickCount,
      mouseThrashingCount,
    );
  }

  /**
   * 미션 수행의 걸린 시간을 분석합니다.
   *
   * @param events rrweb eventWithTime 객체 배열
   * @returns 분석된 세션의 총 지속 시간 (밀리초 단위)
   */
  private analyzeDuration(events: eventWithTime[]) {
    if (events.length === 0) return { startTime: 0, endTime: 0 };
    const startTime = events[0].timestamp;
    const endTime = events.at(-1)!.timestamp;
    return { startTime, endTime };
  }

  /**
   * 첫번째 클릭까지 걸린 시간을 분석합니다.
   *
   * @param events rrweb eventWithTime 객체 배열
   * @returns 첫번째 클릭까지 걸린 시간 (밀리초 단위) 또는 null (클릭 이벤트가 없는 경우)
   */
  private analyzeTimeToFirstInteraction(events: eventWithTime[]): number | undefined {
    const startTime = events[0].timestamp;
    const firstInteraction = events.find(
      (event) =>
        event.type === EventType.IncrementalSnapshot &&
        event.data.source === IncrementalSource.MouseInteraction &&
        event.data.type === MouseInteractions.Click,
    );
    if (!firstInteraction) return undefined;
    return firstInteraction.timestamp - startTime;
  }

  /**
   * IDLE_THRESHOLD(10초) 이상 무동작 구간에 대한 idle time을 분석합니다.
   *
   * @param events rrweb eventWithTime 객체 배열
   * @returns 분석된 idle time (밀리초 단위)
   */
  private analyzeIdleTime(events: eventWithTime[]): ActivitySegment[] {
    const idleTimes: ActivitySegment[] = [];
    let lastInteractionTime = events[0].timestamp;

    for (const event of events) {
      if (
        event.type === EventType.IncrementalSnapshot &&
        ACTIVE_SOURCES.includes(event.data.source)
      ) {
        const gap = event.timestamp - lastInteractionTime;
        if (gap >= IDLE_THRESHOLD) {
          idleTimes.push({ timestamp: lastInteractionTime, duration: gap });
        }
        lastInteractionTime = event.timestamp;
      }
    }

    return idleTimes;
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
  private analyzeRageClick(events: eventWithTime[]): ActivitySegment[] {
    const clickDatas: PointWithTime[] = [];

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

    const rageClicks: EventCluster[] = [];

    let pivot = 0;

    while (pivot < clickDatas.length) {
      let clusterCount = 1;
      let lastIncludedIndex = pivot;

      for (let candidate = pivot + 1; candidate < clickDatas.length; candidate++) {
        // 시간 차이 확인 (시간 초과 시 그룹화 종료)
        if (clickDatas[candidate].timestamp - clickDatas[pivot].timestamp > RAGE_CLICK_TIMEFRAME) {
          break;
        }

        // 좌표 거리 계산 (거리가 멀면 클러스터 카운트 제외하지만 탐색은 계속)
        if (
          Math.abs(clickDatas[candidate].x - clickDatas[pivot].x) > RAGE_CLICK_MAX_DISTANCE ||
          Math.abs(clickDatas[candidate].y - clickDatas[pivot].y) > RAGE_CLICK_MAX_DISTANCE
        ) {
          continue;
        }

        clusterCount++;
        lastIncludedIndex = candidate; // 마지막 인덱스 갱신
      }

      if (clusterCount >= RAGE_CLICK_MIN_CLICKS) {
        rageClicks.push({
          startTime: clickDatas[pivot].timestamp,
          endTime: clickDatas[lastIncludedIndex].timestamp,
          count: clusterCount,
        });

        // 기준을 마지막 인덱스로 이동
        pivot = lastIncludedIndex;
      }
      pivot++;
    }

    // 3초 이내 중복된 rage click 통합
    const mergedRageClicks = rageClicks
      .map((rageClick, index, arr) => {
        if (index === 0) return rageClick;
        const prevRageClick = arr[index - 1];
        if (rageClick.startTime - prevRageClick.endTime <= 3000) {
          // 이전 rage click과 합침
          prevRageClick.endTime = rageClick.endTime;
          prevRageClick.count = prevRageClick.count! + rageClick.count!;
          return null;
        }
        return rageClick;
      })
      .filter((rageClick) => rageClick !== null);

    return this.clustersToAnalyzeData(mergedRageClicks);
  }

  /**
   * 사용자의 마우스 스러싱 횟수를 분석합니다.
   * 마우스 움직임 이벤트 중에서
   * MOUSE_THRASHING_TIMEFRAME(1초) 이내에
   * MOUSE_THRASHING_MIN_EVENTS(10회) 이상의 움직임이 발생하고,
   * 변위 대비 이동 경로 비율이 MOUSE_THRASHING_MIN_RATIO(5) 이상이며,
   * 총 이동 경로가 MOUSE_THRASHING_MIN_DISTANCE(500px) 이상인 경우를 마우스 스러싱으로 간주합니다.
   *
   * @param events rrweb eventWithTime 객체 배열
   * @returns 분석된 마우스 스러싱 횟수
   */
  private analyzeMouseThrashing(events: eventWithTime[]) {
    const mouseMoveEvents: PointWithTime[] = [];

    // 마우스 움직임 이벤트 수집
    for (const event of events) {
      if (
        event.type === EventType.IncrementalSnapshot &&
        event.data.source === IncrementalSource.MouseMove &&
        event.data.positions
      ) {
        event.data.positions.forEach((pos: mousePosition) => {
          mouseMoveEvents.push({ x: pos.x, y: pos.y, timestamp: event.timestamp + pos.timeOffset });
        });
      }
    }

    const trashings: EventCluster[] = [];

    let pivot = 0;
    while (pivot < mouseMoveEvents.length) {
      let clusterCount = 1;
      let lastIncludedIndex = pivot;

      // 1초 이내의 이벤트 카운팅
      for (let candidate = pivot + 1; candidate < mouseMoveEvents.length; candidate++) {
        // 처음 움직임과의 시간 차이 확인
        if (
          mouseMoveEvents[candidate].timestamp - mouseMoveEvents[pivot].timestamp >
          MOUSE_THRASHING_TIMEFRAME
        ) {
          break;
        }
        clusterCount++;
        lastIncludedIndex = candidate; // 마지막 인덱스 갱신
      }

      // 데이터가 너무 적으면 분석 스킵 ( 노이즈 가능성 높음 )
      if (clusterCount < MOUSE_THRASHING_MIN_EVENTS) {
        pivot++;
        continue;
      }

      const metrics = this.calculateMetrics(mouseMoveEvents.slice(pivot, pivot + clusterCount));

      // 변위 대비 이동 경로 비율 및, 총 이동 경로가 기준 이상인 경우 마우스 스러싱으로 간주
      if (
        metrics.ratio >= MOUSE_THRASHING_MIN_RATIO &&
        metrics.totalPath >= MOUSE_THRASHING_MIN_DISTANCE
      ) {
        trashings.push({
          startTime: mouseMoveEvents[pivot].timestamp,
          endTime: mouseMoveEvents[pivot + clusterCount - 1].timestamp,
        });
        pivot = lastIncludedIndex; // 기준을 마지막 인덱스로 이동
      }
      pivot++;
    }

    // 3초 이내 중복된 마우스 스러싱 통합
    const mergedThrashings = trashings
      .map((thrashing, index, arr) => {
        if (index === 0) return thrashing;
        const prevThrashing = arr[index - 1];
        if (thrashing.startTime - prevThrashing.endTime <= 3000) {
          // 이전 마우스 스러싱과 합침
          prevThrashing.endTime = thrashing.endTime;
          return null;
        }
        return thrashing;
      })
      .filter((thrashing) => thrashing !== null);

    return this.clustersToAnalyzeData(mergedThrashings);
  }

  /**
   * 마우스 움직임의 총 이동 경로, 변위, 비율을 계산합니다.
   *
   * @param points 마우스 움직임 좌표 배열
   * @returns 총 이동 경로, 변위, 비율을 포함한 객체
   */
  private calculateMetrics(points: Point[]) {
    let totalPath = 0;

    // 총 이동 거리 계산
    for (let k = 1; k < points.length; k++) {
      totalPath += this.getDistance(points[k - 1], points[k]);
    }

    // 변위 계산
    const start = points[0];
    const end = points.at(-1)!;
    const displacement = this.getDistance(start, end);

    // 비율 계산 (변위가 0인 경우 100으로 설정 - ArithmeticException 방지 )
    const ratio = displacement === 0 ? 100 : totalPath / displacement;

    return { totalPath, ratio };
  }

  /**
   * 두 점 사이의 유클리드 거리 계산
   *
   * @param p1
   * @param p2
   * @returns 두 점 사이의 거리
   */
  private getDistance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  /**
   * EventCluster 배열을 AnalyzeData 배열로 변환합니다.
   *
   * @param eventClusters EventCluster 배열
   * @returns AnalyzeData 배열
   */
  private clustersToAnalyzeData(eventClusters: EventCluster[]): ActivitySegment[] {
    return eventClusters.map((data) => ({
      timestamp: data.startTime,
      duration: data.endTime - data.startTime,
      count: data.count,
    }));
  }
}
