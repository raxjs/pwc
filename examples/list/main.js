import { reactive, customElement, html } from 'pwc';

@customElement('custom-element')
class CustomElement extends HTMLElement {
  @reactive
  accessor #title;

  onClick() {
    this.#title = '123';
  }

  get template() {
    return {
      templateString: '<!--?pwc_p--><div>map: <!--?pwc_t--><!--?pwc_t--></div>',
      templateData: [
        [
          {
            name: 'onclick',
            handler: this.onClick
          },
        ],
        {
          templateString: 'title is <!--?pwc_t-->',
          templateData: [this.#title],
          template: true
        },
        [
          {
            templateString: 'title is <!--?pwc_t-->',
            templateData: [this.#title],
            template: true
          },
          {
            templateString: 'title is <!--?pwc_t-->',
            templateData: [this.#title],
            template: true
          }
        ]
      ],
      template: true
    };
  }
}
