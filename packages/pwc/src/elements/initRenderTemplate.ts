import { PLACEHOLDER_COMMENT_DATA, PWC_PREFIX, TEXT_COMMENT_DATA } from '../constants';
import { isArray } from '../utils';
import { AttributedNode, TextNode } from './reactiveNode';
import type { Attributes, RootElement, TemplateDataType, ElementTemplate, PWCElementTemplate } from '../type';
import { createTemplate } from './createTemplate';

enum NODE_TYPE {
  ATTRIBUTE = 'ATTRIBUTE',
  TEXT = 'TEXT',
  TEMPLATE = 'TEMPLATE',
  TEMPLATES = 'TEMPLATES',
}

type PlaceholderItemType<T extends keyof NODE_TYPE_MAP> = {
  placeholder: Comment;
  type: T;
  value: NODE_TYPE_MAP[T];
};

type NODE_TYPE_MAP = {
  [NODE_TYPE.ATTRIBUTE]: Attributes;
  [NODE_TYPE.TEMPLATE]: PWCElementTemplate;
  [NODE_TYPE.TEXT]: string;
  [NODE_TYPE.TEMPLATES]: PWCElementTemplate[];
};

type TextPlaceholder = PlaceholderItemType<NODE_TYPE.TEXT>;
type TemplatePlaceholder = PlaceholderItemType<NODE_TYPE.TEMPLATE>;

type AttributePlaceholder = PlaceholderItemType<NODE_TYPE.ATTRIBUTE>;
type TemplatesPlaceholder = PlaceholderItemType<NODE_TYPE.TEMPLATES>;
type ValuePlaceholder = TemplatePlaceholder | TemplatesPlaceholder | TextPlaceholder;

type PlaceholderItem = ValuePlaceholder | AttributePlaceholder;

export function initRenderTemplate(fragment: RootElement | Node, templateData: TemplateDataType[], reactiveNodes) {
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
        type = NODE_TYPE.TEMPLATES;
        // @ts-ignore
      } else if ((value as ElementTemplate)?.template === true) {
        type = NODE_TYPE.TEMPLATE;
      } else {
        type = NODE_TYPE.TEXT;
      }
      placeholderList.push({
        placeholder,
        type,
        value,
      } as ValuePlaceholder);
    } else if ((placeholder as Comment).data === PLACEHOLDER_COMMENT_DATA) {
      placeholderList.push({
        placeholder: placeholder as Comment,
        type: NODE_TYPE.ATTRIBUTE,
        value: value as Attributes,
      });
    }

    index++;
  }

  for (const placeholderItem of placeholderList) {
    const { type, value, placeholder } = placeholderItem;
    switch (type) {
      case NODE_TYPE.TEXT: {
        // Avoid render undefined or null
        const textElement = new TextNode(placeholder, value || '');
        reactiveNodes.push(textElement);
        break;
      }
      case NODE_TYPE.ATTRIBUTE: {
        const attributedElement = new AttributedNode(placeholder, value, this);
        reactiveNodes.push(attributedElement);
        break;
      }
      case NODE_TYPE.TEMPLATE: {
        initTemplateItem(value, placeholder, reactiveNodes);
        break;
      }
      case NODE_TYPE.TEMPLATES: {
        initTemplateItems(value, placeholder, reactiveNodes);
        break;
      }
    }
  }
}

function initTemplateItems(elementTemplates: PWCElementTemplate[], prevNode: Node, reactiveNodes) {
  for (const elementTemplate of elementTemplates) {
    initTemplateItem(elementTemplate, prevNode, reactiveNodes);
  }
}

function initTemplateItem(elementTemplate: PWCElementTemplate, prevNode: Node, reactiveNodes) {
  const { templateString, templateData = [] } = elementTemplate;
  const fragment = createTemplate(templateString);
  initRenderTemplate(fragment, templateData, reactiveNodes);
  prevNode.parentNode.insertBefore(fragment, prevNode);
}

