import { hasOwnProperty, isEventName } from "../utils";
export class TextElement {
    #el;
    constructor(commentNode, initialValue){
        const textNode = document.createTextNode(initialValue);
        this.#el = textNode, commentNode.parentNode.insertBefore(textNode, commentNode);
    }
    commitValue(value) {
        this.#el.nodeValue = value;
    }
}
export class AttributedElement {
    #el;
    constructor(commentNode, initialAttrs){
        this.#el = commentNode.nextSibling, this.#updateAttributes(initialAttrs, !0);
    }
    commitValue(value) {
        this.#updateAttributes(value);
    }
     #updateAttributes(value, isInitial = !1) {
        for(const attrName in value)if (hasOwnProperty(value, attrName)) if (isEventName(attrName) && isInitial) {
            const { handler , type  } = value[attrName];
            this.#el.addEventListener(attrName.slice(2), handler, "capture" === type);
        } else attrName in this.#el ? this.#el[attrName] = value[attrName] : this.#el.setAttribute(attrName, value[attrName]);
    }
}
