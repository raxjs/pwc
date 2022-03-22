import { commitAttributes } from './commitAttributes';
import type { Attributes } from '../type';

export interface ReactiveNode {
  commitValue: (value: any, isInitial?: boolean) => void;
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
  constructor(commentNode: Comment, initialAttrs: Attributes) {
    this.#el = commentNode.nextSibling as Element;
    if (window.customElements.get(this.#el.localName)) {
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
  }

  #commitAttributes(value: Attributes, isInitial = false) {
    commitAttributes(this.#el, value, isInitial);
  }
}
