import { ReactiveFlags } from '../constants';

export function toRaw<T>(observed: T): T {
  const raw = observed && observed[ReactiveFlags.RAW];
  return raw ? toRaw(raw) : observed;
}

// get the propNames which the reactive obj created from
export function getProperties(observed): Set<string> | undefined {
  return observed && observed[ReactiveFlags.PROPERTY] ? observed[ReactiveFlags.PROPERTY] : undefined;
}

export function isReactive(observed): boolean {
  return observed && observed[ReactiveFlags.IS_REACTIVE];
}
