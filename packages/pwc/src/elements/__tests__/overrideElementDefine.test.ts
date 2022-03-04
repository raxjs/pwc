import overrideElementDefine from '../overrideElementDefine';

describe('Override original element define.', () => {
  it('should override Parent Class', () => {
    class Parent {
      name = 'parent'
    };
    class Child extends Parent {
      age = 10
    };

    window['Parent'] = Parent;

    expect(window['Parent']).toStrictEqual(Parent);

    overrideElementDefine(Child);

    expect(window['Parent']).toStrictEqual(Child);
  });
});
