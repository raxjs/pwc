import type { File } from '@babel/types';
import * as t from '@babel/types';
import babelTraverse from '@babel/traverse';
import type { attributeDescriptor } from '../compileTemplate';

function extractBindings(values: Array<string | Array<attributeDescriptor>>) {
  const bindings = [];
  values.forEach(each => {
    if (typeof each === 'string') {
      bindings.push(each);
    } else {
      each.forEach(({ value }) => {
        if (typeof value === 'string') {
          bindings.push(value);
        }
      });
    }
  });
  return bindings;
}

// e.g. @reactive
function createIdentifierDecorator(decorator: string) {
  return t.decorator(t.identifier(decorator));
}

export default function autoAddDecorator(ast: File, values: Array<string | Array<attributeDescriptor>>): void {
  const bindings = extractBindings(values);

  babelTraverse(ast, {
    // Add @reactive for class fields
    ClassProperty(path) {
      const { node } = path;
      if (t.isIdentifier(node.key) && bindings.includes(node.key.name)) {
        if (!node.decorators || node.decorators.length === 0) {
          node.decorators = [createIdentifierDecorator('reactive')];
        }
      }
    },

    ClassPrivateProperty(path) {
      const { node } = path;
      if (t.isPrivateName(node.key) && bindings.includes(`#${node.key.id.name}`)) {
        if (!node.decorators || node.decorators.length === 0) {
          node.decorators = [createIdentifierDecorator('reactive')];
        }
      }
    },
  });
}
