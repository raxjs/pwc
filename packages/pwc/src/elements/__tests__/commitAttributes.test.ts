import { commitAttributes } from '../commitAttributes';
import '../native/HTMLElement';

describe('Set element attribute/property/event handler', () => {
  it('should set attribute at built-in element', () => {
    const attrs = [
      {
        name: 'data-index',
        value: 1,
      },
      {
        name: 'class',
        value: 'container',
      },
    ];
    const div = document.createElement('div');
    commitAttributes(div, attrs, true);
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
    const parent1Attrs = [
      {
        name: 'class',
        value: 'container',
      },
      {
        name: 'onclick',
        value: parent1ClickHandler,
      },
    ];
    const parent1 = document.createElement('div');
    commitAttributes(parent1, parent1Attrs, true);

    // Parent2 element
    const parent2ClickHandler = jest.fn().mockImplementation(() => {
      parent2ClickState = 'parent2 clicked';
    });
    const parent2Attrs = [
      {
        name: 'class',
        value: 'container',
      },
      {
        name: 'onclick',
        value: parent2ClickHandler,
        capture: true,
      },
    ];
    const parent2 = document.createElement('div');
    commitAttributes(parent2, parent2Attrs, true);

    const childClickHandler = jest.fn().mockImplementation(() => {
      parent1ClickState = 'child clicked';
      parent2ClickState = 'child clicked';
    });
    const childAttrs = [
      {
        name: 'onclick',
        value: childClickHandler,
      },
    ];
    const child = document.createElement('div');
    commitAttributes(child, childAttrs, true);

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

    const attrs = [
      {
        name: 'data-index',
        value: 1,
      },
      {
        name: 'class',
        value: 'container',
      },
      {
        name: 'description',
        value: 'This is custom element',
      },
    ];

    commitAttributes(customElement, attrs, true);

    expect(customElement.getAttribute('data-index')).toEqual('1');
    expect(customElement.dataset.index).toEqual('1');
    expect(customElement.getAttribute('class')).toEqual('container');
    expect(customElement.classList.contains('container')).toBeTruthy();
    // @ts-ignore
    expect(customElement.description).toEqual('This is custom element');
  });

  it('should only add event listener once with component update', () => {
    const mockClickHandler = jest.fn();
    const div = document.createElement('div');
    const attrs = [
      {
        name: 'onclick',
        value: mockClickHandler,
        capture: true,
      }
    ];
    commitAttributes(div, attrs, true);
    div.click();
    expect(mockClickHandler).toBeCalledTimes(1);
    commitAttributes(div, attrs, false);
    div.click();
    expect(mockClickHandler).toBeCalledTimes(2);
  });
});
