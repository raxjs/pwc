import { TemplateData, TemplateFlag, TemplateString } from '../constants';
import { hasOwnProperty } from './common';

export const EMPTY_OBJECT = {};

export function isArray(arg: any) {
  return Array.isArray(arg);
}

export function isPrimitive(value: unknown) {
  return value === null || (typeof value !== 'object' && typeof value !== 'function');
}

export function isBoolean(value: unknown) {
  return typeof value === 'boolean';
}

export function isFunction(value: unknown) {
  return typeof value === 'function';
}

export function isObject(value: unknown) {
  return typeof value === 'object';
}

export function isPlainObject(value: unknown) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function isSet(value: unknown) {
  return value instanceof Set;
}

export function isMap(value: unknown) {
  return value instanceof Map;
}

export function isPrivate(name: string) {
  return name.startsWith('#');
}

export function isTemplate(value: unknown): boolean {
  return (
    value &&
    value[TemplateFlag] === true &&
    hasOwnProperty(value, TemplateString) &&
    hasOwnProperty(value, TemplateData)
  );
}

export function isFalsy(value: unknown) {
  return !value && value !== 0;
}
export function toRawType(value: unknown): string {
  return Object.prototype.toString.call(value).slice(8, -1);
}
