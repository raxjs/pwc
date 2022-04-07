---
sidebar_position: 1
---

# 什么是 PWC ？

PWC 是一个渐进式增强的 Web Component UI 框架。在已有 Web Component 用法基础上，PWC 提供了 [MVVM 的数据视图绑定能力](https://zh.wikipedia.org/wiki/MVVM)，同时由于轻量的运行时代码和 Web Component 本身提供的组件化能力，可以在帮助开发者提高开发组件效率的基础上，达到组件高性能、轻量化等特点。

## 为什么选择 PWC ？🕵

谈到 UI Framework，开发者往往会想到 React/Vue/Angular 等等社区优秀的产品。但是，PWC 可以提供与它们完全不同的开发体验，借助浏览器原生的组件化能力，以及实现上直接拓展 `HTMLElement` 等原生基类，在不影响 Web Component 现有能力的前提下，让它们获得增强。

- **对中低端机（或嵌入式设备）性能有要求**。得益于浏览器原生的组件能力以及 MVVM 的架构设计，PWC 在运行时**不存在 VDOM**，进而可以大幅减少组件状态变化时的复杂计算以及简化更新逻辑，从而实现**低内存占用、高性能**的特点，在中低端设备上 PWC 会有更加突出的表现
- **希望提升首屏渲染速度，且对接入 SSR 没有强诉求**。当我们提到优化首屏渲染时间，往往会想到 Server Side Render，通过云端直出 HTML 结构来达到目的。SSR 同样会引入复杂的接入流程，以及较高的使用成本。这个时候，PWC 可能是另一个好的选择。PWC 简单的渲染流程，以及轻量的运行时，可以让纯客户端渲染的时间大大减少
- **让开发的物料不再被框架升级所困扰**。当业务到达一定量级后，会有沉淀业务域物料的诉求，这些物料会被应用广泛依赖。并且当功能迭代稳定之后，长时间内不会有新的变更。社区内大部分的 UI Framework 都存在 break change 的演进，这些演进将会导致存量物料存在极大的升级成本。而通过 PWC 开发的组件将不再被这个问题困扰，PWC 是在 Web Component 基础用法上根据 W3C 标准和 JavaScript 语言新特性提供渐进式增强的能力，输入和输出拥有绝对的确定性
- **组件能够轻松在其他框架中使用，并且具备响应式能力**。PWC 所开发的 Web Component 可以就像使用 `div` 这样的原生标签一样在 React/Vue 项目中使用，同时组件所接收的响应式属性也可以直接触发视图变更。所以，你完全可以在任意现有的 Web App 中直接使用 PWC，并且具备良好的性能以及状态管理能力

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

- PWC 是[直接扩展的 `HTMLElement` 等基础类](../base/render)，开发者可以使用 Web Component 原有的全部能力
- 开发者在 `template` 模板中使用到的组件属性，默认就[具备响应式的能力](../base/reactive)
- 快速便捷的[事件绑定](../base/event)方式，开发者可以通过 `@` 修饰符标识需要绑定的事件
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
    <input class="editInput" value="${this.editValue}" @input="${this.onInput.bind(this)}" @blur="${this.onBlur.bind(this)}" />
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
