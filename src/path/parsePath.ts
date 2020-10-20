import type {Path} from './types';
import convertCommandsToPath from './convertCommandsToPath';
import parseCommands from './parseCommands';

export default function parsePath(d: string): Path {
  return convertCommandsToPath(parseCommands(d));
}
