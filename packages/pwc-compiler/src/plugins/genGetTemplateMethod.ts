import type { PluginItem } from '@babel/core';
import * as t from '@babel/types';

function createObjectProperty(key, value) {
  // must bind this
  if (typeof value === 'string') {
    const isConfigEventType = key === 'type' && (value === 'bubble' || value === 'capture');
    return t.objectProperty(
      t.identifier(key),
      isConfigEventType ? t.stringLiteral(value) : createThisMemberExpression(value),
    );
  } else if (typeof value === 'object') {
    return t.objectProperty(t.identifier(key), createObjectExpression(value));
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

export default function (value) {
  return function (): PluginItem {
    return {
      visitor: {
        ClassDeclaration(path) {
          // export default class
          if (t.isExportDefaultDeclaration(path.parent)) {
            const { node } = path;
            // class must extended from HTMLElement
            if (t.isIdentifier(node.superClass) && node.superClass.name === 'HTMLElement') {
              if (Array.isArray(value)) {
                const returnExpression = t.arrayExpression(value.map((v) => {
                  if (Array.isArray(v)) {
                    // 1. values
                    return createArrayExpression(v.map((x) => {
                      if (typeof x === 'string') {
                        // 2.1 variables
                        return createThisMemberExpression(x);
                      } else {
                        // x: { src: 'source' }
                        /*
                          {
                            onclick: {
                              handler: this.onClick,
                              type: 'capture',
                            },
                            title: this.title
                          }
                        */


                        // 2.2 events and props
                        // return t.stringLiteral(JSON.stringify(x));
                        return createObjectExpression(x);
                      }
                    }));
                  } else {
                    // 2. template string
                    return t.stringLiteral(v);
                  }
                }));
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
              } else {
                throw new Error('return value must be an array');
              }
            }
          }
        },
      },
    };
  };
}

