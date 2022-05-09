import { createReactive } from '../../createReactive';

describe('createReactive/WeakMap', () => {
  const propName = 'prop';
  function foo() {}
  it('instanceof', () => {
    const mockCallback = jest.fn(foo);
    const original = new WeakMap();
    const reactived = createReactive(original, propName, mockCallback);

    expect(original instanceof WeakMap).toBe(true);
    expect(reactived instanceof WeakMap).toBe(true);
  });
  it('set/delete should trigger handlers', () => {
    const mockCallback = jest.fn(foo);
    const original = new WeakMap();
    const reactived = createReactive(original, propName, mockCallback);

    const a = {
      key: 'a'
    };
    const b = {
      key: 'b'
    };

    // set
    reactived.set(a, { foo: 1 });
    reactived.set(b, { foo: 2 });
    expect(mockCallback.mock.calls.length).toBe(2);

    // delete
    reactived.delete(a);
    expect(mockCallback.mock.calls.length).toBe(3);
  });
});