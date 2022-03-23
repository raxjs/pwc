import type { RollupError } from 'rollup';

export function createRollupError(
  id: string,
  error: SyntaxError,
): RollupError {
  return {
    id,
    plugin: 'pwc',
    message: error.message,
    parserError: error,
  };
}
