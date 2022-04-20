import type { File } from '@babel/types';
import * as t from '@babel/types';
import babelTraverse from '@babel/traverse';

import type { CompileTemplateResult, AttributeDescriptor } from '../compileTemplate';

function createObjectProperty(key, value) {
  if (key === 'value') {
    return t.objectProperty(t.identifier(key), createIdentifier(value));
  } else if (key === 'name') {
    return t.objectProperty(t.identifier(key), t.stringLiteral(value));
  } else if (key === 'capture') {
    return t.objectProperty(t.identifier(key), t.booleanLiteral(value));
  }
}

function createObjectExpression(obj: AttributeDescriptor) {
  return t.objectExpression(Object.entries(obj).map(([key, value]) => {
    return createObjectProperty(key, value);
  }));
}

function createArrayExpression(elements) {
  return t.arrayExpression(elements);
}

function createIdentifier(value) {
  return value === '' ? t.stringLiteral('') : t.identifier(value);
}

/**
 *
 * get template() {
 *  return []
 * }
 */
function cretateGetTemplateClassMethod(returnExpression) {
  return t.classMethod(
    'get',
    t.identifier('template'),
    [],
    t.blockStatement(
      [t.returnStatement(returnExpression)],
    ),
  );
}

export default function genGetTemplateMethod(ast: File, templateResult: CompileTemplateResult): void {
  babelTraverse(ast, {
    ClassDeclaration(path) {
      // export default class
      if (t.isExportDefaultDeclaration(path.parent)) {
        const { node } = path;
        // class must extended from HTMLElement
        if (t.isIdentifier(node.superClass) && node.superClass.name === 'HTMLElement') {
          const { templateString, values } = templateResult;
          const templateStringExpression = t.stringLiteral(templateString);
          const templateValuesExpression = createArrayExpression(values.map(val => {
            if (typeof val === 'string') {
              // 1 variables
              return createIdentifier(val);
            } else {
              // 2. events and props
              /*
                example:
                [
                  {
                    name: 'onclick',
                    value: 'onClick',
                    capture: true,
                  },
                  {
                    name: 'title',
                    value: '#title'
                  }
                ]
              */
              return createArrayExpression(val.map(attr => {
                return createObjectExpression(attr);
              }));
            }
          }));
          const returnExpression = createArrayExpression([templateStringExpression, templateValuesExpression]);
          node.body.body.push(cretateGetTemplateClassMethod(returnExpression));
        }
      }
    },
  });
}
