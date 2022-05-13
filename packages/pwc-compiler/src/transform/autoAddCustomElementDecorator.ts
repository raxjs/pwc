import type { File } from '@babel/types';
import t from '@babel/types';
import babelTraverse from '@babel/traverse';
import { toDash } from '../utils/index.js';

const CUSTOM_ELEMENT_DECORATOR = '__customElement';

// e.g. @customElement('__custom-component')
function createCallExpressionDecorator(decorator: string, argument) {
  return t.decorator(t.callExpression(t.identifier(decorator), [t.stringLiteral(argument)]));
}

export default function autoAddCustomElementDecorator(ast: File): boolean {
  let shouldAutoAddCustomElementDecorator = true;
  babelTraverse.default(ast, {
    // Add @__customElement('custom-component') for class
    ExportDefaultDeclaration(path) {
      const { node } = path;
      const { declaration } = node;
      if (t.isClassDeclaration(declaration)) {
        if (!declaration.decorators || declaration.decorators.length === 0) {
          const { id } = declaration;
          // TODO:component name
          declaration.decorators = [createCallExpressionDecorator(CUSTOM_ELEMENT_DECORATOR, toDash(id.name))];
        } else {
          shouldAutoAddCustomElementDecorator = false;
        }
      }
    },
  });
  return shouldAutoAddCustomElementDecorator;
}
