import type { File } from '@babel/types';
import t from '@babel/types';
import babelTraverse from '@babel/traverse';
import type { ElementNode } from './parse.js';
import { type CompilerError, createCompilerError, ErrorCodes } from './errors.js';

export function validateScript(ast: File, source: string): CompilerError[] {
  const errors: CompilerError[] = [];
  babelTraverse.default(ast, {
    // TODO: script validation
    Program(path) {
      const { node } = path;
      const exportDefaultDeclarationNode = node.body.filter(nn => t.isExportDefaultDeclaration(nn));
      if (!exportDefaultDeclarationNode.length) {
        const err = createCompilerError(ErrorCodes.MISSING_EXPORT_DEFAULT, {
          start: node.loc.start,
          end: node.loc.end,
          source,
        });
        errors.push(err);
      }
    },
    ExportDefaultDeclaration(path) {
      const { node } = path;
      const { declaration } = node;
      if (!t.isClassDeclaration(declaration)) {
        const err = createCompilerError(ErrorCodes.MISSING_EXPORT_CLASS, {
          start: node.loc.start,
          end: node.loc.end,
          source,
        });
        errors.push(err);
      } else if (!t.isIdentifier(declaration.superClass) || declaration.superClass.name !== 'HTMLElement') {
        const err = createCompilerError(ErrorCodes.MISSING_EXPORT_CLASS_EXTENDED_FROM_HTMLELEMENT, {
          start: node.loc.start,
          end: node.loc.end,
          source,
        });
        errors.push(err);
      }
    },
  });

  return errors;
}

export function validateTemplate(ast: ElementNode) {
  const errors: CompilerError[] = [];
  // TODO:  traverse ast to validate
  return errors;
}
