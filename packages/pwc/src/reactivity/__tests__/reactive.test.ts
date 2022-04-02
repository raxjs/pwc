import { Reactive } from '../reactive';
class MockElement {
  isUpdating: boolean = false;
  reactive = new Reactive(this);
  __initialized = false;
  constructor(initialValue) {
    this.reactive.initReactiveValue('data', initialValue);
    this.__initialized = true;
  }
  set data(val) {
    this.reactive.setReactiveValue('data', val);
  }
  get data() {
    return this.reactive.getReactiveValue('data');
  }
  requestUpdate() {
    this.isUpdating = true;
  }
}

describe('Create a reactive property', () => {
  it('A primitive property should request a update', () => {
    const element = new MockElement('Jack');
    expect(element.isUpdating).toBe(false);
    element.data = 'Tom';
    expect(element.isUpdating).toBe(true);
    expect(element.data).toBe('Tom');
  });
  it('A object property should request a update', () => {
    const element = new MockElement({
      name: 'Jack'
    });
    expect(element.isUpdating).toBe(false);

    // change value
    element.data.name = 'Tom';
    expect(element.isUpdating).toBe(true);
    expect(element.data).toEqual({ name: 'Tom' });
    element.isUpdating = false;

    // add prop
    element.data.number = '1';
    expect(element.isUpdating).toBe(true);
    expect(element.data).toEqual({ name: 'Tom', number: '1' });
    element.isUpdating = false;

    // delete prop
    delete element.data['number'];
    expect(element.isUpdating).toBe(true);
    expect(element.data).toEqual({ name: 'Tom' });
  });
  it('A array property should request a update', () => {
    const element = new MockElement(['Jack']);
    expect(element.isUpdating).toBe(false);

    // push
    element.data.push('Tom')
    expect(element.isUpdating).toBe(true);
    expect(element.data).toEqual(['Jack', 'Tom']);
    element.isUpdating = false;

    // splice
    element.data.splice(1, 1);
    expect(element.isUpdating).toBe(true);
    expect(element.data).toEqual(['Jack']);
  });
})
