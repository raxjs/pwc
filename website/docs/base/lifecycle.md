---
sidebar_position: 2
---

# 生命周期

PWC 开发的组件完全遵守 Web Component 标准的生命周期。[MDN 上关于组件标准的生命周期可以看这篇文档](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks)。

:::note

由于 PWC 是直接扩展的 `HTMLElement` 等原生基类，所以请务必保证组件要先执行父类对应的生命周期方法。比如 `super.connectedCallback()`。

:::

## `constructor`

在组件创建时被触发。此时组件通过响应式属性绑定的状态还没有渲染到最终模板节点上。

:::caution

在该阶段还**获取不到**的外部传入的 `property`。

:::

**使用方式**

可以在该阶段执行一些不依赖外部 `property` 的初始化操作，同时由于该阶段视图还未渲染，所以可以对一些响应式属性进行初始化赋值操作。

```js
constructor() {
  super();
  this.#foo = 'foo';
  this.#bar = 'bar';
}
```

## `connectedCallback`

在组件被渲染到文档流中的时候触发。

:::caution

该生命周期存在多次触发的可能性，比如以下代码：

```javascript
const customPWCElement = document.createElement('custom-element');
// 此时会触发 customPWCElement 的 connectedCallback
parent1.appendChild(customPWCElement);
parent1.removeChild(customPWCElement);
// 此时会再次触发 customPWCElement 的 connectedCallback
parent2.appendChild(customPWCElement);
```

:::

**使用方式**

在这个阶段开发者可以拿到外部设置的 `property`。

如果有初始数据请求的需求，可以配合 [`lodash.once`](https://www.lodashjs.com/docs/lodash.once)实现：

```javascript
import once from 'lodash/once';

export default class extends HTMLElement {
  pageId;
  #pageTitle;
  onInit() {
    once(() => {
      fetch({
        data: {
          pageId: this.pageId,
        },
      }).then(({ pageTitle }) => {
        this.#pageTitle = pageTitle;
      });
    });
  };
  connectedCallback() {
    super.connectedCallback();
    this.onInit();
  }
}
```

有些场景需要在组件初始化后监听一些事件，例如：

```javascript
connectedCallback() {
  super.connectedCallback()
  addEventListener('keydown', this._handleKeydown);
}
```

**注意：** 在组件从文档流中卸载时，需要取消监听器，避免内存泄漏，具体详见 `disconnectedCallback`。

## `disconnectedCallback`

在组件从文档流中移除时触发。

**使用方式**

可以在该阶段执行取消监听器的操作，因为当组件被销毁时，全局的监听器并没有被取消，所以在预期逻辑执行完后，如果不取消监听器，就会有一定可能导致内存泄漏。

```javascript
disconnectedCallback() {
  super.disconnectedCallback()
  window.removeEventListener('keydown', this._handleKeydown);
}
```

**注意：** 组件自身节点上绑定的事件无需被取消监听，因为当节点被销毁后，这些逻辑都会被垃圾回收。

## `attributeChangedCallback`

`observedAttributes` 返回的 `attribute` 会被监听修改。

**使用方式**

```javascript
export default class extends HTMLElement {
  static observedAttributes() {
    return ['custom-attr'];
  }
  attributeChangedCallback(attrName, oldValue, newValue) {}
}
```

## `adoptedCallback`

当组件被移入一个新的文档流时触发。
