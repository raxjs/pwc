import { jest } from '@jest/globals'
import { commitAttributes } from '../../part';
import '../../native/HTMLElement';

describe('Set/Update/Remove element attribute/property/event handler', () => {
  it('should set/update/remove attribute at built-in element', () => {
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
    commitAttributes(div, attrs, { isInitial: true });
    expect(div.getAttribute('data-index')).toEqual('1');
    expect(div.dataset.index).toEqual('1');
    expect(div.getAttribute('class')).toEqual('container');
    expect(div.classList.contains('container')).toBeTruthy();

    const currentAttrs = [
      // update
      {
        name: 'data-index',
        value: 2
      },
      // add
      {
        name: 'id',
        value: 'demo'
      }
      // remove class
    ];
    commitAttributes(div, [attrs, currentAttrs]);

    expect(div.getAttribute('data-index')).toEqual('2');
    expect(div.dataset.index).toEqual('2');

    expect(div.getAttribute('class')).toBe(null);
    expect(div.classList.length).toBe(0);

    expect(div.getAttribute('id')).toEqual('demo');
    expect(div.id).toEqual('demo');
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
        handler: parent1ClickHandler,
      },
    ];
    const parent1 = document.createElement('div');
    commitAttributes(parent1, parent1Attrs, { isInitial: true });

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
        handler: parent2ClickHandler,
        capture: true,
      },
    ];
    const parent2 = document.createElement('div');
    commitAttributes(parent2, parent2Attrs, { isInitial: true });

    const childClickHandler = jest.fn().mockImplementation(() => {
      parent1ClickState = 'child clicked';
      parent2ClickState = 'child clicked';
    });
    const childAttrs = [
      {
        name: 'onclick',
        handler: childClickHandler,
      },
    ];
    const child = document.createElement('div');
    commitAttributes(child, childAttrs, { isInitial: true });

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

  it('should set/update/remove attribute and property at custom element', () => {
    class CustomElement extends HTMLElement {
      description = 'default description';
      number = 0;
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
        name: 'title',
        value: 'This is a title'
      },
      {
        name: 'description',
        value: 'This is custom element',
      },
    ];

    commitAttributes(customElement, attrs, { isInitial: true });

    expect(customElement.getAttribute('data-index')).toEqual('1');
    expect(customElement.dataset.index).toEqual('1');
    expect(customElement.getAttribute('class')).toEqual('container');
    expect(customElement.classList.contains('container')).toBeTruthy();
    // @ts-ignore
    expect(customElement.title).toEqual('This is a title');
    // @ts-ignore
    expect(customElement.description).toEqual('This is custom element');

    const currentAttrs = [
      // update attribute
      {
        name: 'data-index',
        value: 2
      },
      // add attribute
      {
        name: 'id',
        value: 'demo'
      },
      // remove attribute
      // update property
      {
        name: 'title',
        value: 'Title Changed'
      },
      // add property
      {
        name: 'number',
        value: 1
      }
      // remove property
    ];

    commitAttributes(customElement, [attrs, currentAttrs]);

    expect(customElement.getAttribute('data-index')).toEqual('2');
    expect(customElement.dataset.index).toEqual('2');

    expect(customElement.getAttribute('class')).toBe(null);
    expect(customElement.classList.length).toBe(0);

    expect(customElement.getAttribute('id')).toEqual('demo');
    expect(customElement.id).toEqual('demo');

    // @ts-ignore
    expect(customElement.title).toEqual('Title Changed');
    // @ts-ignore
    expect(customElement.number).toBe(1);
    // @ts-ignore
    expect(customElement.description).toBe(undefined);
  });

  it('should add/update/remove event listener at element', () => {
    const mockClickHandler1 = jest.fn();
    const div = document.createElement('div');
    const attrs = [
      {
        name: 'onclick',
        handler: mockClickHandler1,
        capture: true,
      }
    ];
    commitAttributes(div, attrs);
    div.click();
    expect(mockClickHandler1).toBeCalledTimes(1);
    
    const mockClickHandler2 = jest.fn();
    const changedAttrs = [
      {
        name: 'onclick',
        handler: mockClickHandler2,
        capture: true,
      }
    ];
    commitAttributes(div, [attrs, changedAttrs]);
    div.click();
    expect(mockClickHandler1).toBeCalledTimes(1);
    expect(mockClickHandler2).toBeCalledTimes(1);

    const removeAttrs = [];
    commitAttributes(div, [changedAttrs, removeAttrs]);
    div.click();
    expect(mockClickHandler1).toBeCalledTimes(1);
    expect(mockClickHandler2).toBeCalledTimes(1);
  });

  it('Svg elements should be set as attributes', () => {
    const svg = document.createElement('svg');
    const attrs = [{
      name: 'width',
      value: '200'
    }, {
      name: 'height',
      value: '200'
    }];

    commitAttributes(svg, attrs);
    expect(svg.getAttribute('width')).toEqual('200');

    const currentAttrs = [{
      name: 'height',
      value: '200'
    }];

    commitAttributes(svg, [attrs, currentAttrs]);
    expect(svg.getAttribute('width')).toBe(null);
    expect(svg.getAttribute('height')).toEqual('200');
  });
});
