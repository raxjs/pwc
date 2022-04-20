import { Reactive } from '../reactive';
import { toRaw } from '../../utils';

class MockReactiveElement {
  #initialized = false;
  isUpdating = false;
  reactive = new Reactive(this);
  _getInitialState() {
    return this.#initialized;
  };
  constructor(initialValue) {
    this.reactive.initValue('#data', initialValue);
    this.reactive.initValue('data', initialValue);
    this.#initialized = true;
    this.isUpdating = false;
  }
  set data(val) {
    this.reactive.setValue('#data', val);
  }
  get data() {
    return this.reactive.getValue('#data');
  }
  set publicData(val) {
    this.reactive.setValue('data', val);
  }
  get publicData() {
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

    // private property
    element.data = 'Tom';
    expect(element.isUpdating).toBe(true);
    expect(element.data).toBe('Tom');

    element.isUpdating = false;
    expect(element.isUpdating).toBe(false);

    // public property
    element.publicData = 'Tom';
    expect(element.isUpdating).toBe(true);
    expect(element.publicData).toBe('Tom');
  });
  it('A object property should request a update', () => {
    const element = new MockReactiveElement({
      name: 'Jack'
    });
    expect(element.isUpdating).toBe(false);

    // 1. private property
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

    // 2. public property
    // change value
    element.publicData.name = 'Tom';
    expect(element.isUpdating).toBe(true);
    expect(element.publicData).toEqual({ name: 'Tom' });
    element.isUpdating = false;

    // add prop
    element.publicData.number = '1';
    expect(element.isUpdating).toBe(true);
    expect(element.publicData).toEqual({ name: 'Tom', number: '1' });
    element.isUpdating = false;

    // delete prop
    delete element.publicData['number'];
    expect(element.isUpdating).toBe(true);
    expect(element.publicData).toEqual({ name: 'Tom' });
  });
  it('A array property should request a update', () => {
    const element = new MockReactiveElement(['Jack']);
    expect(element.isUpdating).toBe(false);

    // 1. private property
    // push
    element.data.push('Tom')
    expect(element.isUpdating).toBe(true);
    expect(element.data).toEqual(['Jack', 'Tom']);
    element.isUpdating = false;

    // splice
    element.data.splice(1, 1);
    expect(element.isUpdating).toBe(true);
    expect(element.data).toEqual(['Jack']);

    // 2. public property
    // push
    element.publicData.push('Tom')
    expect(element.isUpdating).toBe(true);
    expect(element.publicData).toEqual(['Jack', 'Tom']);
    element.isUpdating = false;

    // splice
    element.publicData.splice(1, 1);
    expect(element.isUpdating).toBe(true);
    expect(element.publicData).toEqual(['Jack']);
  });
  it('Public Data Should be shallow cloned', () => {
    const data = {
      someObject: {}
    };
    const element = new MockReactiveElement(data);

    expect(toRaw(element.data) === data).toBe(true);
    expect(toRaw(element.publicData) === data).toBe(false);
  })
});
