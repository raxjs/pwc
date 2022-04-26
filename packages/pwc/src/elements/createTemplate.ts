import type { TemplateStringType } from '../type';

export function createTemplate(tplStr: TemplateStringType): Node {
  const template = document.createElement('template');
  template.innerHTML = tplStr;

  return template.content.cloneNode(true);
}
