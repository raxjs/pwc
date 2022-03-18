import { Reactive } from '../reactive';
class MockElement {
  isUpdating: boolean = false;
  reactive = new Reactive(this);
  constructor(initialValue) {
    this.reactive.setReactiveValue('data', initialValue);
    this.isUpdating = false;
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
  });
  it('A object property should request a update', () => {
    const element = new MockElement({
      name: 'Jack'
    });
    expect(element.isUpdating).toBe(false);
    element.data.name = 'Tom';
    expect(element.isUpdating).toBe(true);
  });
  it('A array property should request a update', () => {
    const element = new MockElement(['Jack']);
    expect(element.isUpdating).toBe(false);
    element.data.push('Tom')
    expect(element.isUpdating).toBe(true);
  });
})