import { reactive, customElement, html, list } from 'pwc';

@customElement('custom-element')
class CustomElement extends HTMLElement {
  @reactive
  accessor #title;

  get template() {
    return {
      templateString: '<div>map: <!--?pwc_t--></div>',
      templateData: [
        {
          templateString: 'title is <!--?pwc_t-->',
          templateData: [this.#title],
          template: true
        }
      ],
      template: true
    };
  }
}
