---
sidebar_position: 1
---

# 基础渲染

PWC 使用基于 HTML 的模板语法来定义组件渲染的内容。你可以在单文件组件中使用 `<template>` 标签书写模板，模板中可以使用 PWC 的特有声明式语法来进行 DOM 与数据的绑定。

在底层实现上，PWC 在编译时会将模板进行预处理，以确保运行时能够更快地渲染。此外，我们也提供了用户直接书写 `get template()` 的方法来定义模板，但运行时解析模板将损耗一部分性能，因此并不推荐。

## 模板语法

### 文本插值

文本插值允许你将动态字符串值合并到 HTML 模板中。通过插值，你可以动态更改应用视图中显示的内容。插值使用双花括号 `{{` 和 `}}` （即 Mustache 语法）作为定界符：

```html
<span>Current Player: {{ currentPlayer }}</span>
```

对应 PWC 组件上的 `currentPlayer` 值将替换模板中的 `{{ currentPlayer }}`。当 `currentPlayer` 的值发生变更时，视图内容同样会更新。

### 使用 JavaScript 表达式（模板表达式）

// TODO

### 属性绑定

PWC 中的属性绑定可帮助你设置 HTML 元素或 PWC 组件的属性值。使用属性绑定时，需要用双引号内使用 Mustache 语法：

```html
<img src="{{imageUrl}}" />
```

上述示例中，img 的 `src` 属性将与 PWC 组件中的 `imageUrl` 值保持同步。

Attribute 与 Property 绑定均使用以上语法。关于二者区别，可参考[//TODO](../base/reactive)

### 指令

// TODO

#### 条件渲染

#### 列表渲染

## 运行时模板

除了在 PWC 单文件组件中通过使用 `<template>` 书写模板，你还可以在 PWC 组件直接使用 `get template()` 方法定义模板：

```js
import { html } from 'pwc';
export default class CustomComponent extends HTMLElement {
  get template() {
    return html`<div>this is runtime template</div>`
  }
}
```

运行时模板的写法与单文件组件 `<template>` 模板存在差异，你需要手动从 `pwc` 中引入 `html` 方法，然后用[带标签的模板字符串](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)的形式书写模板。属性绑定和文本插值均改为使用标准的模板字符串占位符形式（即 `${expression}`）。此外，在单文件组件 `<template>` 中，你可以直接使用 PWC 组件上定义的变量（即省略 `this`），但是在运行时模板中使用 PWC 组件变量必须使用完整方式，示例如下：

```js
import { html } from 'pwc';
export default class CustomComponent extends HTMLElement {

  className = 'container';

  title = 'pwc';

  get template() {
    return html`<div class=${this.className}>this is ${this.title}</div>`
  }
}
```
