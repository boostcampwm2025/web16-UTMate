export interface Point {
  x: number;
  y: number;
}

export interface PointWithTime extends Point {
  timestamp: number;
}
