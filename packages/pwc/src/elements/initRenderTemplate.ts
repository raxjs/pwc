import type { Attributes, PWCElement, PWCElementTemplate, ReactiveNode, ReactiveNodeMapType, RootElement, TemplateDataItemType } from '../type';
import { NodeType, PLACEHOLDER_COMMENT_DATA, PWC_PREFIX, TEXT_COMMENT_DATA } from '../constants';
import { isArray, isTemplate } from '../utils';
import { getTemplateInfo } from './getTemplateInfo';
import { createTemplate } from './createTemplate';

type PlaceholderItemType<T extends keyof NODE_TYPE_MAP> = {
  placeholder: Comment;
  type: T;
  value: NODE_TYPE_MAP[T];
};

type NODE_TYPE_MAP = {
  [NodeType.ATTRIBUTE]: Attributes;
  [NodeType.TEMPLATE]: PWCElementTemplate;
  [NodeType.TEXT]: string;
  [NodeType.TEMPLATES]: PWCElementTemplate[];
};

type TextPlaceholder = PlaceholderItemType<NodeType.TEXT>;
type TemplatePlaceholder = PlaceholderItemType<NodeType.TEMPLATE>;
type AttributePlaceholder = PlaceholderItemType<NodeType.ATTRIBUTE>;
type TemplatesPlaceholder = PlaceholderItemType<NodeType.TEMPLATES>;
type ValuePlaceholder = TemplatePlaceholder | TemplatesPlaceholder | TextPlaceholder;

type PlaceholderItem = ValuePlaceholder | AttributePlaceholder;

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
  const placeholderList: PlaceholderItem[] = [];

  while ((placeholder = nodeIterator.nextNode())) {
    const value = templateData[index];

    // Insert dynamic text node
    if ((placeholder as Comment).data === TEXT_COMMENT_DATA) {
      let type;
      if (isArray(value)) {
        type = NodeType.TEMPLATES;
      } else if (isTemplate(value)) {
        type = NodeType.TEMPLATE;
      } else {
        type = NodeType.TEXT;
      }
      placeholderList.push({
        placeholder,
        type,
        value,
      } as ValuePlaceholder);
    } else if ((placeholder as Comment).data === PLACEHOLDER_COMMENT_DATA) {
      placeholderList.push({
        placeholder: placeholder as Comment,
        type: NodeType.ATTRIBUTE,
        value: value as Attributes,
      });
    }

    index++;
  }

  for (const placeholderItem of placeholderList) {
    const { type, value, placeholder } = placeholderItem;
    switch (type) {
      case NodeType.TEXT:
      case NodeType.ATTRIBUTE: {
        const attributedNode = new ReactiveNodeMap[type](placeholder, rootElement, value);
        reactiveNodes.push(attributedNode);
        break;
      }
      case NodeType.TEMPLATE: {
        initTemplateItem(value, placeholder, reactiveNodes, rootElement, ReactiveNodeMap);
        break;
      }
      case NodeType.TEMPLATES: {
        initTemplateItems(value, placeholder, reactiveNodes, rootElement, ReactiveNodeMap);
        break;
      }
    }
  }
}

export function initTemplateItems(
  elementTemplates: PWCElementTemplate[],
  prevNode: Comment,
  reactiveNodes: ReactiveNode[],
  rootElement: PWCElement,
  ReactiveNodeMap: ReactiveNodeMapType,
) {
  const templatesNode = new ReactiveNodeMap[NodeType.TEMPLATES](prevNode, rootElement);
  reactiveNodes.push(templatesNode);
  for (const elementTemplate of elementTemplates) {
    // TODO: item may not elementTemplate, like a number or text
    initTemplateItem(elementTemplate, prevNode, templatesNode.reactiveNodes, rootElement, ReactiveNodeMap);
  }
}

export function initTemplateItem(
  elementTemplate: PWCElementTemplate,
  prevNode: Comment,
  reactiveNodes: ReactiveNode[],
  rootElement: PWCElement,
  ReactiveNodeMap,
) {
  const { templateString, templateData = [] } = getTemplateInfo(elementTemplate);
  const fragment = createTemplate(templateString);
  const templateNode = new ReactiveNodeMap[NodeType.TEMPLATE]();
  // Cache all native nodes
  templateNode.childNodes = [...fragment.childNodes];
  reactiveNodes.push(templateNode);
  initRenderTemplate(fragment, templateData, templateNode.reactiveNodes, rootElement, ReactiveNodeMap);
  prevNode.parentNode.insertBefore(fragment, prevNode);
}

