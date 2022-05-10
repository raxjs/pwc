import type { ElementTemplate, PWCElement, ReactiveNode, ReactiveNodeMapType, RootElement, TemplateDataItemType } from '../type';
import { NodeType, PLACEHOLDER_COMMENT_DATA, PWC_PREFIX, TEXT_COMMENT_DATA } from '../constants';
import { isArray, isTemplate } from '../utils';
import { throwError } from '../error';

// Scan placeholder node, and commit dynamic data to component
export function renderElementTemplate(
  fragment: RootElement | Node,
  templateData: TemplateDataItemType[],
  reactiveNodes: ReactiveNode[],
  rootElement: PWCElement,
  ReactiveNodeMap: ReactiveNodeMapType,
) {
  const nodeIterator = document.createNodeIterator(fragment, NodeFilter.SHOW_COMMENT, {
    acceptNode(node) {
      if ((node as Comment).data?.includes(PWC_PREFIX)) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_REJECT;
    },
  });
  let placeholder: Node;
  let index = 0;

  while ((placeholder = nodeIterator.nextNode())) {
    const value = templateData[index];
    let type;

    // Insert dynamic text node
    if ((placeholder as Comment).data === TEXT_COMMENT_DATA) {
      if (isArray(value)) {
        type = NodeType.TEMPLATES;
      } else if (isTemplate(value)) {
        type = NodeType.TEMPLATE;
      } else {
        type = NodeType.TEXT;
      }
    } else if ((placeholder as Comment).data === PLACEHOLDER_COMMENT_DATA) {
      type = NodeType.ATTRIBUTE;
    }

    if (__DEV__) {
      if (!type) {
        throwError('It is an invalid element template!');
      }
    }

    reactiveNodes.push(new ReactiveNodeMap[type](placeholder, rootElement, value));

    index++;
  }
}
