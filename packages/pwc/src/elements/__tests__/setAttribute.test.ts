import setAttribute from '../setAttribute';

describe('Set element attribute/property/event handler', () => {
  it('should set right attributes at built-in element', () => {
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
});
