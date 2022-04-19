---
sidebar_position: 1
---

# 什么是 PWC ？

PWC 是一个渐进式增强 Web Components 的理念。希望在已有 Web Components 用法基础上，通过各种有效的方式渐进式拓展 Web Components 的能力，帮助开发者在提高开发组件效率的基础上，达到组件高性能、轻量化等目的。并且推动 Web Components 标准能够进一步发展。

## Web Components 的优势 🤠

谈到 UI Framework，开发者往往会想到 React/Vue/Angular 等等社区优秀的产品。究其本质，是提供一套组件化的 UI 描述能力，帮助开发者更好的开发应用。而 Web Components 是完全不同的技术，是浏览器原生支持的组件化能力，也就是说开发者不再需要在内存中创建 Virtual Component，就可以将页面的模块进行抽象复用。

- **低内存占用、高性能**。 Web Components 是浏览器原生支持的组件化能力。所以在运行时**不存在 VDOM**，进而可以大幅减少组件状态变化时的复杂计算以及简化更新逻辑，在中低端设备上 Web Components 会有更加突出的表现
- **组件能够轻松在其他框架中使用**。使用 Web Components 技术开发的组件可以像使用 `div` 这样的原生标签一样在 React/Vue 项目中使用，所以开发者完全可以根据自己的需求，在有需求的地方使用它

## 为什么不直接使用 Web Components ? 🫣

Web Components 拥有以上如此有吸引力的特点，为什么一直没有被重视或者被更广泛的使用呢？

### 复杂的创建方式

开发者如果需要渲染一个组件视图需要使用以下方法：

```javascript
class CustomElement extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = '<div>hello world</div>';
    const templateContent = template.content;

    this.appendChild(templateContent.cloneNode(true));
  }
}

window.customElements.define('custom-element', CustomElement);
```

### 更新组件必须直接使用 DOM API

众所周知，Virtual DOM 除了提供组件化的能力外，还可以将视图变更的操作进行批次处理，避免频繁操作 DOM 所带来的的性能损耗。

```javascript
class CustomElement extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = '<div id="container">hello world</div>';
    const templateContent = template.content;

    this.appendChild(templateContent.cloneNode(true));
  }

  connectedCallback() {
    fetchData((data) => {
      const el = document.getElementById('container');
      el.textContent = data.content;
    });
  }
}

window.customElements.define('custom-element', CustomElement);
```

上面的示例还仅仅只包含了普通的内容更新，如果涉及到**事件绑定**、**列表渲染**、**条件渲染**等常用场景会更加复杂。

### 标签名冲突

Web Components 在页面中是通过全局 [CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry) 进行注册使用。其底层的数据结构是 `key` 为 `Symbol` 数据类型的 `Map`，也就是说页面上的标签名必须是唯一的。在这个背景下，对于开发者和组件使用者而言都存在为了避免标签名冲突而产生的使用成本。

比如以下的例子：

`Child` 组件为 `Parent` 内部的子组件，开发者只将 `Parent` 组件暴露给外部使用，但却需要考虑 `Child` 的组件名会不会和全局的标签名产生冲突。

```javascript
class Child extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = '<div>Child</div>';
    const templateContent = template.content;

    this.appendChild(templateContent.cloneNode(true));
  }
}

// 注册子组件
window.customElements.define('child-element', Child);

class Parent extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = '<div><child-element></child-element></div>';
    const templateContent = template.content;

    this.appendChild(templateContent.cloneNode(true));
  }
}

// 注册父组件
window.customElements.define('parent-element', Parent);
```

### 样式隔离必须用到 shadow DOM

Web Components 的优势之一是通过 shadow DOM 创造一个隔离环境，但是对于有兼容低端机诉求的业务而言无法开启 shadow DOM。这就导致开发者通过 Web Components 开发的组件在一定程度上会面临样式冲突的可能性。

<img src="https://img.alicdn.com/imgextra/i4/O1CN01hAEjay1mUM34CezXw_!!6000000004957-2-tps-2730-1026.png" />


## PWC 渐进式增强的思路 🚀

在清楚的知道 Web Components 能够带来巨大价值的背景下，PWC 的理念应运而生。PWC 希望能够渐进式增强 Web Components，通过完全不影响其原有特性的方式来解决开发过程中现存的各种问题，并进一步争取将部分增强的能力标准化并成为 W3C 标准的一部分。


<img src='https://img.alicdn.com/imgextra/i4/O1CN01IbUQQY1woBLyJ3zEA_!!6000000006354-2-tps-3262-938.png' />


### 便捷的视图创建方式

PWC 为 `HTMLElement` 等基类演进了 `template` 属性，开发者可以快速为自己的组件创建一个视图。

```javascript
import { customElement } from 'pwc';

// 通过 customElement 装饰器快速注册组件
@customElement('custom-element')
class CustomElement extends HTMLElement {
  get template() {
    return ['<div>Hello world</div>']
  }
}
```

另外，针对有变量绑定的场景，PWC 提供了 `html` 方法帮助开发者快速创建 `template` 需要返回的数据格式：

```javascript
import { html } from 'pwc';

const helloMsg = 'Hello world';

@customElement('custom-element')
class CustomElement extends HTMLElement {
  get template() {
    return html`<div>${helloMsg}</div>`
  }
}
```

### 响应式系统

针对如果快速将数据反应到视图变更这个常见需求，PWC 提供了一套响应式系统帮助开发者快速将数据和视图产生绑定关系。

```javascript
import { html, reactive, customElement } from 'pwc';
import fetchData from './fetchData';

@customElement('custom-element')
class CustomElement extends HTMLElement {
  @reactive
  accessor #helloMsg = 'Hello world'
  connectedCallback() {
    super.connectedCallback();
    fetchData().then(({ msg }) => {
      // 数据变更最终会响应到视图
      this.#helloMsg = msg;
    });
  }
  get template() {
    return html`<div>${this.#helloMsg}</div>`
  }
}
```

### 事件绑定

为了让开发者不再需要获取 DOM 节点再进行事件绑定，PWC 扩展了事件绑定方式：

```javascript
import { html, customElement } from 'pwc';

const helloMsg = 'Hello world';

@customElement('custom-element')
class CustomElement extends HTMLElement {
  onClick() {
    console.log('Clicked!!!');
  }
  get template() {
    return html`<div @click=${this.onClick}>${helloMsg}</div>`
  }
}
```

### PWC 单文件组件

虽然上述扩展的能力已经能够提升开发 Web Components 的效率，但是依然存在以下问题：

- **性能存在瓶颈**，`template` 解析的过程在运行时阶段，当模板结构越复杂的时候，会导致组件性能下降
- **代码提示缺失**，由于 `template` 属性传入的是字符串，所以在书写 html 结构的时候，代码提示不够丰富，同时没有代码高亮
- **代码量依然很大**，开发者必须要给与视图有绑定关系的数据加上 `reactive` 装饰器，每个组件都要手动调用 `customElement` 装饰器进行注册

为此，PWC 提供了单文件组件的形式在构建阶段来解决上述的问题。

```html
<template>
  <div class='container'>{{this.#count}}</div>
</template>

<script>
export default class CountElement extends HTMLElement {
  #count = 0
  onClick() {
    this.#count++;
  }
}
</script>

<style>
  .container {
    color: red;
  }
</style>
```

:::info 单文件组件的优势

- 更符合标准的开发直觉，即组件由 `template`/`style`/`script` 三个部分组成，学习成本较低
- 可以引入更多编译时优化，标准的 `template` 结构可以让 PWC 在编译时就解析出来完整的 HTML 结构，从引入更多涉及到性能方面的优化，同时开发者不再需要主动加上 `reactive` 装饰器
- style 内的样式默认就可以做到只在当前文件生效，不存在样式污染的问题
- 更好的代码提示，模板的写法让 IDE 的提示更加友好，同时还可以获得高亮的能力

:::

## PWC 

- **对中低端机（或嵌入式设备）性能有要求**。得益于浏览器原生的组件能力以及 MVVM 的架构设计，PWC 在运行时**不存在 VDOM**，进而可以大幅减少组件状态变化时的复杂计算以及简化更新逻辑，从而实现**低内存占用、高性能**的特点，在中低端设备上 PWC 会有更加突出的表现
- **希望提升首屏渲染速度，且对接入 SSR 没有强诉求**。当我们提到优化首屏渲染时间，往往会想到 Server Side Render，通过云端直出 HTML 结构来达到目的。SSR 同样会引入复杂的接入流程，以及较高的使用成本。这个时候，PWC 可能是另一个好的选择。PWC 简单的渲染流程，以及轻量的运行时，可以让纯客户端渲染的时间大大减少
- **让开发的物料不再被框架升级所困扰**。当业务到达一定量级后，会有沉淀业务域物料的诉求，这些物料会被应用广泛依赖。并且当功能迭代稳定之后，长时间内不会有新的变更。社区内大部分的 UI Framework 都存在 break change 的演进，这些演进将会导致存量物料存在极大的升级成本。而通过 PWC 开发的组件将不再被这个问题困扰，PWC 是在 Web Components 基础用法上根据 W3C 标准和 JavaScript 语言新特性提供渐进式增强的能力，输入和输出拥有绝对的确定性
- **组件能够轻松在其他框架中使用，并且具备响应式能力**。PWC 所开发的 Web Components 可以就像使用 `div` 这样的原生标签一样在 React/Vue 项目中使用，同时组件所接收的响应式属性也可以直接触发视图变更。所以，你完全可以在任意现有的 Web App 中直接使用 PWC，并且具备良好的性能以及状态管理能力

## 如何开发一个 PWC 组件 ？👨‍💻‍

PWC **推荐使用单文件组件**的形式进行开发，如果你熟悉 Vue，应该对这种开发模式不会陌生。每一个 PWC 组件都是独立的文件以及 UI 元素，你也可以组合多个 PWC 组件变成一个功能型的区块。下面是一个 edit-word 组件示例，通过这个例子你可以体验到 PWC 的一些基础能力与用法：

> TODO:
> 这里待补充一个 playground 代码片段

```html
<template>
  <form class="{{#editVisiblityClass}}">
    <input class="editInput" value="{{editValue}}" @input="{{onInput}}" @blur="{{onBlur}}" />
  </form>
  <span @click="{{onClick}}" class="{{#textVisiblityClass}}">{{editValue}}</span>
</template>

<script>
  export default class EditWord extends HTMLElement {
    editValue = 'Cindy';

    #editable = false;

    #editVisiblityClass = 'hide';

    #textVisiblityClass = 'show';

    onClick() {
      this.#editable = true;
      this.#editVisiblityClass = 'show';
      this.#textVisiblityClass = 'hide';
    }

    onInput(event) {
      this.editValue = event.srcElement.value;
    }

    onBlur() {
      this.#editable = false;
      this.#editVisiblityClass = 'hide';
      this.#textVisiblityClass = 'show';
    }
  }
</script>

<style>
  span {
    background-color: #eef;
    padding: 0 2px;
  }
  .editInput {
    width: 50px;
  }
  .show {
    display: inline-block;
  }
  .hide {
    display: none;
  }
</style>
```

从上面的例子，你可以发现 PWC 在用法上有以下特点：

- PWC 是[直接扩展的 `HTMLElement` 等基础类](../template/base)，开发者可以使用 Web Components 原有的全部能力
- 开发者在 `template` 模板中使用到的组件属性，默认就[具备响应式的能力](../base/reactive)
- 快速便捷的[事件绑定](../template/event)方式，开发者可以通过 `@` 修饰符标识需要绑定的事件
- 开发者可以[直接在 `style` 标签内写样式](../base/style)，并且工程会默认将 style 里样式进行 hash，避免样式污染

:::info 单文件组件的优势

- 更符合标准的开发直觉，即组件由 `template`/`style`/`script` 三个部分组成，学习成本较低
- 可以引入更多编译时优化，标准的 `template` 结构可以让 PWC 在编译时就解析出来完整的 HTML 结构，从引入更多涉及到性能方面的优化
- style 内的样式默认就可以做到只在当前文件生效，不存在样式污染的问题
- 更好的代码提示，模板的写法让 IDE 的提示更加友好，同时还可以获得高亮的能力

:::

### 直接通过 `template` 属性进行渲染

虽然 PWC 推荐使用单文件组件开发。但是在某些场景下，开发者直接可以通过 `template` 属性渲染组件，而不需要创建 `.pwc` 文件。

:::caution 这种渲染方式的缺点

- **性能下降**，`template` 解析的过程会从构建阶段挪到运行时阶段，当模板结构越复杂的时候，对性能的影响越大
- **代码提示缺失**，由于 `template` 属性传入的是字符串，所以在书写 html 结构的时候，代码提示不够丰富，同时没有代码高亮
- **无法自动补全 `reactive` 装饰器**，灵活的 JavaScript 语法让 PWC 完全无法做到给开发者的代码补充 `reactive` 装饰器等便捷语法，因此所有响应式属性开发者都必须自己手动加上 `reactive` 装饰器，模板的用法也有所改变

:::

> TODO:
> 这里待补充一个 playground 代码片段

```javascript
import { customElement, reactive, html } from 'pwc';

@customElement('edit-word')
export default class EditWord extends HTMLElement {
  @reactive
  accessor editValue = 'Cindy';

  @reactive
  accessor #editable = false;

  @reactive
  accessor #editVisiblityClass = 'hide';

  @reactive
  accessor #textVisiblityClass = 'show';

  onClick() {
    this.#editable = true;
    this.#editVisiblityClass = 'show';
    this.#textVisiblityClass = 'hide';
  }

  onInput(event) {
    this.editValue = event.srcElement.value;
  }

  onBlur() {
    this.#editable = false;
    this.#editVisiblityClass = 'hide';
    this.#textVisiblityClass = 'show';
  }

  get template() {
    return html`<form class="${this.#editVisiblityClass}">
        <input
          class="editInput"
          value="${this.editValue}"
          @input="${this.onInput.bind(this)}"
          @blur="${this.onBlur.bind(this)}"
        />
      </form>
      <span @click="${this.onClick.bind(this)}" class="${this.#textVisiblityClass}">${this.editValue}</span>`;
  }
}
```

:::tip 什么时候需要用这种方式渲染

- 希望使用 JavaScript 灵活渲染组件
- 不希望强依赖官方的构建器

:::

## 性能对比 🚀

> 待补充性能对比
