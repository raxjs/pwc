export function hasOwnProperty(target, key) {
  return Object.prototype.hasOwnProperty.call(target, key);
}

export function isArray(arg: any) {
  return Array.isArray(arg);
}

export function isPrimitive(value: unknown) {
  return value === null || (typeof value !== 'object' && typeof value !== 'function');
}

export function is(prev, curr): boolean {
  // SameValue algorithm
  if (prev === curr) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return prev !== 0 || 1 / prev === 1 / curr;
  } else {
    // Step 6.a: NaN == NaN
    return prev !== prev && curr !== curr; // eslint-disable-line no-self-compare
  }
}