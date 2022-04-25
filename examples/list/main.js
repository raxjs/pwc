import { reactive, customElement, html } from 'pwc';

@customElement('custom-element')
class CustomElement extends HTMLElement {
  @reactive
  accessor #title;

  get template() {
    return {
      templateString: '<div>map: <!--?pwc_t--></div>',
      templateData: [
        [1, 3, 2].map((i) => ({
          templateString: 'title is <!--?pwc_t-->',
          templateData: [i],
          template: true
        }))
      ],
      template: true
    };
  }
}
