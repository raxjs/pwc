export interface BaseElementType {
  connectedCallback?: () => void;
  disconnectedCallback?: () => void;
  attributeChangedCallback?: (name: string, oldValue: any, newValue: any) => void;
  adoptedCallback?: () => void;
}

export interface CustomHTMLBaseElement extends HTMLBaseElement {
  template?: [] | [any[]] | [any[], any[]];
}
