import type { ElementTemplate, PWCElement } from '../type';
import { TEXT_COMMENT_DATA, PWC_PREFIX, PLACEHOLDER_COMMENT_DATA } from '../constants';
import { Reactive } from '../reactivity/reactive';
import type { ReactiveNode } from './reactiveNode';
import { AttributedNode, TextNode } from './reactiveNode';
import { shallowEqual } from '../utils';
import type { SchedulerJob } from './sheduler';
import { queueJob } from './sheduler';

let uid = 0;

export default (Definition) => {
  return class extends Definition implements PWCElement {
    uid: number = uid++;
    // Component initial state
    #initialized = false;
    // The root fragment
    #fragment: Node;
    // Template info
    #currentTemplate: ElementTemplate;
    // Reactive nodes
    #reactiveNodes: ReactiveNode[];
    // Reactive instance
    #reactive: Reactive = new Reactive(this);
    // update job
    updateJob: SchedulerJob = {
      uid: this.uid,
      run: this.#performUpdate.bind(this),
    };

    // Custom element native lifecycle
    connectedCallback() {
      if (!this.#initialized) {
        this.#currentTemplate = this.template || [];
        const [template, values = []] = this.#currentTemplate;

        this.#fragment = this.#createTemplate(template);

        this.#initRenderTemplate(this.#fragment, values);
        this.appendChild(this.#fragment);
      }
      this.#initialized = true;
    }
    disconnectedCallback() {}
    attributeChangedCallback() {}
    adoptedCallback() {}

    // Extension methods
    #createTemplate(source: string): Node {
      const template = document.createElement('template');

      // TODO: xss
      template.innerHTML = source;

      return template.content.cloneNode(true);
    }

    #initRenderTemplate(fragment: Node, values) {
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
      this.#reactiveNodes = [];

      while ((currentComment = nodeIterator.nextNode())) {
        // Insert dynamic text node
        if ((currentComment as Comment).data === TEXT_COMMENT_DATA) {
          const textElement = new TextNode(currentComment as Comment, values[index]);
          this.#reactiveNodes.push(textElement);
        } else if ((currentComment as Comment).data === PLACEHOLDER_COMMENT_DATA) {
          const attributedElement = new AttributedNode(currentComment as Comment, values[index]);
          this.#reactiveNodes.push(attributedElement);
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
        for (let index = 0; index < oldValues.length; index++) {
          if (!shallowEqual(oldValues[index], values[index])) {
            this.#reactiveNodes[index].commitValue(values[index]);
          }
        }
      }
      this.#currentTemplate = this.template;
    }

    requestUpdate(): void {
      queueJob(this.updateJob);
    }

    getReactiveValue(prop: string): unknown {
      return this.#reactive.getReactiveValue(prop);
    }

    setReactiveValue(prop: string, val: unknown) {
      this.#reactive.setReactiveValue(prop, val);
    }
  };
};
