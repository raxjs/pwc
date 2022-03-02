// import type { SFCDescriptor } from '@pwc/compiler';

// const cache = new Map<string, SFCDescriptor>();

const cache = new Map();

export function setDescriptor(id: string, entry) {
  cache.set(id, entry);
}

export function getDescriptor(id: string) {
  if (cache.has(id)) {
    return cache.get(id)!;
  }

  throw new Error(`${id} is not parsed yet`);
}
