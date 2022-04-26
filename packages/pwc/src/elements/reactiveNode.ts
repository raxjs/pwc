import { commitAttributes } from './commitAttributes';
import type { Attributes, PWCElementTemplate, PWCElement, TemplateNodeValue } from '../type';
import { isTemplate, shallowEqual } from '../utils';

export interface ReactiveNode {
  commitValue: (value: any) => void;
}

export class TextNode implements ReactiveNode {
  #el: Text;

  constructor(commentNode: Comment, initialValue: string) {
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

  constructor(commentNode: Comment, initialAttrs: Attributes, rootNode: PWCElement) {
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

  commitValue([prev, current]: TemplateNodeValue) {
    if (isTemplate(current)) {
      updateView(prev as PWCElementTemplate, current as PWCElementTemplate, this.reactiveNodes);
    } else {
      for (let index = 0; index < this.reactiveNodes.length; index++) {
        this.reactiveNodes[index].commitValue([prev[index], current[index]]);
      }
    }
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
      if (reactiveNode instanceof TemplateNode) {
        // TODO more diff
        reactiveNode.commitValue([oldTemplateData[index], templateData[index]] as TemplateNodeValue);
      } else if (!shallowEqual(oldTemplateData[index], templateData[index])) {
        reactiveNode.commitValue(templateData[index]);
      }
    }
  }
}
