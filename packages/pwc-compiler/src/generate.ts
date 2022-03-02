import type { SFCDescriptor } from './parse';

export function genTemplateCode(descriptor: SFCDescriptor) {
  return descriptor.template.content;
}

export function genScriptCode(descriptor: SFCDescriptor) {
  return descriptor.script.content;
}

export function genStyleCode(descriptor: SFCDescriptor) {
  return descriptor.styles.content;
}
