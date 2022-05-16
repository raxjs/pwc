import { toRaw } from '../../../reactivity/methods';
import type { Attribute, Attributes, NormalAttribute, PWCElement } from '../../../type';
import { is, isArray, isEvent } from '../../../utils';

type IsAttributeChanged = (attr: NormalAttribute) => boolean;

type Options = {
  isInitial?: boolean;
  rootElement?: PWCElement;
  isSVG?: boolean;
  isAttributeChanged?: IsAttributeChanged;
};

type Handler = (...args: any[]) => any;

const handlerMap: WeakMap<Handler, Handler> = new WeakMap();

function returnTrue() {
  return true;
}

function getHandler(handler: Handler, rootElement?: PWCElement): Handler {
  if (handlerMap.has(handler)) {
    return handlerMap.get(handler);
  }
  const newHandler = handler.bind(rootElement || null);
  handlerMap.set(handler, newHandler);
  return newHandler;
}

function isAttributes(attrs: Attributes | [Attributes, Attributes]): boolean {
  return !isArray(attrs[0]);
}


enum DiffResult {
  'SAME',
  'CHANGED',
  'RESET',
}

function diffAttribute(prevAttr: Attribute, currentAttr: Attribute, isAttributeChanged: IsAttributeChanged): DiffResult {
  if (isEvent(prevAttr)) {
    if (isEvent(currentAttr)) {
      const { handler: prevHandler, capture: prevCapture = false } = prevAttr;
      const { handler: currentHandler, capture: currentCapture = false } = currentAttr;
      if (prevHandler === currentHandler && prevCapture === currentCapture) {
        return DiffResult.SAME;
      }
    }
    // If attribute type is different, or event with same event name changed,
    // it should be remove the old attribute and add the new one
    return DiffResult.RESET;
  }
  if (!isEvent(currentAttr)) {
    if (is(prevAttr.value, currentAttr.value) && !isAttributeChanged(currentAttr)) {
      return DiffResult.SAME;
    }
    return DiffResult.CHANGED;
  }

  // Attribute type is different
  return DiffResult.RESET;
}

function diffAttributes(prevAttrs: Attributes, currentAttrs: Attributes, isAttributeChanged: IsAttributeChanged): {
  changed: Attributes;
  removed: Attributes;
} {
  const currentMap: Map<string, Attribute> = new Map();
  currentAttrs.forEach(attr => currentMap.set(attr.name, attr));
  const changed: Attributes = [];
  const removed: Attributes = [];

  prevAttrs.forEach(prevAttr => {
    const { name } = prevAttr;
    if (currentMap.has(name)) {
      const currentAttr = currentMap.get(name);
      currentMap.delete(name);

      const ret = diffAttribute(prevAttr, currentAttr, isAttributeChanged);
      switch (ret) {
        case DiffResult.CHANGED:
          changed.push(currentAttr);
          break;
        case DiffResult.RESET:
          removed.push(prevAttr);
          changed.push(currentAttr);
        case DiffResult.SAME:
        default:
          break;
      }
    } else {
      removed.push(prevAttr);
    }
  });
  for (let [, attr] of currentMap) {
    changed.push(attr);
  }
  return {
    changed,
    removed,
  };
}

function setAttributes(element: Element, attrs: Attributes, opt?: Options) {
  const {
    // isInitial = false,
    isSVG = false,
    rootElement,
  } = opt || {};
  for (const attr of attrs) {
    // Bind event
    if (isEvent(attr)) {
      const { name } = attr;

      const eventName = name.slice(2).toLowerCase();
      const { capture = false, handler } = attr;
      // If capture is true, the event should be triggered when capture stage
      // Bind the rootElement to ensure the handler context is the element itself
      const newHandler = getHandler(handler, rootElement);
      element.addEventListener(eventName, newHandler, capture);

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

function removeAttributes(element: Element, attrs: Attributes, opt?: Options) {
  const {
    isSVG = false,
    rootElement,
  } = opt || {};
  for (const attr of attrs) {
    if (isEvent(attr)) {
      const { name, capture = false, handler } = attr;
      const eventName = name.slice(2).toLowerCase();
      const newHandler = getHandler(handler, rootElement);
      element.removeEventListener(eventName, newHandler, capture);
      continue;
    }
    const { name } = attr;
    if (isSVG) {
      element.removeAttribute(name);
    } else if (name in element) {
      delete element[name];
    } else {
      element.removeAttribute(name);
    }
  }
}

// Commit attributes, return a boolean, means if updated
export function commitAttributes(
  element: Element,
  attrs: Attributes | [Attributes, Attributes],
  opt?: Options,
): boolean {
  if (attrs.length === 0) {
    return false;
  }
  if (isAttributes(attrs)) {
    setAttributes(element, attrs as Attributes, opt);
    return attrs.length > 0;
  }

  const {
    isAttributeChanged = returnTrue,
  } = opt || {};

  const [prevAttrs, currentAttrs] = attrs as [Attributes, Attributes];
  const {
    changed,
    removed,
  } = diffAttributes(prevAttrs, currentAttrs, isAttributeChanged);

  removeAttributes(element, removed, opt);
  setAttributes(element, changed, opt);
  return changed.length + removed.length > 0;
}
