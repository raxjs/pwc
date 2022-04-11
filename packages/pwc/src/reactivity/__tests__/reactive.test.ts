import { Reactive } from '../reactive';

class MockReactiveElement {
  #initialized = false;
  isUpdating = false;
  reactive = new Reactive(this);
  _getInitialState() {
    return this.#initialized;
  };
  constructor(initialValue) {
    this.reactive.initValue('#data', initialValue);
    this.#initialized = true;
    this.isUpdating = false;
  }
  set data(val) {
    this.reactive.setValue('#data', val);
  }
  get data() {
    return this.reactive.getValue('#data');
  }
  _requestUpdate() {
    this.isUpdating = true;
  }
}
class MockNotReactiveElement {
  #initialized = false;
  isUpdating = false;
  reactive = new Reactive(this);
  _getInitialState() {
    return this.#initialized;
  };
  constructor(initialValue) {
    this.reactive.initValue('data', initialValue);
    this.#initialized = true;
    this.isUpdating = false;
  }
  set data(val) {
    this.reactive.setValue('data', val);
  }
  get data() {
    return this.reactive.getValue('data');
  }
  _requestUpdate() {
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
  function assertError(it: any, msg: string) {
    expect(it).toThrow(TypeError);
    expect(it).toThrow(msg);
  }

  it('It should request a update when the source changed', () => {
    const element = new MockNotReactiveElement('Jack');
    expect(element.isUpdating).toBe(false);
    element.data = 'Tom';
    expect(element.isUpdating).toBe(true);
    expect(element.data).toBe('Tom');
  });

  it('It should throw a error when a readonly object changed', () => {
    const element = new MockNotReactiveElement({
      name: 'Jack'
    });
    // change value
    assertError(() => element.data.name = 'Tom', `Cannot assign to read only property 'name' of object '#<Object>'`);
    
    // add prop
    assertError(() => element.data.number = '1', 'Cannot add property number, object is not extensible');

    // delete prop
    assertError(() => delete element.data['name'], `Cannot delete property 'name' of #<Object>`);
  });

  it('It should not request a update when a item changed', () => {
    const element = new MockNotReactiveElement(['Jack']);

    // push
    assertError(() =>  element.data.push('Tom'), 'Cannot add property 1, object is not extensible');
    
    // splice
    assertError(() => element.data.splice(1, 1), `Cannot assign to read only property 'length' of object '[object Array]'`);
  });
});
