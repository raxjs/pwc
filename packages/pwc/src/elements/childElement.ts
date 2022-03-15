import { hasOwnProperty, isEventName } from '../utils';

export interface ChildElement {
  commitValue: (value: any) => void;
}

export class TextElement implements ChildElement {
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

export class AttributedElement implements ChildElement {
  #el: Element;
  constructor(commentNode: Comment, initialAttrs: object) {
    this.#el = commentNode.nextSibling as Element;
    this.#updateAttributes(initialAttrs, true);
  }

  commitValue(value: object) {
    this.#updateAttributes(value);
  }

  #updateAttributes(value: object, isInitial = false) {
    for (const attrName in value) {
      if (hasOwnProperty(value, attrName)) {
        // When attribute name startWith on, it should be an event
        if (isEventName(attrName) && isInitial) {
          const { handler, type } = value[attrName];
          // If type is capture, the event should be trigger when capture stage
          this.#el.addEventListener(attrName.slice(2), handler, type === 'capture');
        } else if (attrName in this.#el) {
          // Verify that there is a target property on the node
          this.#el[attrName] = value[attrName];
        } else {
          this.#el.setAttribute(attrName, value[attrName]);
        }
      }
    }
  }
}
