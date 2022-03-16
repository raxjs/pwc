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
    let parent1ClickState: string = 'unchanged';
    let parent2ClickState: string = 'unchanged';
    // Parent1 element
    const parent1ClickHandler = jest.fn().mockImplementation(() => {
      parent1ClickState = 'parent1 clicked';
    });
    const parent1Attrs = {
      class: 'container',
      onclick: {
        handler: parent1ClickHandler,
      },
    };
    const parent1 = document.createElement('div');
    setAttribute(parent1, parent1Attrs);

    // Parent2 element
    const parent2ClickHandler = jest.fn().mockImplementation(() => {
      parent2ClickState = 'parent2 clicked';
    });
    const parent2Attrs = {
      class: 'container',
      onclick: {
        handler: parent2ClickHandler,
        capture: true,
      },
    };
    const parent2 = document.createElement('div');
    setAttribute(parent2, parent2Attrs);

    const childClickHandler = jest.fn().mockImplementation(() => {
      parent1ClickState = 'child clicked';
      parent2ClickState = 'child clicked';
    });
    const childAttrs = {
      onclick: {
        handler: childClickHandler,
      },
    };
    const child = document.createElement('div');
    setAttribute(child, childAttrs);

    document.body.appendChild(parent1);
    document.body.appendChild(parent2);

    parent1.appendChild(child);
    child.click();
    expect(parent1ClickState).toEqual('parent1 clicked');
    expect(parent1ClickHandler).toBeCalled();
    expect(childClickHandler).toBeCalledTimes(1);

    parent1.removeChild(child);
    parent2.appendChild(child);
    child.click();
    expect(parent2ClickState).toEqual('child clicked');
    expect(parent2ClickHandler).toBeCalled();
    expect(childClickHandler).toBeCalledTimes(2);
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
