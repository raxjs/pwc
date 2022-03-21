import type { ElementTemplate } from '../type';
import { Reactive } from '../reactivity/reactive';
import type { ChildElement } from './childElement';
declare const _default: (Definition: any) => {
    new (): {
        [x: string]: any;
        "__#1074174@#initialized": boolean;
        "__#1074174@#fragment": Node;
        "__#1074174@#currentTemplate": ElementTemplate;
        "__#1074174@#childNodes": ChildElement[];
        "__#1074174@#reactive": Reactive;
        "__#1074174@#updateTimer": ReturnType<typeof setTimeout>;
        connectedCallback(): void;
        disconnectedCallback(): void;
        attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
        adoptedCallback(): void;
        "__#1074174@#createTemplate"(source: string): Node;
        "__#1074174@#associateTplAndValue"(fragment: Node, values: any): void;
        "__#1074174@#performUpdate"(): void;
        requestUpdate(): void;
        getReactiveValue(prop: string): unknown;
        setReactiveValue(prop: string, val: unknown): void;
    };
    [x: string]: any;
};
export default _default;
