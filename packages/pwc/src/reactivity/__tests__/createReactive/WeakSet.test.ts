import { jest } from '@jest/globals';
import { createReactive } from '../../createReactive';

describe('createReactive/Set', () => {
  const propName = 'prop';
  function foo() {}
  it('instanceof', () => {
    const mockCallback = jest.fn(foo);
    const original = new WeakSet();
    const reactived = createReactive(original, propName, mockCallback);

    expect(original instanceof WeakSet).toBe(true);
    expect(reactived instanceof WeakSet).toBe(true);
  });
  it('add/clear/delete should trigger handlers', () => {
    const mockCallback = jest.fn(foo);
    const original = new WeakSet();
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
  });
});