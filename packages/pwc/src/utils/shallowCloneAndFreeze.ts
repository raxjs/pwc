import { isArray, isObject, isMap, isSet } from './common';

// Shallow Clone the Property value and Freeze it
// Attention, this only clone Set\Map\Array\Object([Object, Object])
// and freeze Array\Object props
export function shallowCloneAndFreeze(value: any) {
  let props: any;

  if (isSet(value)) {
    props = new Set(value);
    return props;
  }

  if (isMap(value)) {
    props = new Map(value);
    return props;
  }

  if (isArray(value)) {
    props = [...value];
    Object.freeze(props);
    return props;
  }

  if (isObject(value)) {
    for (let propName in value) {
      props[propName] = value[propName];
    }

    Object.freeze(props);
    return props;
  }

  return value;
}