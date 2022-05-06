import type { Attribute, EventAttribute } from '../type';
import { isFunction } from './checkTypes';

export function isEvent(attr: Attribute): attr is EventAttribute {
  // When attribute name startWith on, it should be an event
  return attr.name.startsWith('on') && isFunction(attr.handler);
}
