export interface Point {
  x: number;
  y: number;
}

export interface PointWithTime extends Point {
  timestamp: number;
}

export interface ActivitySegment {
  timestamp: number;
  duration: number;
  count?: number;
}

export interface EventCluster {
  startTime: number;
  endTime: number;
  count?: number;
}
