import { TEXT_COMMENT_DATA, PWC_PREFIX, PLACEHOLDER_COMMENT_DATA } from "../constants";
import { Reactive } from "../reactivity/reactive";
import { AttributedElement, TextElement } from "./childElement";
import { shallowEqual } from "../utils";
export default ((Definition)=>class extends Definition {
        #initialized = !1;
        #fragment;
        #currentTemplate;
        #childNodes;
        #reactive = new Reactive(this);
        #updateTimer;
        connectedCallback() {
            if (!this.#initialized) {
                this.#currentTemplate = this.template || [];
                const [template, values = []] = this.#currentTemplate;
                this.#fragment = this.#createTemplate(template), this.#associateTplAndValue(this.#fragment, values), this.appendChild(this.#fragment);
            }
            this.#initialized = !0;
        }
        disconnectedCallback() {}
        attributeChangedCallback(name, oldValue, newValue) {}
        adoptedCallback() {}
         #createTemplate(source) {
            const template = document.createElement("template");
            return template.innerHTML = source, template.content.cloneNode(!0);
        }
         #associateTplAndValue(fragment, values) {
            const nodeIterator = document.createNodeIterator(fragment, NodeFilter.SHOW_COMMENT, {
                acceptNode (node) {
                    return node.data?.includes(PWC_PREFIX) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            });
            let currentComment, index = 0;
            for(this.#childNodes = []; currentComment = nodeIterator.nextNode();){
                if (currentComment.data === TEXT_COMMENT_DATA) {
                    const textElement = new TextElement(currentComment, values[index]);
                    this.#childNodes.push(textElement);
                } else if (currentComment.data === PLACEHOLDER_COMMENT_DATA) {
                    const attributedElement = new AttributedElement(currentComment, values[index]);
                    this.#childNodes.push(attributedElement);
                }
                index++;
            }
        }
         #performUpdate() {
            const [oldStrings, oldValues] = this.#currentTemplate, [strings, values] = this.template;
            if (oldStrings === strings) for(let index = 0; index < oldValues.length; index++)shallowEqual(oldValues[index], values[index]) || this.#childNodes[index].commitValue(values[index]);
            this.#currentTemplate = this.template;
        }
        requestUpdate() {
            this.#updateTimer && clearTimeout(this.#updateTimer), this.#updateTimer = setTimeout(()=>{
                this.#performUpdate();
            }, 0);
        }
        getReactiveValue(prop) {
            return this.#reactive.getReactiveValue(prop);
        }
        setReactiveValue(prop, val) {
            this.#reactive.setReactiveValue(prop, val);
        }
    }
);
