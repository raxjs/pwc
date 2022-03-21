export interface PWCElement {
  uid: number;
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
  setReactiveValue: (prop: string, val: unknown) => void;

  getReactiveValue: (prop: string) => unknown;

  // The reactive property if changed will request a update
  requestUpdate: () => void;

}
