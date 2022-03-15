import type { Attrs, ElementTemplate, TemplateValue } from '../type';
import { TEXT_COMMENT_DATA, PWC_PREFIX, PLACEHOLDER_COMMENT_DATA } from '../constants';
import setAttribute from './setAttribute';

export default (Definition) => {
  return class extends Definition {
    // Component initial state
    #initialized = false;
    // The root fragment
    #fragment: Node;
    // Template info
    #template: ElementTemplate;
    constructor(...args) {
      super();
    }
    // Custom element native lifecycle
    connectedCallback() {
      if (!this.#initialized) {
        if (this.__init_task__) {
          this.__init_task__();
        }
        this.#template = this.template || [];
        const [template, values = []] = this.#template;

        this.#fragment = this.#createTemplate(template);
        // TODO: rename?
        // @ts-ignore
        this.#associateTplAndValue(this.#fragment, values);
        this.appendChild(this.#fragment);
      }
      this.#initialized = true;
    }
    disconnectedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    adoptedCallback() {}

    // Extension methods
    #createTemplate(source: string): Node {
      const template = document.createElement('template');

      // TODO: xss
      template.innerHTML = source;

      return template.content.cloneNode(true);
    }
    #associateTplAndValue(fragment: Node, values: TemplateValue[]) {
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
          const textNode = document.createTextNode(values[index] as string);
          currentComment.parentNode.insertBefore(textNode, currentComment);
        } else if ((currentComment as Comment).data === PLACEHOLDER_COMMENT_DATA) {
          // Set dynamic attribute and property
          const targetElement = currentComment.nextSibling as Element;
          const dynamicValue = values[index];
          // TODO Dev env check
          // Check target element whether custom element
          if (customElements.get(targetElement.localName)) {
            // @ts-ignore
            targetElement.__init_task__ = setAttribute.bind(null, targetElement, dynamicValue);
          } else {
            setAttribute(targetElement, dynamicValue as Attrs);
          }
        }

        index++;
      }
    }
  };
};
