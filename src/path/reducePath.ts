import {isArray} from 'util';
import type {Path, Segment} from './types';

export default function reducePath(
  path: Path,
  reducer: (
    accumulator: Segment,
    current: Segment
  ) => Segment | [Segment, Segment]
): Path {
  const newPath = [];

  for (let i = 1; i < path.length; i++) {
    const lastSegment = newPath[newPath.length - 1] ?? path[0];
    const newSegments = reducer(lastSegment, path[i]);

    if (Array.isArray(newSegments)) {
      newPath[newPath.length - 1] = newSegments[0];
      newPath.push(newSegments[1]);
    } else {
      newPath[newPath.length - 1] = newSegments;
    }
  }

  return newPath;
}
