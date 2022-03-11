export default function dfs(node) {
  const nodes = [];
  if (node !== null) {
    const stack = [];
    stack.push(node);
    while (stack.length > 0) {
      const item = stack.pop();
      nodes.push(item);
      if (item.childNodes) {
        for (let i = item.childNodes.length - 1; i >= 0; i--) {
          stack.push(item.childNodes[i]);
        }
      }
    }
  }
  return nodes;
}
