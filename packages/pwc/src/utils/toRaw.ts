import { ReactiveFlags } from '../constants';

export function toRaw<T>(observed: T): T {
  const raw = observed && observed[ReactiveFlags.RAW];
  return raw ? toRaw(raw) : observed;
}