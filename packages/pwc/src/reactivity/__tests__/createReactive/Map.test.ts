import { createReactive } from '../../createReactive';

describe('createReactive/Map', () => {
  const propName = 'prop';
  function foo() {}
  it('instanceof', () => {
    const mockCallback = jest.fn(foo);
    const original = new Map();
    const reactived = createReactive(original, propName, mockCallback);

    expect(original instanceof Map).toBe(true);
    expect(reactived instanceof Map).toBe(true);
  });
  it('set/clear/delete should trigger handlers', () => {
    const mockCallback = jest.fn(foo);
    const original = new Map();
    const reactived = createReactive(original, propName, mockCallback);

    // set
    reactived.set('a', { foo: 1 });
    reactived.set('b', { foo: 2 });
    expect(mockCallback.mock.calls.length).toBe(2);

    // delete
    reactived.delete('a');
    expect(mockCallback.mock.calls.length).toBe(3);

    // clear
    reactived.clear();
    expect(mockCallback.mock.calls.length).toBe(4);
  });

  it('should observe for "of"', () => {
    const mockCallback = jest.fn(foo);
    const original = new Map([
      [{ key: 'a' }, {  value: 'a' }],
      [{ key: 'b' }, {  value: 'a' }],
    ]);
    const reactived = createReactive(original, propName, mockCallback);

    let index = 1;
    for(let [key, value] of reactived) {
      key.key += '!';
      expect(mockCallback.mock.calls.length).toBe(index++);
      value.value += '!';
      expect(mockCallback.mock.calls.length).toBe(index++);
    }
  });

  it('should observe for "forEach"', () => {
    const mockCallback = jest.fn(foo);
    const original = new Map([
      [{ key: 'a' }, {  value: 'a' }],
      [{ key: 'b' }, {  value: 'a' }],
    ]);
    const reactived = createReactive(original, propName, mockCallback);

    let index = 1;
    reactived.forEach((key, value) => {
      key.key += '!';
      expect(mockCallback.mock.calls.length).toBe(index++);
      value.value += '!';
      expect(mockCallback.mock.calls.length).toBe(index++);
    });
  });

  it('should observe for "keys"', () => {
    const mockCallback = jest.fn(foo);
    const original = new Map([
      [{ key: 'a' }, {  value: 'a' }],
      [{ key: 'b' }, {  value: 'a' }],
    ]);
    const reactived = createReactive(original, propName, mockCallback);

    let index = 1;
    const keys = reactived.keys();
    for (let key of keys) {
      key.key += '!';
      expect(mockCallback.mock.calls.length).toBe(index++);
    }
  });

  it('should observe for "values"', () => {
    const mockCallback = jest.fn(foo);
    const original = new Map([
      [{ key: 'a' }, {  value: 'a' }],
      [{ key: 'b' }, {  value: 'a' }],
    ]);
    const reactived = createReactive(original, propName, mockCallback);

    let index = 1;
    const values = reactived.values();
    for (let value of values) {
      value.value += '!';
      expect(mockCallback.mock.calls.length).toBe(index++);
    }
  });

  it('should observe for "get"', () => {
    const mockCallback = jest.fn(foo);
    const original = new Map([
      ['a', {  value: 'a' }],
    ]);
    const reactived = createReactive(original, propName, mockCallback);

    const value = reactived.get('a');
    value.value = 'b';
    expect(mockCallback.mock.calls.length).toBe(1);
  });
});