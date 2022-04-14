import { isEventName } from '../utils/isEventName';
import type { Attributes, PWCElement } from '../type';
import { isFunction, toRaw } from '../utils';
import { warning } from '../error';

export function commitAttributes(element: Element, attrs: Attributes, isInitial, rootElement?: PWCElement) {
  for (const attr of attrs) {
    const { name, value } = attr;
    if (isEventName(name)) {
      // Only add event listener at the first render
      if (!isInitial) {
        continue;
      }
      const eventName = name.slice(2).toLowerCase();
      // And value is valid
      if (!isFunction(value)) {
        warning('The %s handler on %s is not a valid function', eventName, element);
        continue;
      }
      const { capture = false } = attr;
      // If capture is true, the event should be triggered when capture stage
      // Bind the rootElement to ensure the handler context is the element itself
      element.addEventListener(eventName, value.bind(rootElement), capture);
    } else if (name in element) {
      // Verify that there is a target property on the element
      element[name] = toRaw(value);
    } else {
      element.setAttribute(name, value);
    }
  }
}
