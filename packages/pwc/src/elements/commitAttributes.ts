import { isEvent } from '../utils/isEvent';
import type { Attributes, PWCElement } from '../type';
import { toRaw } from '../utils';

export function commitAttributes(element: Element, attrs: Attributes, opt?: {
  isInitial?: boolean;
  rootElement?: PWCElement;
  isSVG?: boolean;
}) {
  const {
    isInitial = false,
    isSVG = false,
    rootElement,
  } = opt || {};
  for (const attr of attrs) {
    // Bind event
    if (isEvent(attr)) {
      const { name } = attr;

      // Only add event listener at the first render
      if (!isInitial) {
        continue;
      }
      const eventName = name.slice(2).toLowerCase();
      const { capture = false, handler } = attr;
      // If capture is true, the event should be triggered when capture stage
      // Bind the rootElement to ensure the handler context is the element itself
      element.addEventListener(eventName, handler.bind(rootElement), capture);

      continue;
    }

    const { name, value } = attr;

    if (isSVG) {
      // https://svgwg.org/svg2-draft/struct.html#InterfaceSVGSVGElement
      // Svg elements must be set as attributes, all properties is read only
      element.setAttribute(name, value);
    } else if (name in element) {
      // Verify that there is a target property on the element
      element[name] = toRaw(value);
    } else {
      element.setAttribute(name, value);
    }
  }
}
