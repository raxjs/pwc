import { PLACEHOLDER_COMMENT_DATA, PWC_PREFIX, TEXT_COMMENT_DATA } from '../../constants';
import { throwError } from '../../error';
import { Attributes, PWCElement, PWCElementTemplate, RootElement, TemplateDataItemType } from '../../type';
import { createTemplate, commitTemplates, renderTextCommentTemplate } from './utils';
import { AttributesPart } from './attributes';
import { BasePart } from './base';

// Scan placeholder node, and commit dynamic data to component
function renderElementTemplate(
  fragment: RootElement | Node,
  templateData: TemplateDataItemType[],
  dynamicTree: DynamicNode[],
  rootElement: PWCElement,
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
    let node: DynamicNode;

    // Insert dynamic text node
    if ((placeholder as Comment).data === TEXT_COMMENT_DATA) {
      node = renderTextCommentTemplate(placeholder as Comment, rootElement, value);
    } else if ((placeholder as Comment).data === PLACEHOLDER_COMMENT_DATA) {
      node = {
        commentNode: placeholder as Comment,
        part: new AttributesPart(placeholder as Comment, rootElement, value as Attributes),
      };
    }
    dynamicTree.push(node);
    index++;
  }
}

export type DynamicNode = {
  commentNode: Comment;
  part?: BasePart;
  children?: DynamicNode[];
};
export class TemplatePart extends BasePart {
  childNodes: Node[];
  dynamicNode: DynamicNode;

  constructor(commentNode: Comment, rootElement: PWCElement, initialValue: PWCElementTemplate) {
    super(commentNode, rootElement, initialValue);
    this.childNodes = [];
    this.dynamicNode = {
      children: [],
      part: this,
      commentNode: this.commentNode,
    };
    this.render(initialValue);
  }

  remove() {
    if (this.childNodes.length > 0) {
      // Clear out-dated nodes
      this.childNodes.forEach(childNode => {
        childNode.parentNode.removeChild(childNode);
      });
      this.childNodes = [];
    }
  }

  render(elementTemplate: PWCElementTemplate) {
    this.remove();
    const { templateString, templateData = [] } = elementTemplate;
    const fragment = createTemplate(templateString);
    renderElementTemplate(fragment, templateData, this.dynamicNode.children, this.rootElement);
    // Cache all native nodes
    this.childNodes = [...fragment.childNodes];
    this.commentNode.parentNode.insertBefore(fragment, this.commentNode);
  }

  commitValue([prev, current]: [PWCElementTemplate, PWCElementTemplate]) {
    commitTemplates([prev, current], this.dynamicNode, this.rootElement);
  }
}