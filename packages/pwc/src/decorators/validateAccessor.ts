/**
 * Minify code:
 * 0: class field should add accessor
 */
import { throwError, throwMinifiedError } from '../error';

const __DEV__ = process.env.NODE_ENV !== 'production';

export function validateAccessor(decoratorExp: string) {
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
