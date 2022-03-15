export interface BaseElementType {
  connectedCallback?: () => void;
  disconnectedCallback?: () => void;
  attributeChangedCallback?: (name: string, oldValue: any, newValue: any) => void;
  adoptedCallback?: () => void;
}


export type ElementTemplate = [] | [string] | [string, any[]];

export interface CustomHTMLBaseElement extends HTMLBaseElement {
  template?: ElementTemplate;
  shadowOptions: ShadowRootInit;
}

// TODO rename
export interface ReactiveType {
  // Create a reactive property
  createReactiveProperty: (property: string, initialValue: any) => void;

  // Get the raw value of a reactive property
  getRawValue: (property: string) => unknown;

  // The reactive property if changed will request a update
  requestUpdate: () => void;

}
