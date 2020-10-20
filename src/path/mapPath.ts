import type {Path, Segment} from './types';

export default function mapPath(
  path: Path,
  mapper: (segment: Segment) => Segment | Segment[]
): Path {
  const newPath = [];

  for (let i = 0; i < path.length; i++) {
    const newSegments = mapper(path[i]);

    if (Array.isArray(newSegments)) {
      newPath.push(...newSegments);
    } else {
      newPath.push(newSegments);
    }
  }

  return newPath;
}
