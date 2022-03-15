import type { ElementTemplate, BaseElementType } from '../type';
import { TEXT_COMMENT_DATA, PWC_PREFIX, PLACEHOLDER_COMMENT_DATA } from '../constants';
import { Reactive } from '../reactivity/reactive';
import { AttributedElement, ChildElement, TextElement } from './childElement';
import { shallowEqual } from '../utils';

export default (Definition) => {
  return class extends Definition implements BaseElementType {
    // Component initial state
    #initialized = false;
    // The root fragment
    #fragment: Node;
    // Template info
    #currentTemplate: ElementTemplate;
    // Comment nodes
    #childNodes: ChildElement[];
    // Reactive instance
    #reactive: Reactive = new Reactive(this);
    // Update Timer
    #updateTimer: ReturnType<typeof setTimeout>;

    // Custom element native lifecycle
    connectedCallback() {
      if (!this.#initialized) {
        this.#currentTemplate = this.template || [];
        const [template, values = []] = this.#currentTemplate;

        this.#fragment = this.#createTemplate(template);
        // TODO: rename?
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
      this.#childNodes = [];

      while ((currentComment = nodeIterator.nextNode())) {
        // Insert dynamic text node
        if ((currentComment as Comment).data === TEXT_COMMENT_DATA) {
          const textElement = new TextElement(currentComment as Comment, values[index]);
          this.#childNodes.push(textElement);
        } else if ((currentComment as Comment).data === PLACEHOLDER_COMMENT_DATA) {
          const attributedElement = new AttributedElement(currentComment as Comment, values[index]);
          this.#childNodes.push(attributedElement);
        }

        index++;
      }
    }

    #performUpdate() {
      const [oldStrings, oldValues] = this.#currentTemplate;
      const [strings, values] = this.template;

      // While template strings is constant with prev ones,
      // it should just update node values and attributes
      if (oldStrings === strings) {
        for (let i = 0; i < oldValues.length; i++) {
          if (!shallowEqual(oldValues[i], values[i])) {
            this.#childNodes[i].commitValue(values[i]);
          }
        }
      }
      this.#currentTemplate = this.template;
    }

    requestUpdate(): void {
      if (this.#updateTimer) {
        clearTimeout(this.#updateTimer);
      }
      this.#updateTimer = setTimeout(() => {
        this.#performUpdate();
      }, 0);
    }

    createReactiveProperty(prop: string, initialValue: any) {
      this.#reactive.createReactiveProperty(prop, initialValue);
    }

    getReactiveValue(prop: string) {
      return this.#reactive.getRawValue(prop);
    }
  };
};
