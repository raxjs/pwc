import { attribute, customElement, reactive } from '..';
import '../../elements/native/HTMLElement';
import { nextTick } from '../../elements/sheduler';
import { compileTemplateInRuntime as html } from '@pwc/compiler';

describe('attribute decorator', () => {
  it('should reflect property to attribute', () => {
    @customElement('custom-element')
    class CustomElement extends HTMLElement {
      @attribute('attr-name')
      accessor attrName = 'default value';
    }

    document.body.innerHTML = '<custom-element attr-name="outside value" />';
    const el = document.getElementsByTagName('custom-element')[0];
    expect(el.attrName).toEqual('outside value');
    el.attrName = 'changed value';
    expect(el.getAttribute('attr-name')).toEqual('changed value');
    // set object
    el.attrName = {
      x: 1,
    };
    expect(el.getAttribute('attr-name')).toEqual('[object Object]');
    // set array
    el.attrName = [1, 2, 3];
    expect(el.getAttribute('attr-name')).toEqual('1,2,3');
  });

  it('should reflect boolean attribute', () => {
    @customElement('custom-element-1')
    class CustomElement extends HTMLElement {
      @attribute('attr-toggle')
      accessor toggle = false;
    }

    document.body.innerHTML = '<custom-element-1 />';
    const el = document.getElementsByTagName('custom-element-1')[0];
    expect(el.toggle).toEqual(false);
    // set null
    el.setAttribute('attr-toggle', null);
    expect(el.toggle).toEqual(true);

    // remove attribute
    el.removeAttribute('attr-toggle');
    expect(el.toggle).toEqual(false);

    // set integer
    el.setAttribute('attr-toggle', 123);
    expect(el.toggle).toEqual(true);

    // set object
    el.setAttribute('attr-toggle', { x: 1 });
    expect(el.toggle).toEqual(true);

    // change property
    el.toggle = false;
    expect(el.getAttribute('attr-toggle')).toEqual(null);
  });

  it('should get right property value when first render', () => {
    @customElement('custom-element-2')
    class Child extends HTMLElement {
      @attribute('item-title')
      accessor childTitle;
      get template() {
        return html`<div>${this.childTitle}</div>`;
      }
    }

    @customElement('custom-element-3')
    class Parent extends HTMLElement {
      itemTitle = 'title';
      get template() {
        return html`<custom-element-2 item-title=${this.itemTitle} />`;
      }
    }

    const el = document.createElement('custom-element-3');
    document.body.appendChild(el);
    expect(el.innerHTML).toEqual(
      '<!--?pwc_p--><custom-element-2 item-title="title"><div>title<!--?pwc_t--></div></custom-element-2>',
    );
  });

  it('should be right with mix two decorators', async () => {
    @customElement('custom-element-4')
    class CustomElement extends HTMLElement {
      @reactive
      @attribute('attr-name')
      accessor attrName = 'default value';
      get template() {
        return html`<div>${this.attrName}</div>`;
      }
    }

    const el = document.createElement('custom-element-4');
    el.setAttribute('attr-name', 'outside value');
    document.body.appendChild(el);

    expect(el.attrName).toEqual('outside value');
    el.attrName = 'changed value';
    expect(el.getAttribute('attr-name')).toEqual('changed value');
    await nextTick();
    expect(el.innerHTML).toEqual('<div>changed value<!--?pwc_t--></div>');
  });

  it('should throw error without accessor', () => {
    expect(() => {
      @customElement('custom-element-5')
      class CustomElement extends HTMLElement {
        @attribute('attr-name')
        attrName = 'default value';
        get template() {
          return html`<div>${this.attrName}</div>`;
        }
      }
    }).toThrowError(`The attribute decorator should be added to the class field with accessor, like:

      class extends HTMLElement {
        @attribute('attr-name')
        accessor attrName
      }
  `);
  });
});
