import type { File } from '@babel/types';
import t from '@babel/types';
import babelTraverse from '@babel/traverse';

interface injectImportPWCDescriptor {
  customElement: boolean;
  reactive: boolean;
}

// e.g. import { reactive as __reactive, customElement as __customElement } from 'pwc'
function createImportDeclaration(source: string, imported: Array<string>) {
  const specifiers = imported.map(im => t.importSpecifier(t.identifier(`__${im}`), t.identifier(im)));
  return t.importDeclaration(specifiers, t.stringLiteral(source));
}

// create import specifier expression, e.g. the { reactive as __reactive } of import { reactive } from 'pwc'
function createImportSpecifier(importedName) {
  return t.importSpecifier(t.identifier(`__${importedName}`), t.identifier(importedName));
}

export default function autoInjectImportPWC(ast: File, importDescriptor: injectImportPWCDescriptor): void {
  const importSpecifiers = Object.keys(importDescriptor).filter(specifier => importDescriptor[specifier]);
  babelTraverse(ast, {
    Program(path) {
      let hasImportPWC = false;
      path.traverse({
        ImportDeclaration(path) {
          const { node } = path;
          // Has imported pwc manually
          // Should check whether specifiers have been imported
          if (t.isLiteral(node.source) && node.source.value === 'pwc') {
            hasImportPWC = true;
            importSpecifiers.forEach((importedName) => {
              node.specifiers.push(createImportSpecifier(importedName));
            });
          }
        },
      });

      // Not import pwc in original code
      // Should generate import declaration
      if (!hasImportPWC) {
        const { node } = path;
        const importDeclaration = createImportDeclaration('pwc', importSpecifiers);
        node.body.unshift(importDeclaration);
      }
    },
  });
}
