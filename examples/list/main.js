import { reactive, customElement, html } from 'pwc';

@customElement('custom-element')
class CustomElement extends HTMLElement {
  @reactive
  accessor #title = 'default title';

  @reactive
  accessor #list = ['item 1', 'item 2', 'item 3', 'item 4'];

  @reactive
  accessor #flag = true;

  onClick() {
    this.#list.push('item 5');
  }

  handleItemClick(index) {
    console.log(index);
    this.#list = [...this.#list.slice(0, index), ...this.#list.slice(index + 1)];
  }

  handleToggle() {
    this.#flag = !this.#flag;
  }

  get template() {
    return html`<div @click=${this.handleToggle}>${this.#flag + ''}</div>`;
    // let result;
    // if (this.#flag) {
    //   result = this.#list.map((item, index) => {
    //     return html`<div @click=${this.handleToggle}>${item}</div>`
    //   });
    // } else {
    //   result = html`<div @click=${this.handleToggle}>${this.#flag + ''}</div>`;
    // }
    // return result;
    
    // const result = html`<div @click=${this.onClick}>
    //   ${html`${this.#list.map((item, index) => {
    //     if (item === 'item 2') {
    //       return null;
    //     }
    //     if (item === 'item 3') {
    //       return [1, 2, 3].map((insideItem) => {
    //         return html`<div @click=${() => this.handleItemClick(index)}>inside list: ${insideItem}</div>`;
    //       });
    //     }
    //     return html`<div @click=${() => this.handleItemClick(index)}>${item}</div>`;
    //   })}`}
    // </div>`;
    // console.log(result);
    // return result;

    // let result;
    // if (this.#flag) {
    //   result = html`<div @click=${this.handleToggle}>
    //     ${this.#flag + ''}
    //   </div>`;
    // } else {
    //   result = html`<div @click=${this.handleToggle}>
    //     ${html`${this.#list.map((item, index) => {
    //       if (item === 'item 2') {
    //         return null;
    //       }
    //       if (item === 'item 3') {
    //         return [1, 2, 3].map((insideItem) => {
    //           return html`<div @click=${() => this.handleItemClick(index)}>inside list: ${insideItem}</div>`;
    //         });
    //       }
    //       return html`<div @click=${() => this.handleItemClick(index)}>${item}</div>`;
    //     })}`}
    //   </div>`;
    // }
    // console.log(result);
    // return result;
    
    // const result = html`${this.#list.map((item, index) => {
    //   if (item === 'item 2') {
    //     return null;
    //   }
    //   if (item === 'item 3') {
    //     return [1, 2, 3].map((insideItem) => {
    //       return html`<div class=${item} @click=${() => this.handleItemClick(index)}>
    //         inside list: ${insideItem}
    //       </div>`;
    //     });
    //   }
    //   return html`<div class=${item} @click=${() => this.handleItemClick(index)}>${item}</div>`;
    // })}`;

    // console.log(result);
    // return result;
  }
}
