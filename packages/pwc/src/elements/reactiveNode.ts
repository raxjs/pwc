import { hasOwnProperty, isEventName } from '../utils';
import { commitAttributes } from './commitAttributes';

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
  constructor(commentNode: Comment, initialAttrs: object) {
    this.#el = commentNode.nextSibling as Element;
    this.#commitAttributes(initialAttrs, true);
  }

  commitValue(value: object) {
    this.#commitAttributes(value);
  }

  #commitAttributes(value: object, isInitial = false) {
    commitAttributes(this.#el, value, isInitial);
  }
}
