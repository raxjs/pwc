import { Attributes, NormalAttribute, PWCElement } from '../../type';
import { commitAttributes } from './utils/commitAttributes';
import { BasePart } from './base';
import { getProperties } from '../../reactivity/methods';

export function genIsAttributeChanged(changedProperties: Set<string>) {
  return function (attr: NormalAttribute): boolean {
    const { value } = attr;
    const properties = getProperties(value);

    for (let prop of properties) {
      if (changedProperties.has(prop)) {
        return true;
      }
    }
    return false;
  };
}

export class AttributesPart extends BasePart {
  #el: Element;
  #elIsCustom: boolean;
  #elIsSvg: boolean;

  constructor(commentNode: Comment, rootElement: PWCElement, initialValue: Attributes) {
    super(commentNode, rootElement, initialValue);
    this.#el = this.commentNode.nextSibling as Element;
    this.#elIsCustom = Boolean(window.customElements.get(this.#el.localName));
    this.#elIsSvg = this.#el instanceof SVGElement;
    this.render(initialValue);
  }

  render(value: Attributes) {
    if (this.#elIsCustom) {
      // @ts-ignore
      this.#el.__init_task__ = () => {
        this.commitAttributes(value, true);
      };
    } else {
      this.commitAttributes(value, true);
    }
  }

  commitValue([prev, current]: [Attributes, Attributes]) {
    const updated = this.commitAttributes([prev, current]);

    // Any updating should trigger the child components's update method
    if (this.#elIsCustom && (this.#el as PWCElement)._requestUpdate && updated) {
      (this.#el as PWCElement)._requestUpdate();
    }
  }

  commitAttributes(value: Attributes | [Attributes, Attributes], isInitial = false): boolean {
    const changedProperties = this.rootElement._getChangedProperties();

    const isAttributeChanged = genIsAttributeChanged(changedProperties);

    return commitAttributes(this.#el, value, {
      isInitial,
      isSVG: this.#elIsSvg,
      rootElement: this.rootElement,
      isAttributeChanged,
    });
  }
}