/**
 * Docs: https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 *
 * The reflect rule is:
 * 1. DOMTokenList type is not included in the cases, because developer cannot create domTokenList directly, more detail: https://dom.spec.whatwg.org/#domtokenlist
 * 2. Attribute has two kinds: (1) Boolean attribute; (2) Common attribute
 * (1) Boolean attribute:
 *     - property getter: if attribute value is null, it will return false, else return true
 *     - property setter: not reflect to attribute, more detail see InputElement checked property
 *     - property init:  the default value must be false, and the return value depends on attribute value, attribute value is null return false, else return true
 * (2) Common attribute:
 *     - property getter: directly return attribute value
 *     - property setter: directly set attribute
 *     - property init: if attribute value is null, return default value; else return attribute value
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
    // Validate accessor operator
    validateAccessor(kind, `@attribute('${attrName}')`);

    return {
      get() {
        const attrValue = this.getAttribute(attrName);
        if (this._getReflectProperties().get(attrName)) {
          return attrValue !== null;
        }
        return attrValue;
      },
      set(val) {
        // Boolean attribute not reflect to attribute
        if (!this._getReflectProperties().get(attrName)) {
          this.setAttribute(attrName, val);
        }
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
 * Docs: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute
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
