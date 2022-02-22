import Reactive from '../Reactive';

const NativeElement = window.HTMLElement;

const TEXT_PLACEHOLDER = '__r_t__';

class HTMLElement extends NativeElement {
  renderCallbacks = []
  constructor() {
    super();
  }
  createTextBinding(text) {
    return {
      type: 'text',
      content: text,
    };
  }
  getTextPlaceHolder() {
    return document.createNodeIterator(
      this.root,
      NodeFilter.SHOW_COMMENT,
      {
        acceptNode(node) {
          return node.data && node.data.includes(TEXT_PLACEHOLDER);
        }
      }
    );
  }
  connectedCallback() {
    const reactive = new Reactive(this.data);
    const template = document.createElement('template');
    const [strings, values] = this.render();
    this.__strings = strings;
    this.__values = values;
    template.innerHTML = this.generateHTMLStr();
    this.root = template.content.cloneNode(true);
    this.appendChild(this.root);
  }
  generateHTMLStr() {
    return '';
  }
  triggerRenderCallback() {
    let fn;
    while ((fn = this.renderCallbacks.pop())) {
      fn.call(this);
    }
  }
  nextTick(fn) {
    this.renderCallbacks.push(fn);
  }
}

window.HTMLElement = HTMLElement;
