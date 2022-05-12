import type { RollupError } from 'rollup';
import type { CompilerError } from '@pwc/compiler';

export function createRollupError(
  id: string,
  error: SyntaxError | CompilerError,
): RollupError {
  if ('code' in error) {
    return {
      id,
      plugin: 'pwc',
      pluginCode: String(error.code),
      message: error.message,
      frame: error.loc!.source,
      parserError: error,
      loc: error.loc
        ? {
          file: id,
          line: error.loc.start.line,
          column: error.loc.start.column,
        }
        : undefined,
    };
  } else {
    return {
      id,
      plugin: 'pwc',
      message: error.message,
      parserError: error,
    };
  }
}
