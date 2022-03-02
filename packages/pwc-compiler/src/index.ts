import { parse } from './parse';
import { genTemplateCode, genScriptCode, genStyleCode } from './generate';

export function compile(source: string, { filename = 'anonymous.pwc' }) {
  // Parse
  const { descriptor } = parse(source, { filename });
  // TODO:Transform
  // Generate
  const template = genTemplateCode(descriptor);
  const script = genScriptCode(descriptor);
  const styles = genStyleCode(descriptor);
  return {
    template,
    script,
    styles,
  };
}
