import type { PluginItem } from '@babel/core';
import * as t from '@babel/types';

function extractBindings(values: Array<object | string>) {
  const bindings = [];
  values.forEach(value => {
    if (typeof value === 'string') {
      bindings.push(value);
    } else {
      Object.keys(value).forEach(k => {
        if (typeof value[k] === 'string') {
          bindings.push(value[k]);
        }
      });
    }
  });
  return bindings;
}

function createDecorator(decorator: string) {
  return t.decorator(t.identifier(decorator));
}

export default function (values: Array<object | string>, decorator: string) {
  const bindings = extractBindings(values);
  return function (): PluginItem {
    return {
      visitor: {
        ClassProperty(path) {
          const { node } = path;
          if (t.isIdentifier(node.key) && bindings.includes(node.key.name)) {
            if (!node.decorators || node.decorators.length === 0) {
              node.decorators = [createDecorator(decorator)];
            }
          }
        },
        ClassPrivateProperty(path) {
          const { node } = path;
          if (t.isPrivateName(node.key) && bindings.includes(node.key.id.name)) {
            if (!node.decorators || node.decorators.length === 0) {
              node.decorators = [createDecorator(decorator)];
            }
          }
        },
      },
    };
  };
}

