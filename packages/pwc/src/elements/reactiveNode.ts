import type { Attributes, PWCElementTemplate, PWCElement, ReactiveNode, ReactiveNodeMapType, ReactiveNodeValue } from '../type';
import { commitAttributes } from './commitAttributes';
import { isFalsy, shallowEqual } from '../utils';
import { initTemplateItem, initTemplateItems } from './initRenderTemplate';
import { NodeType } from '../constants';

class BaseNode {
  commentNode: Comment;
  rootElement: PWCElement;
  value: ReactiveNodeValue;
  reactiveNodes: ReactiveNode[] = [];
  constructor(commentNode: Comment, rootElement: PWCElement, initialValue: ReactiveNodeValue) {
    this.commentNode = commentNode;
    this.rootElement = rootElement;
    this.value = initialValue;
  }
}

export class TextNode extends BaseNode implements ReactiveNode {
  #el: Text;

  constructor(commentNode: Comment, rootElement: PWCElement, initialValue: string) {
    super(commentNode, rootElement, initialValue);
    const textNode = document.createTextNode(isFalsy(initialValue) ? '' : initialValue);
    this.#el = textNode;
    commentNode.parentNode.insertBefore(textNode, commentNode);
  }

  commitValue(value: string) {
    this.#el.nodeValue = value;
  }
}

export class AttributedNode extends BaseNode implements ReactiveNode {
  #el: Element;
  #elIsCustom: boolean;
  #elIsSvg: boolean;

  constructor(commentNode: Comment, rootElement: PWCElement, initialAttrs: Attributes) {
    super(commentNode, rootElement, initialAttrs);
    this.#el = commentNode.nextSibling as Element;
    this.#elIsCustom = Boolean(window.customElements.get(this.#el.localName));
    this.#elIsSvg = this.#el instanceof SVGElement;
    if (this.#elIsCustom) {
      // @ts-ignore
      this.#el.__init_task__ = () => {
        this.#commitAttributes(initialAttrs, true);
      };
    } else {
      this.#commitAttributes(initialAttrs, true);
    }
  }

  commitValue(value: Attributes) {
    this.#commitAttributes(value);

    // Any updating should trigger the child components's update method
    if (this.#elIsCustom && (this.#el as PWCElement)._requestUpdate) {
      (this.#el as PWCElement)._requestUpdate();
    }
  }

  #commitAttributes(value: Attributes, isInitial = false) {
    commitAttributes(this.#el, value, {
      isInitial,
      isSVG: this.#elIsSvg,
      rootElement: this.rootElement,
    });
  }
}

export class TemplateNode extends BaseNode implements ReactiveNode {
  childNodes: Node[];
  constructor(commentNode: Comment, rootElement: PWCElement, elementTemplate: PWCElementTemplate) {
    super(commentNode, rootElement, elementTemplate);
    initTemplateItem(this, ReactiveNodeMap);
  }
  commitValue([prev, current]: [PWCElementTemplate, PWCElementTemplate]) {
    updateView(prev, current, this.reactiveNodes);
  }
}

export class TemplatesNode extends BaseNode implements ReactiveNode {
  childNodes: Node[];
  constructor(commentNode: Comment, rootElement: PWCElement, elementTemplates: PWCElementTemplate[]) {
    super(commentNode, rootElement, elementTemplates);
    initTemplateItems(elementTemplates, commentNode, this.reactiveNodes, rootElement, ReactiveNodeMap);
  }

  commitValue([prev, current]: [PWCElementTemplate[], PWCElementTemplate[]]) {
    // Delete reactive children nodes
    deleteChildren(this);
    // Rebuild
    initTemplateItems(current, this.commentNode, this.reactiveNodes, this.rootElement, ReactiveNodeMap);
  }
}

function deleteChildren(targetReactiveNode: ReactiveNode) {
  for (const reactiveNode of targetReactiveNode.reactiveNodes) {
    (reactiveNode as TemplateNode).childNodes?.forEach(childNode => {
      const parent = childNode.parentNode;
      parent.removeChild(childNode);
    });
    if (reactiveNode.reactiveNodes.length > 0) {
      deleteChildren(reactiveNode);
    }
  }
  targetReactiveNode.reactiveNodes = [];
}

export function updateView(
  oldElementTemplate: PWCElementTemplate,
  newElementTemplate: PWCElementTemplate,
  reactiveNodes: ReactiveNode[],
) {
  const {
    templateString: oldTemplateString,
    templateData: oldTemplateData,
  } = oldElementTemplate;
  const {
    templateString,
    templateData,
  } = newElementTemplate;
  // While template strings is constant with prev ones,
  // it should just update node values and attributes
  if (oldTemplateString === templateString) {
    for (let index = 0; index < oldTemplateData.length; index++) {
      const reactiveNode = reactiveNodes[index];
      // Avoid html fragment effect
      if (reactiveNode instanceof TemplateNode || reactiveNode instanceof TemplatesNode) {
        // TODO more diff
        reactiveNode.commitValue(
          [
            oldTemplateData[index] as (PWCElementTemplate & PWCElementTemplate[]),
            templateData[index] as (PWCElementTemplate & PWCElementTemplate[]),
          ],
        );
      } else if (!shallowEqual(oldTemplateData[index], templateData[index])) {
        reactiveNode.commitValue(templateData[index]);
      }
    }
  }
}

export const ReactiveNodeMap: ReactiveNodeMapType = {
  [NodeType.TEXT]: TextNode,
  [NodeType.ATTRIBUTE]: AttributedNode,
  [NodeType.TEMPLATE]: TemplateNode,
  [NodeType.TEMPLATES]: TemplatesNode,
};
