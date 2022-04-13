import { ReactiveFlags } from '../constants';

export function toRaw(observed: object): object {
  const raw = observed && observed[ReactiveFlags.RAW];
  return raw ? toRaw(raw) : observed;
}