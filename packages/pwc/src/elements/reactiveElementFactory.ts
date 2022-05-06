import type { ElementTemplate, PWCElement, ReflectProperties, RootElement, ReactiveNode } from '../type';
import { Reactive } from '../reactivity/reactive';
import { TemplateNode, ReactiveNodeMap } from './reactiveNode';
import { generateUid, isArray } from '../utils';
import { enqueueJob, nextTick } from './sheduler';
import { getTemplateInfo } from './getTemplateInfo';
import { initRenderTemplate } from './initRenderTemplate';

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
          this.#root = this.shadowRoot || this;
          if (isArray(this.#currentTemplate)) {

          } else {
            const { templateString, templateData } = getTemplateInfo(this.#currentTemplate);
            this.#root.innerHTML = templateString;
            const templateNode = new TemplateNode();
            this.#reactiveNodes.push(templateNode);
            initRenderTemplate(this.#root, templateData, templateNode.reactiveNodes, this, ReactiveNodeMap);
          }
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
      const nextElementTemplate = this.template;
      const newPWCElementTemplate = getTemplateInfo(nextElementTemplate);
      // TODO: check reactive node type
      this.#reactiveNodes[0].commitValue([this.#currentTemplate, newPWCElementTemplate]);
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
