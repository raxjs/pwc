import type { ElementTemplate, PWCElement, ReflectProperties, RootElement, ReactiveNode, PWCElementTemplate } from '../type';
import { Reactive } from '../reactivity/reactive';
import { TemplateNode, TemplatesNode } from './reactiveNode';
import { generateUid, isArray } from '../utils';
import { enqueueJob } from './sheduler';
import { formatElementTemplate } from './formatElementTemplate';
import { TEXT_COMMENT_DATA } from '../constants';

export default (Definition: PWCElement) => {
  return class extends Definition {
    #uid: number = generateUid();
    // Component initial state
    #initialized = false;
    // The root element
    #root: RootElement;
    // Template info
    #currentTemplate: ElementTemplate | ElementTemplate[];
    // Reactive nodes
    #reactiveNode: ReactiveNode;
    // Reactive instance
    #reactive: Reactive = new Reactive(this);
    // Reflect properties
    #reflectProperties: ReflectProperties = new Map();

    get template() {
      return {} as ElementTemplate;
    }

    // Custom element native lifecycle
    connectedCallback() {
      if (!this.#initialized) {
        // @ts-ignore
        if (this.__init_task__) {
          // @ts-ignore
          this.__init_task__();
        }
        this.#currentTemplate = this.template;
        this.#root = this.shadowRoot || this;
        const commentNode = document.createComment(TEXT_COMMENT_DATA);
        this.appendChild(commentNode);
        if (isArray(this.#currentTemplate)) {
          this.#reactiveNode = new TemplatesNode(commentNode, this, this.#currentTemplate as PWCElementTemplate[]);
        } else {
          this.#currentTemplate = formatElementTemplate(this.#currentTemplate);
          this.#reactiveNode = new TemplateNode(commentNode, this, this.#currentTemplate as PWCElementTemplate);
        }
        this.#initialized = true;
      }
    }
    disconnectedCallback() {}
    attributeChangedCallback() {}
    adoptedCallback() {}

    // Extension methods
    _getInitialState() {
      return this.#initialized;
    }

    #performUpdate() {
      const nextElementTemplate = this.template;
      const newPWCElementTemplate = formatElementTemplate(nextElementTemplate);
      // The root reactive node must be TemplateNode
      this.#reactiveNode.commitValue([this.#currentTemplate, newPWCElementTemplate]);
      this.#currentTemplate = newPWCElementTemplate;
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
