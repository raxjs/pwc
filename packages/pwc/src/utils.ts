export function hasOwnProperty(target, key) {
  return Object.prototype.hasOwnProperty.call(target, key);
}

export function isEvent(attrName: string): boolean {
  // When attribute name startWith on, it should be an event
  return attrName.startsWith('on');
}
