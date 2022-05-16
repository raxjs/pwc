import { jest } from '@jest/globals';
import { createReactive } from '../../createReactive';

describe('createReactive', () => {
  const propName = 'prop';
  it('Obecjt', () => {
    const mockCallback = jest.fn(() => {});
    const source = { foo: 1 };
    const reactived = createReactive(source, propName, mockCallback);

    reactived.foo = 2;
    expect(mockCallback.mock.calls.length).toBe(1);

    // assign new object
    reactived.newObj = {
      foo: 1
    };
    expect(mockCallback.mock.calls.length).toBe(2);

    // nesting changed
    reactived.newObj.foo = 2;
    expect(mockCallback.mock.calls.length).toBe(3);
  });
  it('Array', () => {
    const mockCallback = jest.fn(() => {});
    const source: any[] = ['foo', { foo: 1 }];
    const reactived = createReactive(source, propName, mockCallback);

    reactived[0] = 'newItem';
    expect(mockCallback.mock.calls.length).toBe(1);

    // nesting changed
    reactived[1].foo = 2;
    expect(mockCallback.mock.calls.length).toBe(2);

    // methods
    reactived.push({ foo: 2 });
    expect(mockCallback.mock.calls.length).toBe(3);

    // new item changed
    reactived[2].foo = 3;
    expect(mockCallback.mock.calls.length).toBe(4);
  });
});
