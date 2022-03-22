export function isEventName(key: string): boolean {
  return key.startsWith('on');
}
