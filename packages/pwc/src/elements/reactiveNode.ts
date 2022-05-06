import type { Attributes, PWCElementTemplate, PWCElement, ReactiveNode, ReactiveNodeMapType } from '../type';
import { commitAttributes } from './commitAttributes';
import { shallowEqual } from '../utils';
import { initTemplateItems } from './initRenderTemplate';
import { NodeType } from '../constants';

export class TextNode implements ReactiveNode {
  #el: Text;

  constructor(commentNode: Comment, rootElement: PWCElement, initialValue: string) {
    const textNode = document.createTextNode(initialValue);
    this.#el = textNode;
    commentNode.parentNode.insertBefore(textNode, commentNode);
  }

  commitValue(value: string) {
    this.#el.nodeValue = value;
  }
}

export class AttributedNode implements ReactiveNode {
  #el: Element;
  #root: PWCElement;
  #elIsCustom: boolean;
  #elIsSvg: boolean;

  constructor(commentNode: Comment, rootNode: PWCElement, initialAttrs: Attributes) {
    this.#el = commentNode.nextSibling as Element;
    this.#root = rootNode;
    this.#elIsCustom = Boolean(window.customElements.get(this.#el.localName));
    this.#elIsSvg = this.#el instanceof SVGElement;
    this.#commitAttributes(initialAttrs, true);
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
      rootElement: this.#root,
    });
  }
}

export class TemplateNode implements ReactiveNode {
  reactiveNodes: ReactiveNode[] = [];
  childNodes: Node[];
  commitValue([prev, current]: [PWCElementTemplate, PWCElementTemplate]) {
    updateView(prev, current, this.reactiveNodes);
  }
}

export class TemplatesNode implements ReactiveNode {
  reactiveNodes: ReactiveNode[] = [];
  #commentNode: Comment;
  #rootElement: PWCElement;
  childNodes: Node[];
  constructor(commentNode: Comment, rootElement: PWCElement) {
    this.#commentNode = commentNode;
    this.#rootElement = rootElement;
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
    initTemplateItems(current, this.#commentNode, this.reactiveNodes, this.#rootElement, ReactiveNodeMap);
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
