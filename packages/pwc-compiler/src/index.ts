import { parse } from './parse';
import { genScriptCode, genStyleCode } from './generate';

export function compile(source: string, { filename = 'anonymous.pwc' }) {
  // Parse
  const { descriptor } = parse(source, { filename });
  // Generate
  const { code, map } = genScriptCode(descriptor);
  const styles = genStyleCode(descriptor);
  return {
    script: {
      code,
      map,
    },
    styles,
  };
}
