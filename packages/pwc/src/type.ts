export interface PWCElement extends Element {
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(name: string, oldValue: any, newValue: any): void;
  adoptedCallback(): void;
  _requestUpdate(): void;
  _getChangedProperties(): Set<string>;
  prototype: PWCElement;
  new(): PWCElement;
}

export type RootElement = PWCElement | ShadowRoot;

export interface NormalAttribute {
  name: string;
  value: any;
  [key: string]: any;
}

export type Fn = (...args: any[]) => any;

export interface EventAttribute {
  name: string;
  handler: Fn;
  capture?: boolean;
}

export type Attribute = NormalAttribute | EventAttribute;

export type Attributes = Attribute[];

export type TemplateDataItemType = Attributes | string | ElementTemplate[] | ElementTemplate;

export type TemplateStringType = string;

export type PWCElementTemplate = {
  templateString?: TemplateStringType;
  templateData?: TemplateDataItemType[];
  template?: boolean;
};

export type ElementTemplate = PWCElementTemplate | string | number | null | undefined;

export interface CustomHTMLBaseElement extends HTMLBaseElement {
  template?: ElementTemplate;
  shadowOptions: ShadowRootInit;
}

export type Warning = ((template: string, ...args: any[]) => void);

export type ReflectProperties = Map<string, {
  attrName: string;
  isBoolean: boolean;
  value?: unknown;
  initialValue: unknown;
}>;

