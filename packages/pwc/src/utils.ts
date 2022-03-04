export function hasOwnProperty(target, key) {
  return Object.prototype.hasOwnProperty.call(target, key);
}
