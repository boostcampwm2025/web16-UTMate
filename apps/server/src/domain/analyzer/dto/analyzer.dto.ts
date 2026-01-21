export class AnalyzerDto {
  duration: number;
  timeToFirstInteraction?: number;
  idleTime: number;
  rageClickCount: number;
  mouseThrashingCount: number;

  constructor(
    duration: number,
    timeToFirstInteraction: number | undefined,
    idleTime: number,
    rageClickCount: number,
    mouseThrashingCount: number,
  ) {
    this.duration = duration;
    this.timeToFirstInteraction = timeToFirstInteraction;
    this.idleTime = idleTime;
    this.rageClickCount = rageClickCount;
    this.mouseThrashingCount = mouseThrashingCount;
  }
}
