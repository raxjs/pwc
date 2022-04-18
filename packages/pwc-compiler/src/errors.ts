import type { SourceLocation } from './parse';

export interface CompilerError extends SyntaxError {
  code: number | string;
  loc?: SourceLocation;
}

export const enum ErrorCodes {
  // TODO:parse errors
  // transform errors
  EVENT_ON_NO_EXPRESSION
}

export const errorMessages: Record<ErrorCodes, string> = {
  // TODO:parse errors
  // transform errors
  [ErrorCodes.EVENT_ON_NO_EXPRESSION]: 'event binding is missing expression.'
}

export function createCompilerError(
  code: ErrorCodes,
  loc?: SourceLocation,
): CompilerError {
  const msg = errorMessages[code];
  const error = new SyntaxError(msg) as CompilerError;
  error.code = code;
  error.loc = loc;
  return error;
}
