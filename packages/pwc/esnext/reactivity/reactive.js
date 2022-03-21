import { getProxyHandler } from "./handler";
export class Reactive {
    static getKey(key) {
        return `#_${key}`;
    }
    #element;
    #proxyHandler = getProxyHandler(this.requestUpdate.bind(this));
    constructor(elementInstance){
        this.#element = elementInstance;
    }
    requestUpdate() {
        this.#element?.requestUpdate();
    }
    getReactiveValue(prop) {
        const key = Reactive.getKey(prop);
        return this.#element[key];
    }
    setReactiveValue(prop, value) {
        const key = Reactive.getKey(prop);
        "object" == typeof value ? this.#createReactiveProperty(key, value) : this.#element[key] = value, this.requestUpdate();
    }
     #createReactiveProperty(key, initialValue) {
        this.#element[key] = new Proxy(initialValue, this.#proxyHandler);
    }
}
