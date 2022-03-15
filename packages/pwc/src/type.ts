export interface BaseElementType {
  connectedCallback?: () => void;
  disconnectedCallback?: () => void;
  attributeChangedCallback?: (name: string, oldValue: any, newValue: any) => void;
  adoptedCallback?: () => void;
}

export type Attrs = Record<string, any>;

export type TemplateValue = Attrs | string;

export type ElementTemplate = [] | [string] | [string, TemplateValue[]];

export interface CustomHTMLBaseElement extends HTMLBaseElement {
  template?: ElementTemplate;
  shadowOptions: ShadowRootInit;
}
