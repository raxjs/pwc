export function toDash(str: string) {
  return `${str[0].toLowerCase()}${str.slice(1)}`.replace(/[A-Z]/g, all => `-${all.toLowerCase()}`);
}
