import type { EventAttribute } from '../type';
import { isFunction } from './checkTypes';

export function isEvent(attr: EventAttribute): boolean {
  // When attribute name startWith on, it should be an event
  return attr.name.startsWith('on') && isFunction(attr.handler);
}
