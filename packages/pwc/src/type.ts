export interface PWCElement extends Element {
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(name: string, oldValue: any, newValue: any): void;
  adoptedCallback(): void;
  prototype: PWCElement;
  new(): PWCElement;
}

export type RootElement = PWCElement | ShadowRoot;

export interface Attribute {
  name: string;
  value: any;
  capture?: boolean;
  [key: string]: any;
}

export type Attributes = Attribute[];

export type TemplateValue = Attributes | string;

export type ElementTemplate = [] | [string] | [string, TemplateValue[]];

export interface CustomHTMLBaseElement extends HTMLBaseElement {
  template?: ElementTemplate;
  shadowOptions: ShadowRootInit;
}
