import type { BaseElementType, CustomHTMLBaseElement, ElementTemplate } from '../type';
import { TEXT_COMMENT_DATA, PWC_PREFIX, PLACEHOLDER_COMMENT_DATA } from '../constants';
import { hasOwnProperty } from '../utils';

export default class BaseElement implements BaseElementType {
  // Custom element self instance
  el: CustomHTMLBaseElement;

  // Component initial state
  #initialized = false;
  // The root fragment
  #fragment: Node;
  // Template info
  #template: ElementTemplate;

  // Custom element native lifecycle
  connectedCallback() {
    if (!this.#initialized) {
      this.#template = this.el.template || [];
      const [strings = [], values = []] = this.#template;

      this.#fragment = this.#createTemplate(strings);
      this.#associateTplAndValue(this.#fragment, values);
      this.el.appendChild(this.#fragment);
    }
    this.#initialized = true;
  }
  disconnectedCallback() {}
  attributeChangedCallback(name, oldValue, newValue) {}
  adoptedCallback() {}

  // Extension methods
  #createTemplate(strings: string[]) {
    const template = document.createElement('template');

    template.innerHTML = strings.join(`<!--${TEXT_COMMENT_DATA}-->`);

    return template.content.cloneNode(true);
  }
  #associateTplAndValue(fragment: Node, values) {
    const nodeIterator = document.createNodeIterator(fragment, NodeFilter.SHOW_COMMENT, {
      acceptNode(node) {
        if ((node as Comment).data?.includes(PWC_PREFIX)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      },
    });
    let currentComment: Node;
    let index = 0;

    while ((currentComment = nodeIterator.nextNode())) {
      // Insert dynamic text node
      if ((currentComment as Comment).data === TEXT_COMMENT_DATA) {
        const textNode = document.createTextNode(values[index]);
        currentComment.parentNode.insertBefore(textNode, currentComment);
      } else if ((currentComment as Comment).data === PLACEHOLDER_COMMENT_DATA) {
        // Set dynamic attribute and property
        const targetElement = currentComment.nextSibling as Element;
        const dynamicValue = values[index];
        for (const attrName in dynamicValue) {
          if (hasOwnProperty(dynamicValue, attrName)) {
            // When attribute name startWith on, it should be an event
            if (attrName.startsWith('on')) {
              const { handler, type } = dynamicValue[attrName];
              // If type is capture, the event should be trigger when capture stage
              targetElement.addEventListener(attrName.slice(2), handler, type === 'capture');
            } else if (attrName in targetElement) {
              // Verify that there is a target property on the node
              targetElement[attrName] = dynamicValue[attrName];
            } else {
              targetElement.setAttribute(attrName, dynamicValue[attrName]);
            }
          }
        }
      }

      index++;
    }
  }
}
