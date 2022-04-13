---
sidebar_position: 2
---

# 事件绑定

## 监听事件

用户可以在模板中使用 `@` 语法糖监听 DOM 事件，并在其触发时执行一些 JavaScript 代码。

// TODO

## 事件处理方法

事件触发回调逻辑复杂时，用户可以直接传入一个函数方法，供 DOM 事件触发后执行：

示例：

```html
<template>
  <button @click="{{this.onSave}}">Save</button>
</template>
```

```js
export default class CustomComponent extends HTMLElement {
  onSave = () => {
    console.log('saved');
  }
}
```

## 事件修饰符

在绑定事件时采用捕获方式处理是非常常见的需求。尽管我们可以在方法中轻松实现这点，但更好的方式是：方法只有纯粹的数据逻辑，而不是去处理 DOM 事件细节。

为了解决该问题，PWC 为事件绑定提供了事件修饰符。目前支持以下类型：

- `.capture`

```html

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div @click.capture="{{handleClick}}"></div>
```
