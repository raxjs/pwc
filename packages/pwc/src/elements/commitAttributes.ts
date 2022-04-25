import { isEvent } from '../utils/isEvent';
import type { Attributes, PWCElement } from '../type';
import { toRaw } from '../utils';

export function commitAttributes(element: Element, attrs: Attributes, isInitial, rootElement?: PWCElement) {
  for (const attr of attrs) {
    const { name, value, handler } = attr;
    if (isEvent(attr)) {
      // Only add event listener at the first render
      if (!isInitial) {
        continue;
      }
      const eventName = name.slice(2).toLowerCase();
      const { capture = false } = attr;
      // If capture is true, the event should be triggered when capture stage
      // Bind the rootElement to ensure the handler context is the element itself
      element.addEventListener(eventName, handler.bind(rootElement), capture);
    } else if (name in element) {
      // Verify that there is a target property on the element
      element[name] = toRaw(value);
    } else {
      element.setAttribute(name, value);
    }
  }
}
