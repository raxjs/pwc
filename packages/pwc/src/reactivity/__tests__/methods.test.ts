import { jest } from '@jest/globals';
import { createReactive } from '../createReactive';
import { toRaw, getProperties, isReactive } from '../methods';

describe('reactive methods', () => {
  const propName = 'prop';
  it('toRaw', () => {
    const mockCallback = jest.fn(() => {});
    const source = { foo: 1 };
    const reactived = createReactive(source, propName, mockCallback);

    const raw = toRaw(reactived);
    expect(raw).toBe(source);
  });

  it('getProperties', () => {
    const mockCallback = jest.fn(() => {});
    const source = { obj: { foo: 1 } };
    const reactived = createReactive(source, propName, mockCallback);

    expect(getProperties(reactived)).toEqual(new Set([propName]));
    expect(getProperties(reactived.obj)).toEqual(new Set([propName]));
  });

  it('isReactive', () => {
    const mockCallback = jest.fn(() => {});
    const source = { obj: { foo: 1 } };
    const reactived = createReactive(source, propName, mockCallback);

    expect(isReactive(reactived)).toBe(true);
    expect(isReactive(source)).toBe(false);
  });
});