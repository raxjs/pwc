import type { File } from '@babel/types';
import * as t from '@babel/types';
import babelTraverse from '@babel/traverse';
import type { ElementNode } from './parse';

export function validateScript(ast: File) {
  const errors = [];
  babelTraverse(ast, {
    // TODO: script validation
    Program(path) {
      const { node } = path;
      const exportDefaultDeclarationNode = node.body.filter(n => t.isExportDefaultDeclaration(n));
      if (!exportDefaultDeclarationNode) {
        errors.push(new SyntaxError('PWC must allow one export default'));
      }
    },
    ExportDefaultDeclaration(path) {
      const { node } = path;
      const { declaration } = node;
      if (!t.isClassDeclaration(declaration)) {
        errors.push(new SyntaxError('PWC must export a class'));
      } else if (!t.isIdentifier(declaration.superClass) || declaration.superClass.name !== 'HTMLElement') {
        errors.push(new SyntaxError('PWC must export a class extended from HTMLElement'));
      }
    },
  });

  return errors;
}

export function validateTemplate(ast: ElementNode) {
  const errors = [];
  // TODO:  traverse ast to validate
  return errors;
}
