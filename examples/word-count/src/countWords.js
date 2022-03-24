export function countWords(node){
  const text = node.innerText || node.textContent;
  if (text.length === 1 && text === '\n') {
    return 0;
  }
  return text.split(/\s+/g).length;
}
