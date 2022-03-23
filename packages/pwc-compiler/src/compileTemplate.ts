import * as parse5 from 'parse5';
import type { SFCDescriptor } from './parse';
import dfs from './utils/dfs';

import type { ElementNode } from './parse';

export interface attributeDescriptor {
  [key: string]: string | eventDescriptor;
}

export interface eventDescriptor {
  handler: string;
  capture?: boolean;
}

export interface compileTemplateResult {
  templateString: string;
  values: Array<string | attributeDescriptor>;
}

const BINDING_REGEXP = /\{\{([\.\w]*)\}\}/;

function transformTemplateAst(nodes: Array<ElementNode>): Array<string | attributeDescriptor> {
  const values = [];
  for (const item of nodes) {
    if (item.nodeName === '#text') {
      // Extract text bindings
      // Splice text node into text node and comment node
      // Example:
      // Before: aaa {{name}} bbb => a single text node with value 'aaa {{name}} bbb'
      // After: aaa <!--?pwc_t--> bbb => text node + comment node + text node
      // TODO: optimize
      item.value = item.value.replace(/\{\{([\.\w]*)\}\}/g, (source, p1) => {
        values.push(p1);
        return '?pwc_t';
      });
      const textArr = item.value.split('?pwc_t');
      const newChildNodes = [];
      for (let i = 0, { length } = textArr; i < length; i++) {
        newChildNodes.push({
          nodeName: '#text',
          value: textArr[i],
        });
        if (i !== length - 1) {
          newChildNodes.push({
            nodeName: '#comment',
            data: '?pwc_t',
          });
        }
      }
      const selfIndex = item.parentNode.childNodes.indexOf(item);
      item.parentNode.childNodes.splice(selfIndex, 1, ...newChildNodes);
    } else {
      // Extract attribute bindings
      const temp = {};
      if (item.attrs?.length > 0) {
        let hasInsertComment = false; // Should only insert comment node before current node once
        item.attrs = item.attrs.filter((attr) => {
          if (BINDING_REGEXP.test(attr.value)) {
            if (!hasInsertComment) {
              const selfIndex = item.parentNode.childNodes.indexOf(item);
              item.parentNode.childNodes.splice(selfIndex, 0, {
                nodeName: '#comment',
                data: '?pwc_p',
              });

              hasInsertComment = true;
            }
            if (attr.name.startsWith('@')) {
              // events
              const eventExecArray = /^@(\w*)(\.capture)?/.exec(attr.name);
              const event = eventExecArray && eventExecArray[1];
              const isCapture = eventExecArray && eventExecArray[2];
              temp[`on${event}`] = {
                handler: attr.value.replace(BINDING_REGEXP, '$1'),
                capture: isCapture ? true : false,
              };
            } else {
              // attributes
              temp[attr.name] = attr.value.replace(BINDING_REGEXP, '$1');
            }
            return false; // remove attribute bindings
          }
          return true;
        });
      }
      if (Object.keys(temp).length > 0) {
        values.push(temp);
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
export function compileTemplate(descriptor: SFCDescriptor): compileTemplateResult {
  const root = descriptor.template.ast;
  const nodes = dfs(root);
  const values = transformTemplateAst(nodes);
  const templateString = genTemplateString(root);
  return { templateString, values };
}
