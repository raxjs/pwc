import { isArray, isObject, isMap, isSet } from './common';

// Shallow Clone the Property value and Freeze it
// Attention, this only clone Set\Map\Array\Object([Object, Object])
// and freeze Array\Object props
export function shallowCloneAndFreeze(value: any) {
  if (isSet(value)) {
    return new Set(value);
  }

  if (isMap(value)) {
    return new Map(value);
  }

  if (isArray(value)) {
    const props = [...value];
    Object.freeze(props);
    return props;
  }

  if (isObject(value)) {
    const props = Object.assign({}, value);
    Object.freeze(props);
    return props;
  }

  return value;
}