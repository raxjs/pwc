export interface PWCElement {
  connectedCallback?: () => void;
  disconnectedCallback?: () => void;
  attributeChangedCallback?: (name: string, oldValue: any, newValue: any) => void;
  adoptedCallback?: () => void;
}

export type Attribute = {
  name: string;
  value: any;
  [key: string]: any;
};

export type Attributes = Attribute[];

export type TemplateValue = Attributes | string;

export type ElementTemplate = [] | [string] | [string, TemplateValue[]];

export interface CustomHTMLBaseElement extends HTMLBaseElement {
  template?: ElementTemplate;
  shadowOptions: ShadowRootInit;
}
