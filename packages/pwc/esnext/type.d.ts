export interface BaseElementType {
    connectedCallback?: () => void;
    disconnectedCallback?: () => void;
    attributeChangedCallback?: (name: string, oldValue: any, newValue: any) => void;
    adoptedCallback?: () => void;
}
export declare type ElementTemplate = [] | [string] | [string, any[]];
export interface CustomHTMLBaseElement extends HTMLBaseElement {
    template?: ElementTemplate;
    shadowOptions: ShadowRootInit;
}
export interface ReactiveType {
    setReactiveValue: (prop: string, val: unknown) => void;
    getReactiveValue: (prop: string) => unknown;
    requestUpdate: () => void;
}
