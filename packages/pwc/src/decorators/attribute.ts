/**
 * Minify code:
 * 1: repeated reflect attribute name
 */
import { throwError, throwMinifiedError } from '../error';
import { validateAccessor } from './validateAccessor';
import type { ReflectProperties } from '../type';
import { isBoolean } from '../utils';

const __DEV__ = process.env.NODE_ENV !== 'production';

export function attribute(attrName: string) {
  return (value, { kind, name }) => {
    if (kind === 'accessor') {
      return {
        get() {
          const attrValue = this.getAttribute(attrName);
          if (this._getReflectProperties().get(attrName)) {
            return attrValue !== null;
          }
          return attrValue;
        },
        set(val) {
          this.setAttribute(attrName, val);
        },
        /**
         * The init rule is, if the property has default value, it won't setAttrbute to element
         * More detail can see InputElement checked property in browser
         * @param {T} originalInitialValue
         * @returns {T}
         */
        init(originalInitialValue) {
          let initialValue = originalInitialValue;
          const isBooleanValue = isBoolean(initialValue);
          const attrValue = this.getAttribute(attrName);
          const reflectProperties: ReflectProperties = this._getReflectProperties();

          // Validate the repeated attribute name
          validateReflectedAttr(reflectProperties, attrName);

          reflectProperties.set(attrName, isBooleanValue);

          if (isBooleanValue) {
            initialValue = handleBooleanAttribute(initialValue, attrValue);
          } else {
            initialValue = handleCommonAttribute(initialValue, attrValue);
          }

          return initialValue;
        },
      };
    }

    validateAccessor(`@attribute('${attrName}')`);
  };
}

function validateReflectedAttr(reflectProperties: ReflectProperties, attrName: string) {
  if (reflectProperties.has(attrName)) {
    if (__DEV__) {
      throwError(`The attribute name ${attrName} has been reflected.`);
    } else {
      throwMinifiedError(1);
    }
  }
}

/**
 * docs: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute
 */
function handleBooleanAttribute(initialValue: boolean, attrValue: unknown) {
  if (__DEV__) {
    if (initialValue !== false) {
      throwError(
        `The boolean attribute initial value must be false, more detail see https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute`,
      );
    }
  }

  return attrValue !== null;
}

function handleCommonAttribute(initialValue: string, attrValue: string) {
  if (attrValue === null) return initialValue;
  return attrValue;
}
