/**
 * Minify code:
 * 0: class field should add accessor
 */
import { throwError, throwMinifiedError } from '../error';

export function validateAccessor(kind: string, decoratorExp: string, name: string) {
  if (kind !== 'accessor') {
    if (__DEV__) {
      throwError(`The attribute decorator should be added to the class field with accessor, like:

      class extends HTMLElement {
        ${decoratorExp}
        accessor ${name}
      }
      `);
    } else {
      throwMinifiedError(0);
    }
  }
}
