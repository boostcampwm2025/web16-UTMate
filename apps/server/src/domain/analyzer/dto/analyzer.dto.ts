import { ActivitySegment } from '../interface';

export class AnalyzerResult {
  startTime: number;
  endTime: number;

  timeToFirstInteraction?: number;

  idleTime: ActivitySegment[];

  rageClickCount: ActivitySegment[];

  mouseThrashingCount: ActivitySegment[];

  constructor(
    startTime: number,
    endTime: number,
    timeToFirstInteraction: number | undefined,
    idleTime: ActivitySegment[],
    rageClickCount: ActivitySegment[],
    mouseThrashingCount: ActivitySegment[],
  ) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.timeToFirstInteraction = timeToFirstInteraction;
    this.idleTime = idleTime;
    this.rageClickCount = rageClickCount;
    this.mouseThrashingCount = mouseThrashingCount;
  }
}
