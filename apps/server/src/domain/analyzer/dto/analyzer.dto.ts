import { AnalyzeData } from '../interface';

export class AnalyzerDto {
  startTime: number;
  endTime: number;

  timeToFirstInteraction?: number;

  idleTime: AnalyzeData[];

  rageClickCount: AnalyzeData[];

  mouseThrashingCount: AnalyzeData[];
  constructor(
    startTime: number,
    endTime: number,
    timeToFirstInteraction: number | undefined,
    idleTime: AnalyzeData[],
    rageClickCount: AnalyzeData[],
    mouseThrashingCount: AnalyzeData[],
  ) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.timeToFirstInteraction = timeToFirstInteraction;
    this.idleTime = idleTime;
    this.rageClickCount = rageClickCount;
    this.mouseThrashingCount = mouseThrashingCount;
  }
}
