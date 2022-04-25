// When attribute name startsWith @ in template, it should be an event
export function isEventNameInTemplate(name: string): boolean {
  return name.startsWith('@');
}

export function isEventName(name: string): boolean {
  return name.startsWith('on');
}

export function isPrivateField(field: string): boolean {
  return field.startsWith('#');
}

export const BINDING_REGEXP = /\{\{\s*([\s\S]*?)\s*\}\}/;
export const INTERPOLATION_REGEXP = /\{\{\s*([\s\S]*?)\s*\}\}/g;

export function isBindings(value: string): boolean {
  return BINDING_REGEXP.test(value);
}

enum MemberExpLexState {
  inMemberExp,
  inBrackets,
  inParens,
  inString,
}
const whitespaceRE = /\s+[.[]\s*|\s*[.[]\s+/g;
const validFirstIdentCharRE = /[A-Za-z_$\xA0-\uFFFF]/;
const validIdentCharRE = /[.?#\w$\xA0-\uFFFF]/;

/**
 * Forked from @vue/compiler-core
 * Simple lexer to check if an expression is a member expression. This is
 * lax and only checks validity at the root level (i.e. does not validate exps
 * inside square brackets), but it's ok since these are only used on template
 * expressions and false positives are invalid expressions in the first place.
 */
export function isMemberExpression(path: string): boolean {
  // remove whitespaces around . or [ first
  path = path.trim().replace(whitespaceRE, str => str.trim());

  let state = MemberExpLexState.inMemberExp;
  let stateStack: MemberExpLexState[] = [];
  let currentOpenBracketCount = 0;
  let currentOpenParensCount = 0;
  let currentStringType: "'" | '"' | '`' | null = null;

  for (let index = 0; index < path.length; index++) {
    const char = path.charAt(index);
    switch (state) {
      case MemberExpLexState.inMemberExp:
        if (char === '[') {
          stateStack.push(state);
          state = MemberExpLexState.inBrackets;
          currentOpenBracketCount++;
        } else if (char === '(') {
          stateStack.push(state);
          state = MemberExpLexState.inParens;
          currentOpenParensCount++;
        } else if (
          !(index === 0 ? validFirstIdentCharRE : validIdentCharRE).test(char)
        ) {
          return false;
        }
        break;
      case MemberExpLexState.inBrackets:
        if (char === '\'' || char === '"' || char === '`') {
          stateStack.push(state);
          state = MemberExpLexState.inString;
          currentStringType = char;
        } else if (char === '[') {
          currentOpenBracketCount++;
        } else if (char === ']') {
          if (!--currentOpenBracketCount) {
            state = stateStack.pop()!;
          }
        }
        break;
      case MemberExpLexState.inParens:
        if (char === '\'' || char === '"' || char === '`') {
          stateStack.push(state);
          state = MemberExpLexState.inString;
          currentStringType = char;
        } else if (char === '(') {
          currentOpenParensCount++;
        } else if (char === ')') {
          // if the exp ends as a call then it should not be considered valid
          if (index === path.length - 1) {
            return false;
          }
          if (!--currentOpenParensCount) {
            state = stateStack.pop()!;
          }
        }
        break;
      case MemberExpLexState.inString:
        if (char === currentStringType) {
          state = stateStack.pop()!;
          currentStringType = null;
        }
        break;
    }
  }
  return !currentOpenBracketCount && !currentOpenParensCount;
}

export function isBoolean(val: unknown): boolean {
  return typeof val === 'boolean';
}
