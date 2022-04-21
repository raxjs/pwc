/**
 * Minify code:
 * 0: class field should add accessor
 * 1: repeated reflect attribute name
 */
import type { Warning } from './type';

function createMinifiedError(type, code) {
  return new Error(`${type}: #${code}.`);
}

/**
 * Minified code:
 *  0: lack accessor error.
 * @param code {Number}
 * @param obj {Object}
 */
export function throwMinifiedError(code) {
  throw createMinifiedError('Error', code);
}

/**
 * Minified Code:
 * @param {number} code
 * @param {string} info
 */
export function throwMinifiedWarn(code) {
  throw createMinifiedError('Warn', code);
}

export function throwError(message) {
  throw Error(`${message}`);
}

export const warning: Warning = function (template: string, ...args: any[]): void {
  if (__DEV__) {
    if (typeof console !== 'undefined') {
      let argsWithFormat = args.map((item) => `${item}`);
      argsWithFormat.unshift(`Warning: ${template}`);
      // Don't use spread (or .apply) directly because it breaks IE9
      Function.prototype.apply.call(console.error, console, argsWithFormat);
    }

    // For works in DevTools when enable `Pause on caught exceptions`
    // that can find the component where caused this warning
    try {
      let argIndex = 0;
      const message = `Warning: ${template.replace(/%s/g, () => args[argIndex++])}`;
      throw new Error(message);
    } catch (error) {}
  }
};
