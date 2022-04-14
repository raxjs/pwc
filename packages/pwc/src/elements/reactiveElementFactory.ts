import type { ElementTemplate, PWCElement, ReflectProperties, RootElement } from '../type';
import { TEXT_COMMENT_DATA, PWC_PREFIX, PLACEHOLDER_COMMENT_DATA } from '../constants';
import { Reactive } from '../reactivity/reactive';
import type { ReactiveNode } from './reactiveNode';
import { AttributedNode, TextNode } from './reactiveNode';
import { shallowEqual, generateUid } from '../utils';
import { enqueueJob, nextTick } from './sheduler';

export default (Definition: PWCElement) => {
  return class extends Definition {
    #uid: number = generateUid();
    // Component initial state
    #initialized = false;
    // The root element
    #root: RootElement;
    // Template info
    #currentTemplate: ElementTemplate;
    // Reactive nodes
    #reactiveNodes: ReactiveNode[];
    // Reactive instance
    #reactive: Reactive = new Reactive(this);
    // Reflect properties
    #reflectProperties: ReflectProperties = new Map();
    // Init task
    #initTask: () => void;

    get template() {
      return [] as ElementTemplate;
    }

    // Custom element native lifecycle
    connectedCallback() {
      if (!this.#initialized) {
        this.#initTask = () => {
          this.#currentTemplate = this.template || [];
          const [template, values = []] = this.#currentTemplate;
          this.#root = this.shadowRoot || this;
          // TODO: xss
          this.#root.innerHTML = template;
          this.#initRenderTemplate(this.#root, values);
          this.#initialized = true;
        };
        // Avoid that child component connectedCallback triggers before parent component
        nextTick(() => {
          if (this.#initTask) {
            this.#initTask();
            this.#initTask = null;
          }
        });
      }
    }
    disconnectedCallback() {}
    attributeChangedCallback() {}
    adoptedCallback() {}

    // Extension methods
    _getInitialState() {
      return this.#initialized;
    }

    #initRenderTemplate(fragment: RootElement, values) {
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
          const attributedElement = new AttributedNode(currentComment as Comment, values[index], this);
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
      // It will trigger get template method if there use this.template
      this.#currentTemplate = [strings, values];
    }

    _requestUpdate(): void {
      if (!this.#initialized) {
        return;
      }
      enqueueJob({
        uid: this.#uid,
        run: this.#performUpdate.bind(this),
      });
    }

    _getValue(prop: string): unknown {
      return this.#reactive.getValue(prop);
    }

    _setValue(prop: string, value: unknown) {
      this.#reactive.setValue(prop, value);
    }

    _initValue(prop: string, value: unknown) {
      this.#reactive.initValue(prop, value);
    }

    _getReflectProperties() {
      return this.#reflectProperties;
    }
  };
};
