/**
 * Docs: https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
 *
 * The reflect rule is:
 * 1. DOMTokenList type is not included in the cases, because developer cannot create domTokenList directly, more detail: https://dom.spec.whatwg.org/#domtokenlist
 * 2. Attribute has two kinds: (1) Boolean attribute; (2) Common attribute
 *
 *  (1) Boolean attribute:
 *     - property getter: if attribute value is null, it will return false, else return true;
 *                        if attribute value has been changed, it will return the changed boolean value
 *     - property setter: not reflect to attribute, more detail see InputElement checked property
 *     - property init:  the default value must be false,
 *                       and the return value depends on attribute value,
 *                       attribute value is null return false, else return true
 * (2) Common attribute:
 *     - property getter: if attribute value has been changed, it will return the changed value,
 *                        else return attribute value
 *     - property setter: not reflect to attribute
 *     - property init: if attribute value is null, return default value; else return attribute value
 *
 *  Minify code:
 * 1: repeated reflect attribute name
 */
import { throwError, throwMinifiedError } from '../../error';
import { validateAccessor } from '../validateAccessor';
import type { ReflectProperties, Attribute } from '../../type';
import { isBoolean } from '../../utils';
import { attributeSetter } from './setter';
import { attributeGetter } from './getter';
import { validatePrivate } from './validatePrivate';

export function attribute(attrName: string) {
  return (value, { kind, name, isPrivate }) => {
    // Validate accessor operator
    validateAccessor(kind, `@attribute('${attrName}')`, name);

    // Validate private class field
    if (__DEV__) {
      validatePrivate(isPrivate);
    }

    return {
      get() {
        return attributeGetter.call(this, name);
      },
      set(val) {
        attributeSetter.call(this, val, name);
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
        validateReflectedAttr(reflectProperties, name, attrName);

        const attr = {
          name: attrName,
          value: attrValue,
        };

        if (isBooleanValue) {
          initialValue = handleBooleanAttribute(initialValue, attr);
        } else {
          initialValue = handleCommonAttribute(this, initialValue, attr);
        }

        reflectProperties.set(name, {
          attrName,
          isBoolean: isBooleanValue,
          initialValue,
        });

        return initialValue;
      },
    };
  };
}

function validateReflectedAttr(reflectProperties: ReflectProperties, name: string, attrName: string) {
  if (reflectProperties.has(name)) {
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
function handleBooleanAttribute(initialValue: boolean, attr: Attribute) {
  if (__DEV__) {
    if (initialValue !== false) {
      throwError(
        'The boolean attribute initial value must be false, more detail see https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute',
      );
    }
  }

  return attr.value !== null;
}

function handleCommonAttribute(el: Element, initialValue: string, attr: Attribute) {
  if (attr.value === null) {
    return initialValue;
  }
  return attr.value;
}
