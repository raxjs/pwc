import type { File } from '@babel/types';
import * as t from '@babel/types';
import babelTraverse from '@babel/traverse';
import * as babelParser from '@babel/parser';
import type { ValueDescriptor } from '../compileTemplate';
import { isEventName } from '../utils';

const THIS_EXPRESSION_REG = /^this[.|[]/;

function isThisExpression(expression: string): boolean {
  return THIS_EXPRESSION_REG.test(expression);
}

/**
 * Recursively get property name of this member expression
 */
function getThisMemberExpressionPropertyName(ast: t.MemberExpression): string | null {
  if (t.isThisExpression(ast.object)) {
    if (t.isStringLiteral(ast.property)) {
      return ast.property.value;
    } else if (t.isIdentifier(ast.property)) {
      return ast.property.name;
    } else if (t.isPrivateName(ast.property)) {
      return `#${ast.property.id.name}`;
    }
  } else if (t.isMemberExpression(ast.object)) {
    return getThisMemberExpressionPropertyName(ast.object);
  }
  return null;
}

/**
 * If expression is MemberExpression and it's object is ThisExpression
 * then return the object name
 * e.g.
 * this.name => name
 * this.data.name => data
 * this['data'].name => data
*/
function getClassPropertyName(expression: string): string | null {
  if (isThisExpression(expression)) {
    // Set errorRecovery to true to avoid private name parsing error
    const ast = babelParser.parseExpression(expression, { errorRecovery: true });
    if (t.isMemberExpression(ast)) {
      return getThisMemberExpressionPropertyName(ast);
    }
  }
  return null;
}

function extractClassPropertyUsedInTemplate(values: ValueDescriptor) {
  const classPropertyUsedInTemplate = [];
  const shouldCollectProperty = classPropertyName =>
    classPropertyName && !classPropertyUsedInTemplate.includes(classPropertyName);

  values.forEach(each => {
    if (typeof each === 'string') {
      const classPropertyName = getClassPropertyName(each);
      if (shouldCollectProperty(classPropertyName)) {
        classPropertyUsedInTemplate.push(classPropertyName);
      }
    } else {
      each.forEach(({ name, value }) => {
        if (typeof value === 'string' && !isEventName(name)) {
          const classPropertyName = getClassPropertyName(value);
          if (shouldCollectProperty(classPropertyName)) {
            classPropertyUsedInTemplate.push(classPropertyName);
          }
        }
      });
    }
  });
  return classPropertyUsedInTemplate;
}

// e.g. @reactive
function createIdentifierDecorator(decorator: string) {
  return t.decorator(t.identifier(decorator));
}

export default function autoAddReactiveDecorator(ast: File, values: ValueDescriptor): boolean {
  let hasReactiveVariableInTemplate = false;

  const classPropertyUsedInTemplate = extractClassPropertyUsedInTemplate(values);
  babelTraverse(ast, {
    // Add @reactive for class fields
    ClassProperty(path) {
      const { node } = path;
      if (t.isIdentifier(node.key) && classPropertyUsedInTemplate.includes(node.key.name)) {
        if (!node.decorators || node.decorators.length === 0) {
          node.decorators = [createIdentifierDecorator('reactive')];
          hasReactiveVariableInTemplate = true;
        }
      }
    },

    ClassPrivateProperty(path) {
      const { node } = path;
      if (t.isPrivateName(node.key) && classPropertyUsedInTemplate.includes(`#${node.key.id.name}`)) {
        if (!node.decorators || node.decorators.length === 0) {
          node.decorators = [createIdentifierDecorator('reactive')];
          hasReactiveVariableInTemplate = true;
        }
      }
    },
  });
  return hasReactiveVariableInTemplate;
}
