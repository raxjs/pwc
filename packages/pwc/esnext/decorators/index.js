export function reactive(value, { kind , name , addInitializer  }) {
    if ("accessor" === kind) return {
        get () {
            return this.getReactiveValue(name);
        },
        set (val) {
            this.setReactiveValue(name, val);
        },
        init (initialValue) {
            return this.setReactiveValue(name, initialValue), initialValue;
        }
    };
}
export function legacyReactive(name, initialValue) {
    this.setReactiveValue(name, initialValue), Object.defineProperty(this.constructor.prototype, name, {
        set (val) {
            this.setReactiveValue(name, val);
        },
        get () {
            return this.getReactiveValue(name);
        }
    });
}
