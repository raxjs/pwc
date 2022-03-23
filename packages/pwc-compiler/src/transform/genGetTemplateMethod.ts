import type { File } from '@babel/types';
import * as t from '@babel/types';
import babelTraverse from '@babel/traverse';

import type { compileTemplateResult } from '../compileTemplate';

function createObjectProperty(key, value) {
  if (typeof value === 'string') {
    const isHandler = key === 'handler';
    let valueExpression;
    if (isHandler) {
      valueExpression = t.callExpression(t.memberExpression(createThisMemberExpression(value), t.identifier('bind')), [t.thisExpression()]); // bind this
    } else {
      valueExpression = createThisMemberExpression(value);
    }
    return t.objectProperty(t.identifier(key), valueExpression);
  } else if (typeof value === 'object') {
    return t.objectProperty(t.identifier(key), createObjectExpression(value));
  } else if (key === 'capture') {
    return t.objectProperty(t.identifier(key), t.booleanLiteral(value));
  }
}

function createObjectExpression(obj: object) {
  return t.objectExpression(Object.entries(obj).map(([key, value]) => {
    return createObjectProperty(key, value);
  }));
}

function createArrayExpression(elements) {
  return t.arrayExpression(elements);
}

function createThisMemberExpression(value) {
  return t.memberExpression(t.thisExpression(), t.stringLiteral(value), true);
}

export default function genGetTemplateMethod(ast: File, templateResult: compileTemplateResult): void {
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
              return createThisMemberExpression(val);
            } else {
              // 2. events and props
              /*
                example:
                {
                  onclick: {
                    handler: 'onClick',
                    capture: true,
                  },
                  title: 'title'
                }
              */
              return createObjectExpression(val);
            }
          }));

          const returnExpression = t.arrayExpression([templateStringExpression, templateValuesExpression]);
          node.body.body.push(
            t.classMethod(
              'get',
              t.identifier('template'),
              [],
              t.blockStatement(
                [t.returnStatement(returnExpression)],
              ),
            ),
          );
        }
      }
    },
  });
}
