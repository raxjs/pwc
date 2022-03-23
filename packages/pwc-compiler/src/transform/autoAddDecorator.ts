import type { File } from '@babel/types';
import * as t from '@babel/types';
import babelTraverse from '@babel/traverse';

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

export default function autoAddDecorator(ast: File, values: Array<object | string>): void {
  const bindings = extractBindings(values);

  babelTraverse(ast, {
    ExportDefaultDeclaration(path) {
      const { node } = path;
      const { declaration } = node;
      if (t.isClassDeclaration(declaration)) {
        if (!declaration.decorators || declaration.decorators.length === 0) {
          declaration.decorators = [createDecorator('customElement')];
        }
      }
    },
    ClassProperty(path) {
      const { node } = path;
      if (t.isIdentifier(node.key) && bindings.includes(node.key.name)) {
        if (!node.decorators || node.decorators.length === 0) {
          node.decorators = [createDecorator('reactive')];
        }
      }
    },
    ClassPrivateProperty(path) {
      const { node } = path;
      if (t.isPrivateName(node.key) && bindings.includes(node.key.id.name)) {
        if (!node.decorators || node.decorators.length === 0) {
          node.decorators = [createDecorator('reactive')];
        }
      }
    },
  });
}
