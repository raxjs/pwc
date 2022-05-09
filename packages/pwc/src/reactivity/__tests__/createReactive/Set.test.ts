import { createReactive } from '../../createReactive';

describe('createReactive/Set', () => {
  const propName = 'prop';
  function foo() {}
  it('instanceof', () => {
    const mockCallback = jest.fn(foo);
    const original = new Set();
    const reactived = createReactive(original, propName, mockCallback);

    expect(original instanceof Set).toBe(true);
    expect(reactived instanceof Set).toBe(true);
  });
  it('add/clear/delete should trigger handlers', () => {
    const mockCallback = jest.fn(foo);
    const original = new Set();
    const reactived = createReactive(original, propName, mockCallback);

    // add
    const a = { foo: 1 };
    const b = { foo: 2 };
    reactived.add(a);
    reactived.add(b);
    expect(mockCallback.mock.calls.length).toBe(2);

    // delete
    reactived.delete(a);
    expect(mockCallback.mock.calls.length).toBe(3);

    // clear
    reactived.clear();
    expect(mockCallback.mock.calls.length).toBe(4);
  });

  it('should observe for "of"', () => {
    const mockCallback = jest.fn(foo);
    const original = new Set([
      {  value: 'a' },
      {  value: 'b' },
    ]);
    const reactived = createReactive(original, propName, mockCallback);

    let index = 1;
    for(let value of reactived) {
      value.value += '!';
      expect(mockCallback.mock.calls.length).toBe(index++);
    }
  });

  it('should observe for "forEach"', () => {
    const mockCallback = jest.fn(foo);
    const original = new Set([
      {  value: 'a' },
      {  value: 'b' },
    ]);
    const reactived = createReactive(original, propName, mockCallback);

    let index = 1;
    reactived.forEach((value) => {
      value.value += '!';
      expect(mockCallback.mock.calls.length).toBe(index++);
    });
  });

  it('should observe for "values"', () => {
    const mockCallback = jest.fn(foo);
    const original = new Set([
      {  value: 'a' },
      {  value: 'b' },
    ]);
    const reactived = createReactive(original, propName, mockCallback);

    let index = 1;
    const values = reactived.values();
    for (let value of values) {
      value.value += '!';
      expect(mockCallback.mock.calls.length).toBe(index++);
    }
  });
});