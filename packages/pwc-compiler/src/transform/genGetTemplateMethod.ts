import type { File } from '@babel/types';
import * as t from '@babel/types';
import babelTraverse from '@babel/traverse';
import { isPrivateField } from '../utils/index.js';

import type { compileTemplateResult } from '../compileTemplate.js';

function createObjectProperty(key, value) {
  if (typeof value === 'string') {
    const isHandler = key === 'handler';
    let valueExpression;
    if (isHandler) {
      // this.xxx.bind(this)
      valueExpression = t.callExpression(t.memberExpression(createThisMemberExpression(value, !isPrivateField(value)), t.identifier('bind')), [t.thisExpression()]);
    } else {
      // this.xxx
      valueExpression = createThisMemberExpression(value, !isPrivateField(key));
    }
    return t.objectProperty(t.identifier(key), valueExpression);
  } else if (typeof value === 'object') {
    // [key]: {}
    return t.objectProperty(t.identifier(key), createObjectExpression(value));
  } else if (key === 'capture') {
    // capture: true/false
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
              return createThisMemberExpression(val, !isPrivateField(val));
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
          const returnExpression = createArrayExpression([templateStringExpression, templateValuesExpression]);
          node.body.body.push(cretateGetTemplateClassMethod(returnExpression));
        }
      }
    },
  });
}
