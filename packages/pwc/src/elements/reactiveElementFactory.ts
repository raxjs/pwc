import type { ElementTemplate, PWCElement, ReflectProperties, RootElement, PWCElementTemplate } from '../type';
import { Reactive } from '../reactivity/reactive';
import { TemplatePart, formatElementTemplate } from './part';
import { generateUid } from '../utils';
import { enqueueJob } from './sheduler';
import { TEXT_COMMENT_DATA } from '../constants';

export default (Definition: PWCElement) => {
  return class extends Definition {
    #uid: number = generateUid();
    // Component initial state
    #initialized = false;
    // The root element
    #root: RootElement;
    // Template info
    #currentTemplate: PWCElementTemplate;
    //
    #dynamicPart: TemplatePart;
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
        this.#currentTemplate = formatElementTemplate(this.template);
        this.#root = this.shadowRoot || this;
        // This pwc element root base comment node
        const commentNode = document.createComment(TEXT_COMMENT_DATA);
        this.appendChild(commentNode);
        this.#dynamicPart = new TemplatePart(commentNode, this, this.#currentTemplate as PWCElementTemplate);
        this.#initialized = true;
        this.#reactive.clearChangedProperties();
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
      const newPWCElementTemplate = formatElementTemplate(this.template);
      // The root reactive node must be TemplateNode
      this.#dynamicPart.commitValue([this.#currentTemplate, newPWCElementTemplate]);
      this.#currentTemplate = newPWCElementTemplate;
      this.#reactive.clearChangedProperties();
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

    _getChangedProperties(): Set<string> {
      return this.#reactive.getChangedProperties();
    }
  };
};
