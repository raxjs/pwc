import type { File } from '@babel/types';
import * as t from '@babel/types';
import babelTraverse from '@babel/traverse';
import { isPrivateField } from '../utils';

import type { CompileTemplateResult } from '../compileTemplate';

function createObjectProperty(key, value, isEvent = false) {
  if (key === 'value') {
    let valueExpression;
    if (isEvent) {
      // this.xxx.bind(this)
      valueExpression = t.callExpression(t.memberExpression(createThisMemberExpression(value, !isPrivateField(value)), t.identifier('bind')), [t.thisExpression()]);
    } else {
      // this.xxx
      valueExpression = createThisMemberExpression(value, !isPrivateField(value));
    }
    return t.objectProperty(t.identifier(key), valueExpression);
  } else if (key === 'name') {
    return t.objectProperty(t.identifier(key), t.stringLiteral(value));
  } else if (key === 'capture') {
    return t.objectProperty(t.identifier(key), t.booleanLiteral(value));
  }
}

function createObjectExpression(obj: object) {
  const isEvent = 'capture' in obj;
  return t.objectExpression(Object.entries(obj).map(([key, value]) => {
    return createObjectProperty(key, value, isEvent);
  }));
}

function createArrayExpression(elements) {
  return t.arrayExpression(elements);
}

// If computed is true, return this['xxx']
// else return this.xxx
function createThisMemberExpression(value, computed = true) {
  if (computed) {
    return t.memberExpression(t.thisExpression(), t.stringLiteral(value), computed);
  } else {
    return t.memberExpression(t.thisExpression(), t.identifier(value), computed);
  }
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
              return createThisMemberExpression(val, !isPrivateField(val));
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
