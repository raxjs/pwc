export function isEventName(attrName: string): boolean {
  // When attribute name startWith on, it should be an event
  return attrName.startsWith('on');
}
