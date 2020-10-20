export enum CommandType {
  MoveTo,
  ClosePath,
  LineTo,
  HorizontalLineTo,
  VerticalLineTo,
  CurveTo,
  SmoothCurveTo,
  QuadraticBezierCurveTo,
  SmoothQuadraticBezierCurveTo,
  EllipticalArc,
}

export type MoveToCommand = {
  type: CommandType.MoveTo;
  x: number;
  y: number;
};

export type LineToCommand = {
  type: CommandType.LineTo;
  x: number;
  y: number;
};

export type HorizontalLineToCommand = {
  type: CommandType.HorizontalLineTo;
  x: number;
};

export type VerticalLineToCommand = {
  type: CommandType.VerticalLineTo;
  y: number;
};

export type CurveToCommand = {
  type: CommandType.CurveTo;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
};

export type SmoothCurveToCommand = {
  type: CommandType.SmoothCurveTo;
  x2: number;
  y2: number;
  x: number;
  y: number;
};

export type QuadraticBezierCurveToCommand = {
  type: CommandType.QuadraticBezierCurveTo;
  x1: number;
  y1: number;
  x: number;
  y: number;
};

export type SmoothQuadraticBezierCurveToCommand = {
  type: CommandType.SmoothQuadraticBezierCurveTo;
  x: number;
  y: number;
};

export type EllipticalArcCommand = {
  type: CommandType.EllipticalArc;
  rx: number;
  ry: number;
  xAxisRotation: number;
  largeArcFlag: boolean;
  sweepFlag: boolean;
  x: number;
  y: number;
};

export type Command =
  | MoveToCommand
  | LineToCommand
  | HorizontalLineToCommand
  | VerticalLineToCommand
  | CurveToCommand
  | SmoothCurveToCommand
  | QuadraticBezierCurveToCommand
  | SmoothQuadraticBezierCurveToCommand
  | EllipticalArcCommand;

export enum SegmentType {
  Line,
  Curve,
  QuadraticBezierCurve,
  EllipticalArc,
}

export type LineSegment = {
  type: SegmentType.Line;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export type CurveSegment = {
  type: SegmentType.Curve;
  startX: number;
  startY: number;
  control1X: number;
  control1Y: number;
  control2X: number;
  control2Y: number;
  endX: number;
  endY: number;
};

export type QuadraticBezierCurveSegment = {
  type: SegmentType.QuadraticBezierCurve;
  startX: number;
  startY: number;
  controlX: number;
  controlY: number;
  endX: number;
  endY: number;
};

export enum EllipticalArcSweep {
  Positive,
  Negative,
}

export enum EllipticalArcSize {
  Large,
  Small,
}

export type EllipticalArcSegment = {
  type: SegmentType.EllipticalArc;
  startX: number;
  startY: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  size: EllipticalArcSize;
  sweep: EllipticalArcSweep;
  endX: number;
  endY: number;
};

export type Segment =
  | LineSegment
  | CurveSegment
  | QuadraticBezierCurveSegment
  | EllipticalArcSegment;

export type Path = Segment[];
