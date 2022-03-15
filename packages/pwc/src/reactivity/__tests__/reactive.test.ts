import { Reactive } from '../reactive';

let isUpdating = false;

const mockElement = {
  data: {
  },
  name: '',
  arr: [],
  requestUpdate: () => {
    isUpdating = true;
  }
}

describe('Create a reactive property', () => {
  it('A primitive property should request a update', () => {
    const reactive = new Reactive(mockElement);
    reactive.createReactiveProperty('name', 'Jack');

    isUpdating = false;
    mockElement.name = 'Tom';

    expect(isUpdating).toBe(true);
  });
  it('A object property should request a update', () => {
    const reactive = new Reactive(mockElement);
    reactive.createReactiveProperty('data', {
      name: 'Jack'
    });

    isUpdating = false;
    mockElement.data['name'] = 'Tom';

    expect(isUpdating).toBe(true);
  });
  it('A array property should request a update', () => {
    const reactive = new Reactive(mockElement);
    reactive.createReactiveProperty('arr', [0]);

    isUpdating = false;
    mockElement.arr.push(1);

    expect(isUpdating).toBe(true);
  });
})