import { PWCElement } from '../../type';
import { isFalsy } from '../../utils';
import { BasePart } from './base';

export class TextPart extends BasePart {
  el: Text;

  constructor(commentNode: Comment, rootElement: PWCElement, initialValue: string) {
    super(commentNode, rootElement, initialValue);
    this.render(initialValue);
  }

  commitValue([prev, current]: [string, string]) {
    if (prev !== current) {
      this.el.nodeValue = this.formatValue(current);
    }
  }

  render(value: string) {
    const textNode = document.createTextNode(this.formatValue(value));
    this.el = textNode;
    this.commentNode.parentNode.insertBefore(textNode, this.commentNode);
  }

  remove() {
    this.commentNode.parentNode.removeChild(this.el);
  }

  formatValue(value: string): string {
    return isFalsy(value) ? '' : value;
  }
}
