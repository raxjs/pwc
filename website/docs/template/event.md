---
sidebar_position: 2
---

# 事件绑定

## 监听事件

用户可以在模板中使用 `@` 语法糖监听 DOM 事件，并在其触发时执行一些 JavaScript 代码。

事件处理器的值可以是：

1. 内联事件处理器：事件被触发时执行的 JavaScript 表达式
2. 方法事件处理器：一个组件的属性名、或对某个方法的访问

### 内联事件处理器

内联事件处理器通常用于简单场景，例如：

```html
<template>
  <div @click="{{this.#count++}}"></div>
</template>
<script>
  export default CustomComponent extends HTMLElement {
    #count = 0;
  }
</script>
```

### 方法事件处理器

内联事件处理器仅支持单一的 JavaScript 表达式，当事件处理器需要处理复杂逻辑时，可以传入一个方法名或对某个方法的调用。例如：

```html
<template>
  <div @click="{{this.handleClick}}"></div>
</template>
<script>
  export default CustomComponent extends HTMLElement {
    handleClick = (event) => {
      // `event` 是 DOM 原生事件
      if (event) {
        alert(event.target.tagName);
      }
    }
  }
</script>
```

方法事件处理器会自动接收原生 DOM 事件并触发执行。在上面的例子中，我们能够通过被触发事件的 `event.target.tagName` 访问到该 DOM 元素。

### 在内联处理器中调用方法

除了直接绑定方法名，你还可以在内联事件处理器中调用方法。这允许我们向方法传入自定义参数：

```html
<template>
  <div @click="{{this.say('hello')}}"></div>
</template>
<script>
  export default CustomComponent extends HTMLElement {
    say = (msg) => {
      console.log(msg);
    }
  }
</script>
```

### 在内联事件处理器中访问事件参数

有时我们需要在内联事件处理器中访问原生 DOM 事件。你可以使用内联箭头函数：

```html
<template>
  <button @click="{{(event) => warn('Form cannot be submitted yet.', event)}}">
    Submit
  </button>
</template>
<script>
  export default CustomComponent extends HTMLElement {
    warn = (msg, event) => {
      if (event) {
        event.preventDefault();
      }
      console.log(msg);
    }
  }
</script>
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
