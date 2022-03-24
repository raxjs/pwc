export function isEvent(name: string): boolean {
  // When attribute name startsWith @, it should be an event
  return name.startsWith('@');
}

export function isPrivateField(field: string): boolean {
  return field.startsWith('#');
}

export const BINDING_REGEXP = /\{\{\s*([#\.\w]*)\s*\}\}/;

export function isBindings(value: string): boolean {
  return BINDING_REGEXP.test(value);
}
