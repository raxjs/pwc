import type { SFCDescriptor } from './parse';

export function compileStyle(descriptor: SFCDescriptor): string {
  // TODO: add postcss
  return descriptor.style.content;
}
