import type { File } from '@babel/types';
import * as t from '@babel/types';
import babelTraverse from '@babel/traverse';
import toDash from '../utils/toDash';
import type { attributeDescriptor } from '../compileTemplate';

function extractBindings(values: Array<attributeDescriptor | string>) {
  const bindings = [];
  values.forEach(value => {
    if (typeof value === 'string') {
      bindings.push(value);
    } else {
      Object.keys(value).forEach(key => {
        if (typeof value[key] === 'string') {
          bindings.push(value[key]);
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

// e.g. @customElement('custom-component')
function createCallExpressionDecorator(decorator: string, argument) {
  return t.decorator(t.callExpression(t.identifier(decorator), [t.stringLiteral(argument)]));
}

export default function autoAddDecorator(ast: File, values: Array<attributeDescriptor | string>): void {
  const bindings = extractBindings(values);

  babelTraverse(ast, {
    // Add @customElement('custom-component') for class
    ExportDefaultDeclaration(path) {
      const { node } = path;
      const { declaration } = node;
      if (t.isClassDeclaration(declaration)) {
        if (!declaration.decorators || declaration.decorators.length === 0) {
          const { id } = declaration;
          // TODO:component name
          declaration.decorators = [createCallExpressionDecorator('customElement', toDash(id.name))];
        }
      }
    },
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
      if (t.isPrivateName(node.key) && bindings.includes(node.key.id.name)) {
        if (!node.decorators || node.decorators.length === 0) {
          node.decorators = [createIdentifierDecorator('reactive')];
        }
      }
    },
  });
}
