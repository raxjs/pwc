import setAttribute from '../setAttribute';
import '../native/HTMLElement';

describe('Set element attribute/property/event handler', () => {
  it('should set attribute at built-in element', () => {
    const attrs = {
      ['data-index']: 1,
      class: 'container',
    };
    const div = document.createElement('div');
    setAttribute(div, attrs);
    expect(div.getAttribute('data-index')).toEqual('1');
    expect(div.dataset.index).toEqual('1');
    expect(div.getAttribute('class')).toEqual('container');
    expect(div.classList.contains('container')).toBeTruthy();
  });

  it('should set attribute and event handler at built-in element', () => {
    let child1ClickState: string = 'unchanged';
    let child2ClickState: string = 'unchanged';
    // Child1 element
    const child1ClickHandler = jest.fn().mockImplementation(() => {
      child1ClickState = 'child1 clicked';
    });
    const child1Attrs = {
      class: 'container',
      onclick: {
        handler: child1ClickHandler,
      },
    };
    const child1 = document.createElement('div');
    setAttribute(child1, child1Attrs);

    // Child2 element
    const child2ClickHandler = jest.fn().mockImplementation(() => {
      child2ClickState = 'child2 clicked';
    });
    const child2Attrs = {
      class: 'container',
      onclick: {
        handler: child2ClickHandler,
        capture: true,
      },
    };
    const child2 = document.createElement('div');
    setAttribute(child2, child2Attrs);

    const parentClickHandler = jest.fn().mockImplementation(() => {
      child1ClickState = 'parent clicked';
      child2ClickState = 'parent clicked';
    });
    const parentAttrs = {
      onclick: {
        handler: parentClickHandler,
      },
    };
    const parent = document.createElement('div');
    setAttribute(parent, parentAttrs);

    parent.appendChild(child1);
    parent.appendChild(child2);
    document.body.appendChild(parent);

    child1.click();
    expect(child1ClickState).toEqual('parent clicked');
    expect(child1ClickHandler).toBeCalled();
    expect(parentClickHandler).toBeCalledTimes(1);

    child2.click();
    expect(child2ClickState).toEqual('child2 clicked');
    expect(child2ClickHandler).toBeCalled();
    expect(parentClickHandler).toBeCalledTimes(2);
  });

  it('should set attribute and property at custom element', () => {
    class CustomElement extends HTMLElement {
      description = 'default description';
    }

    window.customElements.define('custom-element', CustomElement);

    const customElement: HTMLElement = document.createElement('custom-element');

    const attrs = {
      ['data-index']: 1,
      class: 'container',
      description: 'This is custom element',
    };

    setAttribute(customElement, attrs);

    expect(customElement.getAttribute('data-index')).toEqual('1');
    expect(customElement.dataset.index).toEqual('1');
    expect(customElement.getAttribute('class')).toEqual('container');
    expect(customElement.classList.contains('container')).toBeTruthy();
    // @ts-ignore
    expect(customElement.description).toEqual('This is custom element');
  });
});
