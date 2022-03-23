import { customElement } from '../customElement';

describe('customElement decorator', () => {
  it('should register custom element', () => {
    expect(window.customElements.get('custom-element')).toBeFalsy();

    @customElement('custom-element')
    class CustomElement extends HTMLElement {}

    expect(window.customElements.get('custom-element')).toBeTruthy();
  });
});
