export function createTemplate(tplStr: string): Node {
  const template = document.createElement('template');
  template.innerHTML = tplStr;

  return template.content.cloneNode(true);
}
