import type { Attributes, PWCElementTemplate, PWCElement, ReactiveNode, ReactiveNodeMapType } from '../type';
import { commitAttributes } from './commitAttributes';
import { isFalsy, shallowEqual } from '../utils';
import { initTemplateItem, initTemplateItems } from './initRenderTemplate';
import { NodeType } from '../constants';

export class TextNode implements ReactiveNode {
  #el: Text;

  constructor(commentNode: Comment, rootElement: PWCElement, initialValue: string) {
    const textNode = document.createTextNode(isFalsy(initialValue) ? '' : initialValue);
    this.#el = textNode;
    commentNode.parentNode.insertBefore(textNode, commentNode);
  }

  commitValue(value: string) {
    this.#el.nodeValue = value;
  }
}

export class AttributedNode implements ReactiveNode {
  #el: Element;
  rootElement: PWCElement;
  #elIsCustom: boolean;
  #elIsSvg: boolean;

  constructor(commentNode: Comment, rootElement: PWCElement, initialAttrs: Attributes) {
    this.#el = commentNode.nextSibling as Element;
    this.rootElement = rootElement;
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

export class TemplateNode implements ReactiveNode {
  reactiveNodes: ReactiveNode[] = [];
  childNodes: Node[];
  rootElement: PWCElement;
  commentNode: Comment;
  value: PWCElementTemplate;
  constructor(commentNode: Comment, rootElement: PWCElement, elementTemplate: PWCElementTemplate) {
    this.rootElement = rootElement;
    this.commentNode = commentNode;
    this.value = elementTemplate;
    initTemplateItem(this, ReactiveNodeMap);
  }
  commitValue([prev, current]: [PWCElementTemplate, PWCElementTemplate]) {
    updateView(prev, current, this.reactiveNodes);
  }
}

export class TemplatesNode implements ReactiveNode {
  reactiveNodes: ReactiveNode[] = [];
  #commentNode: Comment;
  rootElement: PWCElement;
  childNodes: Node[];
  constructor(commentNode: Comment, rootElement: PWCElement, elementTemplates: PWCElementTemplate[]) {
    this.#commentNode = commentNode;
    this.rootElement = rootElement;
    initTemplateItems(elementTemplates, commentNode, this.reactiveNodes, rootElement, ReactiveNodeMap);
  }

  commitValue([prev, current]: [PWCElementTemplate[], PWCElementTemplate[]]) {
    // Empty reactive nodes
    for (const reactiveNode of this.reactiveNodes) {
      (reactiveNode as TemplateNode).childNodes?.forEach(childNode => {
        const parent = childNode.parentNode;
        parent.removeChild(childNode);
      });
    }
    this.reactiveNodes = [];
    // Rebuild
    initTemplateItems(current, this.#commentNode, this.reactiveNodes, this.rootElement, ReactiveNodeMap);
  }
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
