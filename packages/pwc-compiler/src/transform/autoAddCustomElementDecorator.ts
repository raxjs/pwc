import type { File } from '@babel/types';
import * as t from '@babel/types';
import babelTraverse from '@babel/traverse';
import { toDash } from '../utils';

// e.g. @customElement('__custom-component')
function createCallExpressionDecorator(decorator: string, argument) {
  return t.decorator(t.callExpression(t.identifier(decorator), [t.stringLiteral(argument)]));
}

export default function autoAddCustomElementDecorator(ast: File): boolean {
  let shouldAutoAddCustomElementDecorator = true;
  babelTraverse(ast, {
    // Add @__customElement('custom-component') for class
    ExportDefaultDeclaration(path) {
      const { node } = path;
      const { declaration } = node;
      if (t.isClassDeclaration(declaration)) {
        if (!declaration.decorators || declaration.decorators.length === 0) {
          const { id } = declaration;
          // TODO:component name
          declaration.decorators = [createCallExpressionDecorator('__customElement', toDash(id.name))];
        } else {
          shouldAutoAddCustomElementDecorator = false;
        }
      }
    },
  });
  return shouldAutoAddCustomElementDecorator;
}
