import overrideElementDefine from '../overrideElementDefine';
import mixinElement from '../mixinElement';
import type { BaseElementType } from '../../type';

describe('Mixin native element with extended element', () => {
  it('should mixin native element and extended element', () => {
    class BaseElement implements BaseElementType {
      connectedCallback() {}
      disconnectedCallback() {}
      attributeChangedCallback() {}
      adoptedCallback() {}
    }

    const mockConnectedCallback = jest.spyOn(BaseElement.prototype, 'connectedCallback');
    const mockDisconnectedCallback = jest.spyOn(BaseElement.prototype, 'disconnectedCallback');
    const mockAttributeChangedCallback = jest.spyOn(BaseElement.prototype, 'attributeChangedCallback');
    const mockAdoptedCallback = jest.spyOn(BaseElement.prototype, 'adoptedCallback');

    overrideElementDefine(mixinElement(HTMLElement, BaseElement));

    class CustomElement extends HTMLElement {
      static get observedAttributes() {
        return ['style'];
      }
    }

    window.customElements.define('custom-element', CustomElement);

    const element = document.createElement('custom-element');

    expect(mockConnectedCallback).toHaveBeenCalledTimes(0);

    // Append custom-element
    document.body.appendChild(element);

    expect(mockConnectedCallback).toHaveBeenCalledTimes(1);
    expect(mockDisconnectedCallback).toHaveBeenCalledTimes(0);

    document.body.removeChild(element);

    // Remove custom-element
    expect(mockConnectedCallback).toHaveBeenCalledTimes(1);

    // Change custom-element attribute
    expect(mockAttributeChangedCallback).toHaveBeenCalledTimes(0);

    element.setAttribute('style', 'color: red');

    expect(mockAttributeChangedCallback).toHaveBeenCalledWith('style', null, 'color: red', null);

    // Append to another document
    const parser = new DOMParser();
    const doc = parser.parseFromString('<div>root</div>', 'text/html');
    doc.body.appendChild(element);

    expect(mockAdoptedCallback).toHaveBeenCalledTimes(1);
  });
});
