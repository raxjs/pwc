import { Reactive } from '../reactive';

class MockReactiveElement {
  #initialized = false;
  isUpdating: boolean = false;
  reactive = new Reactive(this);
  _getInitialState() {
    return this.#initialized;
  };
  constructor(initialValue) {
    this.reactive.initReactiveValue('data', initialValue);
    this.#initialized = true;
  }
  set data(val) {
    this.reactive.setReactiveValue('data', val);
  }
  get data() {
    return this.reactive.getValue('data');
  }
  requestUpdate() {
    this.isUpdating = true;
  }
}
class MockNotReactiveElement {
  isUpdating: boolean = false;
  reactive = new Reactive(this);
  constructor(initialValue) {
    this.reactive.setValue('data', initialValue);
    this.isUpdating = false;
  }
  set data(val) {
    this.reactive.setValue('data', val);
  }
  get data() {
    return this.reactive.getValue('data');
  }
  requestUpdate() {
    this.isUpdating = true;
  }
}

describe('Create a reactive property', () => {
  it('A primitive property should request a update', () => {
    const element = new MockReactiveElement('Jack');
    expect(element.isUpdating).toBe(false);
    element.data = 'Tom';
    expect(element.isUpdating).toBe(true);
    expect(element.data).toBe('Tom');
  });
  it('A object property should request a update', () => {
    const element = new MockReactiveElement({
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
    const element = new MockReactiveElement(['Jack']);
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
});

describe('Create a normal property', () => {
  it('It should request a update when the source changed', () => {
    const element = new MockNotReactiveElement('Jack');
    expect(element.isUpdating).toBe(false);
    element.data = 'Tom';
    expect(element.isUpdating).toBe(true);
    expect(element.data).toBe('Tom');
  });

  it('It should not request a update when a property changed', () => {
    const element = new MockNotReactiveElement({
      name: 'Jack'
    });
    expect(element.isUpdating).toBe(false);

    // change value
    element.data.name = 'Tom';
    expect(element.isUpdating).toBe(false);
    expect(element.data).toEqual({ name: 'Tom' });

    // add prop
    element.data.number = '1';
    expect(element.isUpdating).toBe(false);
    element.isUpdating = false;

    // delete prop
    delete element.data['number'];
    expect(element.isUpdating).toBe(false);
  });

  it('It should not request a update when a item changed', () => {
    const element = new MockNotReactiveElement(['Jack']);
    expect(element.isUpdating).toBe(false);

    // push
    element.data.push('Tom')
    expect(element.isUpdating).toBe(false);
    expect(element.data).toEqual(['Jack', 'Tom']);

    // splice
    element.data.splice(1, 1);
    expect(element.isUpdating).toBe(false);
    expect(element.data).toEqual(['Jack']);
  });
});
