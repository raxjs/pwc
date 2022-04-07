export function dfs(node) {
  const nodes = [];
  if (node !== null) {
    const stack = [];
    stack.push(node);
    while (stack.length > 0) {
      const item = stack.pop();
      nodes.push(item);
      if (item.childNodes) {
        for (let index = item.childNodes.length - 1; index >= 0; index--) {
          stack.push(item.childNodes[index]);
        }
      }
    }
  }
  return nodes;
}
