import { attribute, customElement, reactive } from '..';
import '../../elements/native/HTMLElement';
import { nextTick } from '../../elements/sheduler';
import { compileTemplateInRuntime as html } from '@pwc/compiler';

let count = 0;

function genLocalName() {
  return `custom-element-${count++}`;
}

describe('attribute decorator', () => {
  it('should reflect property to attribute', () => {
    const localName = genLocalName();
    @customElement(localName)
    class CustomElement extends HTMLElement {
      @attribute('attr-name')
      accessor attrName = 'default value';
    }

    document.body.innerHTML = `<${localName} attr-name="outside value" />`;
    const el = document.getElementsByTagName(localName)[0];
    expect(el.attrName).toEqual('outside value');
    el.attrName = 'changed value';
    expect(el.getAttribute('attr-name')).toEqual('outside value');
  });

  it('should reflect boolean attribute', async () => {
    const childLocalName = genLocalName();
    const parentLocalName = genLocalName();

    @customElement(childLocalName)
    class Child extends HTMLElement {
      @attribute('attr-toggle')
      accessor toggle = false;
    }

    @customElement(parentLocalName)
    class CustomElement extends HTMLElement {
      get template() {
        return html` <custom-element-1></custom-element-1>
          <custom-element-1 attr-toggle=${true}></custom-element-1>`;
      }
    }
    document.body.innerHTML = `<${parentLocalName} />`;
    await nextTick();
    const el = document.getElementsByTagName(childLocalName)[0];
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
    expect(el.getAttribute('attr-toggle')).toEqual('[object Object]');

    // render with parent
    const el1 = document.getElementsByTagName(childLocalName)[1];
    expect(el1.toggle).toEqual(true);
    // change property
    el1.toggle = false;
    expect(el1.toggle).toEqual(false);
    expect(el1.getAttribute('attr-toggle')).toEqual('true');
  });

  it('should get right property value when first render', async () => {
    const childLocalName = genLocalName();
    const parentLocalName = genLocalName();
    @customElement(childLocalName)
    class Child extends HTMLElement {
      @attribute('item-title')
      accessor childTitle;
      get template() {
        return html`<div>${this.childTitle}</div>`;
      }
    }

    @customElement(parentLocalName)
    class Parent extends HTMLElement {
      itemTitle = 'title';
      get template() {
        return html`<custom-element-3 item-title=${this.itemTitle} />`;
      }
    }

    const el = document.createElement(parentLocalName);
    document.body.appendChild(el);
    await nextTick();
    expect(el.innerHTML).toEqual(
      `<!--?pwc_p--><${childLocalName} item-title="title"><div>title<!--?pwc_t--></div><!--?pwc_t--></${childLocalName}><!--?pwc_t-->`,
    );
  });

  it('should be right with mix two decorators', async () => {
    const localName = genLocalName();
    @customElement(localName)
    class CustomElement extends HTMLElement {
      @reactive
      @attribute('attr-name')
      accessor attrName = 'default value';
      get template() {
        return html`<div>${this.attrName}</div>`;
      }
    }

    const el = document.createElement(localName);
    el.setAttribute('attr-name', 'outside value');
    document.body.appendChild(el);

    expect(el.attrName).toEqual('outside value');
    el.attrName = 'changed value';
    expect(el.getAttribute('attr-name')).toEqual('outside value');
    await nextTick();
    expect(el.innerHTML).toEqual('<div>changed value<!--?pwc_t--></div><!--?pwc_t-->');
  });

  it('should throw error without accessor', () => {
    const localName = genLocalName();
    expect(() => {
      @customElement(localName)
      class CustomElement extends HTMLElement {
        @attribute('attr-name')
        attrName = 'default value';
        get template() {
          return html`<div>${this.attrName}</div>`;
        }
      }
    }).toThrowError(__DEV__ ? `The attribute decorator should be added to the class field with accessor, like:

      class extends HTMLElement {
        @attribute('attr-name')
        accessor attrName
      }
  `: 'Error: #0.');
  });

  it('should work without initialValue', async () => {
    @customElement('custom-element-a')
    class CustomElement extends HTMLElement {
      @attribute('attr-name')
      accessor attrName;
      get template() {
        return html`<div>${this.attrName}</div>`;
      }
    }
    document.body.innerHTML = '<custom-element-a attr-name="outside value"></custom-element-a>';
    await nextTick();
    const el = document.getElementsByTagName('custom-element-a')[0];
    expect(el.attrName).toEqual('outside value');
  });
});
