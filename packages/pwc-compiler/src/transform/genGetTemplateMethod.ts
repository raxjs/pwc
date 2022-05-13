import type { File } from '@babel/types';
import t from '@babel/types';
import babelTraverse from '@babel/traverse';

import type { CompileTemplateResult } from '../compileTemplate';

interface objectExpression {
  [key: string]: t.Expression;
}

function createObjectProperty(key: string, value: t.Expression) {
  return t.objectProperty(t.identifier(key), value);
}

function createObjectExpression(obj: objectExpression) {
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

const templateFlag = t.booleanLiteral(true);

export default function genGetTemplateMethod(ast: File, templateResult: CompileTemplateResult): void {
  babelTraverse.default(ast, {
    ClassDeclaration(path) {
      // export default class
      if (t.isExportDefaultDeclaration(path.parent)) {
        const { node } = path;
        // class must extended from HTMLElement
        if (t.isIdentifier(node.superClass) && node.superClass.name === 'HTMLElement') {
          const { templateString, templateData } = templateResult;
          const templateStringExpression = t.stringLiteral(templateString);
          const templateValuesExpression = createArrayExpression(templateData.map(val => {
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
                    handler: 'onClick',
                    capture: true,
                  },
                  {
                    name: 'title',
                    value: '#title'
                  }
                ]
              */
              return createArrayExpression(val.map(attr => {
                const attributeEntries = Object.entries(attr).map(([key, val]) => {
                  let expression;
                  if (key === 'name') {
                    expression = t.stringLiteral(val);
                  } else if (key === 'value' || key === 'handler') {
                    expression = createIdentifier(val);
                  } else if (key === 'capture') {
                    expression = t.booleanLiteral(val);
                  }
                  return [key, expression];
                });
                const attributeObjectExpression = Object.fromEntries(attributeEntries);
                return createObjectExpression(attributeObjectExpression);
              },
              ));
            }
          }));

          const returnExpression = createObjectExpression({
            templateString: templateStringExpression,
            templateData: templateValuesExpression,
            template: templateFlag,
          });

          node.body.body.push(cretateGetTemplateClassMethod(returnExpression));
        }
      }
    },
  });
}
