import type { SourceLocation } from './parse.js';

export interface CompilerError extends SyntaxError {
  code: number | string;
  loc?: SourceLocation;
}

export function createCompilerError(
  code: number | string,
  loc?: SourceLocation,
): CompilerError {
  const msg = typeof code === 'string' ? code : errorMessages[code];
  const error = new SyntaxError(String(msg)) as CompilerError;
  error.code = code;
  error.loc = loc;
  return error;
}

export const enum ErrorCodes {
  // parse errors
  MISSING_SCRIPT_TAG,
  DUPLICATE_SCRIPT_TAG,
  DUPLICATE_TEMPLATE_TAG,
  DUPLICATE_STYLE_TAG,
  // script errors
  MISSING_EXPORT_DEFAULT,
  MISSING_EXPORT_CLASS,
  MISSING_EXPORT_CLASS_EXTENDED_FROM_HTMLELEMENT,
  // transform errors
  X_V_IF_NO_EXPRESSION,
}

export const errorMessages: Record<ErrorCodes, string> = {
  // parse errors
  [ErrorCodes.MISSING_SCRIPT_TAG]: 'PWC must contain one <script> tag.',
  [ErrorCodes.DUPLICATE_SCRIPT_TAG]: 'PWC mustn\'t contain more than one <script> tag.',
  [ErrorCodes.DUPLICATE_TEMPLATE_TAG]: 'PWC mustn\'t contain more than one <template> tag.',
  [ErrorCodes.DUPLICATE_STYLE_TAG]: 'PWC mustn\'t contain more than one <template> tag.',

  // script errors
  [ErrorCodes.MISSING_EXPORT_DEFAULT]: 'PWC must allow one export default',
  [ErrorCodes.MISSING_EXPORT_CLASS]: 'PWC must export a class',
  [ErrorCodes.MISSING_EXPORT_CLASS_EXTENDED_FROM_HTMLELEMENT]: 'PWC must export a class extended from HTMLElement',
  // transform errors
  [ErrorCodes.X_V_IF_NO_EXPRESSION]: 'x-if/x-else-if is missing expression.',
};
