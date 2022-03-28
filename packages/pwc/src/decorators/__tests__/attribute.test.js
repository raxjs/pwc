import { attribute } from '../attribute';

describe('attribute decorator', () => {
  it('should relect attribute to property with the attribute decorator alone', () => {
    expect(window.customElements.get('custom-element')).toBeFalsy();

    @customElement('custom-element')
    class CustomElement extends HTMLElement {}

    expect(window.customElements.get('custom-element')).toBeTruthy();
  });
});
