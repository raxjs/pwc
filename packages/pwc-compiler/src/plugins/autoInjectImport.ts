import type { PluginItem } from '@babel/core';
import * as t from '@babel/types';

function createBareImportDeclaration(source) {
  return t.importDeclaration([], t.stringLiteral(source));
}

export default function (source) {
  return function (): PluginItem {
    return {
      visitor: {
        Program(path) {
          const { node } = path;
          node.body.unshift(createBareImportDeclaration(source));
        },
      },
    };
  };
}

