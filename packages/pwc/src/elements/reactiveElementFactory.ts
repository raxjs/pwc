import type { ElementTemplate, BaseElementType } from '../type';
import { TEXT_COMMENT_DATA, PWC_PREFIX, PLACEHOLDER_COMMENT_DATA } from '../constants';
import { hasOwnProperty } from '../utils';
import { ReactiveProperty } from '../reactive/ReactiveProperty';

export default (Definition) => {
  return class extends Definition implements BaseElementType {
    // Component initial state
    #initialized = false;
    // The root fragment
    #fragment: Node;
    // Template info
    #template: ElementTemplate;
    // Comment nodes
    #commentNodes: Comment[] = [];
    // Reactive instance
    #reactive: ReactiveProperty = new ReactiveProperty(this);

    // Custom element native lifecycle
    connectedCallback() {
      if (!this.#initialized) {
        this.#template = this.template || [];
        const [template, values = []] = this.#template;

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
      this.#commentNodes = [];

      while ((currentComment = nodeIterator.nextNode())) {
        this.#commentNodes.push(currentComment as Comment);
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

    #performUpdate() {
      // while template strings is constant with prev ones,
      // it should just update node values and attributes
      if (this.#template[0] === this.template[0]
          && this.#template[1].length === this.template[1].length) {
        const newValues = this.template[1];
        const oldValues = this.#template[1];
        for (let i = 0; i < oldValues.length; i++) {
          if (oldValues[i] !== newValues[i]) {
            const commentNode = this.#commentNodes[i];
            if (commentNode.data === TEXT_COMMENT_DATA) {
              this.#commentNodes[i].previousSibling.nodeValue = newValues[i];
            } else if (commentNode.data === PLACEHOLDER_COMMENT_DATA) {
              const targetElement = this.#commentNodes[i].nextSibling as Element;
              const dynamicValue = newValues[i];
              for (const attrName in dynamicValue) {
                if (hasOwnProperty(dynamicValue, attrName)) {
                  // When attribute name startWith on, it should be an event
                  if (attrName.startsWith('on')) {
                    // Event should not changed
                  } else if (attrName in targetElement) {
                    // Verify that there is a target property on the node
                    targetElement[attrName] = newValues[i][attrName];
                  } else {
                    targetElement.setAttribute(attrName, dynamicValue[attrName]);
                  }
                }
              }
            }
          }
        }
      }

      // update #template
      this.#template = this.template;
    }

    requestUpdate(): void {
      this.#performUpdate();
    }

    createReactiveProperty(prop: string, initialValue: any) {
      this.#reactive.createReactiveProperty(prop, initialValue);
    }
  };
};
