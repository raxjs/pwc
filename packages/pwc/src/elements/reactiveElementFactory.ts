import type { ElementTemplate, PWCElement, PWCElementTemplate, ReflectProperties, RootElement } from '../type';
import { Reactive } from '../reactivity/reactive';
import type { ReactiveNode } from './reactiveNode';
import { generateUid } from '../utils';
import { enqueueJob, nextTick } from './sheduler';
import { initRenderTemplate } from './initRenderTemplate';
import { getTemplateInfo } from './getTemplateInfo';
import { validateElementTemplate } from './validateElementTemplate';
import { updateView } from './reactiveNode';

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
    #reactiveNodes: ReactiveNode[] = [];
    // Reactive instance
    #reactive: Reactive = new Reactive(this);
    // Reflect properties
    #reflectProperties: ReflectProperties = new Map();
    // Init task
    #initTask: () => void;

    get template() {
      return {} as ElementTemplate;
    }

    // Custom element native lifecycle
    connectedCallback() {
      if (!this.#initialized) {
        this.#initTask = () => {
          this.#currentTemplate = this.template || {};
          if (__DEV__) {
            validateElementTemplate(this.#currentTemplate);
          }
          const { templateString, templateData } = getTemplateInfo(this.#currentTemplate);
          this.#root = this.shadowRoot || this;
          this.#root.innerHTML = templateString;
          initRenderTemplate(this.#root, templateData, this.#reactiveNodes, this);
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

    #performUpdate() {
      const currentElementTemplate = this.template;
      if (__DEV__) {
        validateElementTemplate(currentElementTemplate);
      }
      const newElementTemplate = getTemplateInfo(currentElementTemplate);

      updateView(this.#currentTemplate as PWCElementTemplate, newElementTemplate, this.#reactiveNodes);
      this.#currentTemplate = newElementTemplate;
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
