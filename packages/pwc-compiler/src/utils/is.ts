// When attribute name startsWith @ in template, it should be an event
export function isEventNameInTemplate(name: string): boolean {
  return name.startsWith('@');
}

export function isEventName(name: string): boolean {
  return name.startsWith('on');
}

export function isPrivateField(field: string): boolean {
  return field.startsWith('#');
}

export const BINDING_REGEXP = /\{\{\s*([\s\S]*?)\s*\}\}/;
export const INTERPOLATION_REGEXP = /\{\{\s*([\s\S]*?)\s*\}\}/g;

export function isBindings(value: string): boolean {
  return BINDING_REGEXP.test(value);
}
