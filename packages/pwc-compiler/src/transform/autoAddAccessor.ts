import type { File } from '@babel/types';
import t from '@babel/types';
import babelTraverse from '@babel/traverse';

function isIncludeReactiveDecorator(decorators: Array<t.Decorator>): boolean {
  return decorators.some(decorator => t.isIdentifier(decorator.expression) && decorator.expression.name === 'reactive');
}

function createClassAccessorPropertyFromClassProperty(node: t.ClassProperty | t.ClassPrivateProperty) {
  // TODO: computed and _static
  const { key, value, typeAnnotation, decorators } = node;
  return t.classAccessorProperty(key, value, typeAnnotation, decorators);
}

export default function autoAddDecorator(ast: File): void {
  babelTraverse.default(ast, {
    ClassProperty(path) {
      const { node } = path;
      // replace ClassProperty with ClassAccessorProperty
      if (node.decorators && isIncludeReactiveDecorator(node.decorators)) {
        path.replaceWith(createClassAccessorPropertyFromClassProperty(node));
      }
    },
    ClassPrivateProperty(path) {
      const { node } = path;
      // replace ClassPrivateProperty with ClassAccessorProperty
      if (node.decorators && isIncludeReactiveDecorator(node.decorators)) {
        path.replaceWith(createClassAccessorPropertyFromClassProperty(node));
      }
    },
  });
}
