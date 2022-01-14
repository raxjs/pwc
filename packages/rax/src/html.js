export function html(strings, ...values) {
  return strings.reduce((curr, next, index) => {
    // The initial index value is 1
    console.log('next ===> ', values);
    if (values[index - 1] && values[index - 1].type === 'text') {
      return `${curr}${values[index - 1].value}${next}`;
    }

    return `${curr}${next}`;
  });
}

export function bindTextNode(value) {
  return {
    type: 'text',
    value,
  };
}

export function bindEvent(nodeId, { type, fn }) {
  this.nextTick(() => {
    const node = this.root.getElementById(nodeId);
    if (node) {
      node.addEventListener(type, fn.bind(this));
    }
  });
  return {
    type: 'event',
  };
}
