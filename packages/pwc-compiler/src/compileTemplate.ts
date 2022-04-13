import * as parse5 from 'parse5';
import type { SFCDescriptor, ElementNode } from './parse';
import { dfs, isEventNameInTemplate, isBindings, getEventInfo, BINDING_REGEXP, INTERPOLATION_REGEXP } from './utils';

export interface AttributeDescriptor {
  name: string;
  value: string;
  capture?: boolean;
}

export type ValueDescriptor = Array<string | Array<AttributeDescriptor>>;

export interface CompileTemplateResult {
  templateString?: string;
  values?: ValueDescriptor;
}

const TEXT_COMMENT_DATA = '?pwc_t';
const PLACEHOLDER_COMMENT_DATA = '?pwc_p';

function createCommentNode(data) {
  return {
    nodeName: '#comment',
    data,
  };
}

function createTextNode(value) {
  return {
    nodeName: '#text',
    value,
  };
}

// with side effect in changing node structure
function extractAttributeBindings(node: ElementNode): Array<AttributeDescriptor> {
  const tempAttributeDescriptor = [];
  // Extract attribute bindings
  if (node.attrs?.length > 0) {
    let hasInsertComment = false; // Should only insert comment node before current node once
    node.attrs = node.attrs.filter((attr) => {
      if (isBindings(attr.value)) {
        if (!hasInsertComment) {
          const selfIndex = node.parentNode.childNodes.indexOf(node);
          node.parentNode.childNodes.splice(selfIndex, 0, createCommentNode(PLACEHOLDER_COMMENT_DATA));

          hasInsertComment = true;
        }
        if (isEventNameInTemplate(attr.name)) {
          // events
          const { eventName, isCapture } = getEventInfo(attr.name);
          tempAttributeDescriptor.push({
            name: `on${eventName}`,
            value: attr.value.replace(BINDING_REGEXP, '$1'),
            capture: isCapture,
          });
        } else {
          // attributes
          tempAttributeDescriptor.push({
            name: attr.name,
            value: attr.value.replace(BINDING_REGEXP, '$1'),
          });
        }
        return false; // remove attribute bindings
      }
      return true;
    });
  }
  return tempAttributeDescriptor;
}

// with side effect in changing node structure
function extractTextInterpolation(node): Array<string> {
  const tempTextInterpolation = [];
  // Extract text interpolation
  // Splice text node into text node and comment node
  // Example:
  // Before: aaa {{name}} bbb => a single text node with value 'aaa {{name}} bbb'
  // After: aaa <!--?pwc_t--> bbb => text node + comment node + text node
  node.value = node.value.replace(INTERPOLATION_REGEXP, (source, p1) => {
    tempTextInterpolation.push(p1);
    return TEXT_COMMENT_DATA;
  });
  const textArr = node.value.split(TEXT_COMMENT_DATA);
  const newChildNodes = [];
  for (let index = 0, { length } = textArr; index < length; index++) {
    newChildNodes.push(createTextNode(textArr[index]));
    if (index !== length - 1) {
      newChildNodes.push(createCommentNode(TEXT_COMMENT_DATA));
    }
  }
  const selfIndex = node.parentNode.childNodes.indexOf(node);
  node.parentNode.childNodes.splice(selfIndex, 1, ...newChildNodes);

  return tempTextInterpolation;
}

function transformTemplateAst(nodes: Array<ElementNode>): ValueDescriptor {
  let values = [];
  for (const node of nodes) {
    if (node.nodeName === '#text') {
      const tempTextInterpolation = extractTextInterpolation(node);
      values = values.concat(tempTextInterpolation);
    } else {
      const tempAttributeDescriptor = extractAttributeBindings(node);
      if (tempAttributeDescriptor.length > 0) {
        values.push(tempAttributeDescriptor);
      }
    }
  }
  return values;
}


function genTemplateString(ast: ElementNode): string {
  return parse5.serialize(ast);
}

/**
 * Generate template string and extract values from template
 */
export function compileTemplate(descriptor: SFCDescriptor): CompileTemplateResult {
  const { ast } = descriptor.template;
  return compileTemplateAST(ast);
}

export function compileTemplateAST(ast: ElementNode): CompileTemplateResult {
  const nodes = dfs(ast);
  const values = transformTemplateAst(nodes);
  const templateString = genTemplateString(ast);
  return { templateString, values };
}
