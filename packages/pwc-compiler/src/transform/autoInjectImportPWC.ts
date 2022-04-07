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

// customElement must be imported
// reactive should be imported if shouldImportReactive is true
const shouldImportedFromPWC = ['customElement', 'reactive'];

export default function autoInjectImportPWC(ast: File, shouldImportReactive: boolean): void {
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
          // has imported pwc manually
          // should check whether specifiers have been imported
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
                if (importedName !== 'reactive' || shouldImportReactive) {
                  node.specifiers.push(createImportSpecifier(importedName));
                }
              }
            });
          }
        },
      });

      // not import pwc in original code
      // should generate import declaration
      if (!hasImportPWC) {
        const { node } = path;
        const importSpecifiers = shouldImportReactive ? shouldImportedFromPWC : shouldImportedFromPWC.slice(0, 1);
        const importDeclaration = createImportDeclaration('pwc', importSpecifiers);
        node.body.unshift(importDeclaration);
      }
    },
  });
}
