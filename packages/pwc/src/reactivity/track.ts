
type Handler = () => void;

// The propMap stores the connection of target and propNames.
// PropName is a custom element's property.
const propMap = new WeakMap<any, Set<string>>();

// The handlerMap stores the connection of target and handlers.
// Handler is the callback that should triggered when the target changed.
const handlerMap = new WeakMap<any, Set<Handler>>();

export function getPropertyNames(target: any) {
  return propMap.get(target);
}

export function setPropertyNames(target: any, prop: string) {
  const props = getPropertyNames(target);
  if (props) {
    props.add(prop);
  } else {
    propMap.set(target, new Set([prop]));
  }
}

export function getHandlers(target: any) {
  return handlerMap.get(target);
}

export function setHandlers(target: any, handler: () => void) {
  const handlers = getHandlers(target);
  if (handlers) {
    handlers.add(handler);
  } else {
    handlerMap.set(target, new Set([handler]));
  }
}

export function forwardTracks(source: any, target: any) {
  const props = getPropertyNames(source);
  const handlers = getHandlers(source);

  if (props) {
    propMap.set(target, props);
  }
  if (handlers) {
    handlerMap.set(target, handlers);
  }
}

export function keepTrack(target, prop, handler) {
  setPropertyNames(target, prop);
  setHandlers(target, handler);
}

export function runHandlers(target: any) {
  const handlers = getHandlers(target);

  if (handlers) {
    handlers.forEach(handler => handler());
  }
}