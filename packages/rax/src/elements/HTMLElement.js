import Reactive from '../Reactive';

const NativeElement = window.HTMLElement;

class HTMLElement extends NativeElement {
  constructor() {
    super();
    this.renderCallbacks = [];
    this.root = this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    const reactive = new Reactive(this.data);
    reactive.updater = () => {
      this.root.innerHTML = this.render(this.data, this.events);
      this.triggerRenderCallback();
    }
    const template = document.createElement('template');
    template.innerHTML = this.render(this.data, this.events);
    const fragment = template.content.cloneNode(true);
    this.fragment = fragment;
    this.root.appendChild(fragment);
    this.triggerRenderCallback();
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
