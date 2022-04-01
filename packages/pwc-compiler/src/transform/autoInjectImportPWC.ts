import type { File } from '@babel/types';
import * as t from '@babel/types';
import babelTraverse from '@babel/traverse';

// e.g. import { reactive, customElement } from 'pwc'
function createImportDeclaration(source: string, imported: Array<string>) {
  const specifiers = imported.map(im => t.importSpecifier(t.identifier(im), t.identifier(im)));
  return t.importDeclaration(specifiers, t.stringLiteral(source));
}

// create import specifier expression, e.g. the { reactive } of import { reactive } from 'pwc'
function createImportSpecifier(importedName) {
  return t.importSpecifier(t.identifier(importedName), t.identifier(importedName));
}

const shouldImportedFromPWC = ['reactive', 'customElement'];

export default function autoInjectImportPWC(ast: File): void {
  babelTraverse(ast, {
    Program(path) {
      let hasImportPWC = false;
      const hasImportedFromPWC = shouldImportedFromPWC.reduce((prev, cur) => {
        return Object.assign(prev, {
          [cur]: false,
        });
      }, {});
      path.traverse({
        ImportDeclaration(path) {
          const { node } = path;
          if (t.isLiteral(node.source) && node.source.value === 'pwc') {
            hasImportPWC = true;
            node.specifiers.forEach(specifier => {
              if (t.isImportSpecifier(specifier) && t.isIdentifier(specifier.imported)) {
                const importedName = specifier.imported.name;
                hasImportedFromPWC[importedName] = true;
              }
            });
            Object.entries(hasImportedFromPWC).forEach(([importedName, hasImported]) => {
              if (!hasImported) {
                node.specifiers.push(createImportSpecifier(importedName));
              }
            });
          }
        },
      });

      if (!hasImportPWC) {
        const { node } = path;
        const importDeclaration = createImportDeclaration('pwc', shouldImportedFromPWC);
        node.body.unshift(importDeclaration);
      }
    },
  });
}
