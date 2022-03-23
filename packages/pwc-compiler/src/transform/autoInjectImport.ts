import type { File } from '@babel/types';
import * as t from '@babel/types';
import babelTraverse from '@babel/traverse';

function createImportDeclaration(source: string, imported: Array<string>) {
  const specifiers = imported.map(i => t.importSpecifier(t.identifier(i), t.identifier(i)));
  return t.importDeclaration(specifiers, t.stringLiteral(source));
}


export default function autoInjectImport(ast: File, { imported, source }): void {
  babelTraverse(ast, {
    Program(path) {
      const { node } = path;
      const importDeclaration = createImportDeclaration(source, imported);
      node.body.unshift(importDeclaration);
    },
  });
}
