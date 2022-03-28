import { throwError, throwMinifiedError } from '../error';

export function attribute(attrName: string) {
  return (value, { kind, name }) => {
    if (kind === 'accessor') {
      return {
        get() {
          return this.getAttribute(attrName);
        },
        set(val) {
          this.setAttribute(attrName, val);
        },
        init(initialValue) {
          this.setAttribute(attrName, initialValue);
          return initialValue;
        },
      };
    }

    if (process.env.NODE_ENV === 'development') {
      throwError(`attribute decorator should be added to the class field with accessor, like:

      class extends HTMLElement {
        @attribute('${attrName}')
        accessor ${name}
      }
      `);
    } else {
      throwMinifiedError(0);
    }
  };
}
