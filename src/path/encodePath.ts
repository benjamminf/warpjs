import type {Path} from './types';
import convertPathToCommands from './convertPathToCommands';
import encodeCommands from './encodeCommands';

export default function encodePath(path: Path): string {
  return encodeCommands(convertPathToCommands(path));
}
