import type { ElementTemplate, PWCElement, ReactiveNode, ReactiveNodeMapType, RootElement, TemplateDataItemType } from '../type';
import { NodeType, PLACEHOLDER_COMMENT_DATA, PWC_PREFIX, TEXT_COMMENT_DATA } from '../constants';
import { isArray, isTemplate } from '../utils';
import { getTemplateInfo } from './getTemplateInfo';
import { createTemplate } from './createTemplate';
import { throwError } from '../error';
import { elementTemplateManager } from './elementTemplateManager';

export function initRenderTemplate(
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

export function initTemplateItems(
  elementTemplates: ElementTemplate[],
  prevNode: Comment,
  reactiveNodes: ReactiveNode[],
  rootElement: PWCElement,
  ReactiveNodeMap: ReactiveNodeMapType,
) {
  for (let elementTemplate of elementTemplates) {
    let ReactiveNodeCtor;
    elementTemplateManager(elementTemplate, {
      falsyAction() {
        ReactiveNodeCtor = ReactiveNodeMap[NodeType.TEXT];
        elementTemplate = '';
      },
      pwcElementTemplateAction() {
        ReactiveNodeCtor = ReactiveNodeMap[NodeType.TEMPLATE];
      },
      textAction() {
        ReactiveNodeCtor = ReactiveNodeMap[NodeType.TEXT];
      },
      arrayAction() {
        ReactiveNodeCtor = ReactiveNodeMap[NodeType.TEMPLATES];
      },
    });

    reactiveNodes.push(new ReactiveNodeCtor(prevNode, rootElement, elementTemplate));
  }
}

export function initTemplateItem(
  templateNode,
  ReactiveNodeMap: ReactiveNodeMapType,
) {
  const { templateString, templateData = [] } = getTemplateInfo(templateNode.value);
  const fragment = createTemplate(templateString);
  // Cache all native nodes
  templateNode.childNodes = [...fragment.childNodes];
  initRenderTemplate(fragment, templateData, templateNode.reactiveNodes, templateNode.rootElement, ReactiveNodeMap);
  templateNode.commentNode.parentNode.insertBefore(fragment, templateNode.commentNode);
}

