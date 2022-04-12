---
sidebar_position: 0
---

# 响应式更新

PWC 组件将外部输入和自身状态作为自身的属性。其中，响应式属性是当其发生更新时，会触发组件视图更新的属性。

## 使用
### 定义一个响应式属性

在 PWC 中，我们提供了 `reactive` 装饰器，配合 `accessor` 使用，即可将属性设置为响应式。

```js
import { reactive } from 'pwc';

class CustomElement extends HTMLElement {
  @reactive
  accessor data = { name: 'Tom' }; // 公共属性, 缺省值为 { name: 'Tom' }

  @reactive
  accessor #privateData = {}; // 私有属性
}
```

:::tip

Q: 关键字 `accessor` 是什么？

A: 带有 `accessor` 关键字的属性会自动生成 `setter` 和 `getter`。 了解详情请看：[proposal-decorators](https://github.com/tc39/proposal-decorators)

::: 

:::caution 注意事项

- 当属性上存在多个装饰器时，一定要保证 `reactive` 装饰器在

::: 


## 使用范围

### 公共属性和私有属性

公共属性是指组件可接收的、从外部传入的属性，是父子组件通信的重要途径。对于一个组件来说，其公共属性应当是只读的，其值只由外部环境所决定。公共属性与节点的 Attributes 形成发射关系。

私有属性是指组件内部所管理的组件状态，其值只由组件本身所决定。在 PWC 中，[以 # 为前缀](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) 的组件属性标识为该组件的私有属性。

公共属性和私有属性均可以设置为响应式属性。

### 公共属性的限制

正如前面所说，公共属性是组件将外部输入作为自身属性的，而一个 HTML 节点本身存在若干属性，因此在自定义公共属性时，应当注意避免取名冲突。

例如：[Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) 中的 `className` 表示其节点的类名，在自定义组件时，应当避免创建同名公共属性。

## 视图更新

### 如何更新

在 PWC 中，任何一个响应式属性发生变化时，都会触发组件的 `requestUpdate` 方法，该方法会把当前组件推入到更新队列中。更新并不会立即执行，而是下一个 `tick` 才触发视图更新。也就是说 PWC 组件的视图更新会合并在一个 `tick` 中。

在 PWC 中，视图是以点对点形式更新的，即一个属性的变化只会影响与其相关的视图，而不是整个组件。

// TODO 补充流程图

### nextTick

如果用户需要监听视图更新，那么可以使用 `nextTick` 方法。

```html
<template>
  <p>{{#count}}</p>
  <button @click={{handlClick}}>click</button>
</template>

<script>
import { reactive, nextTick } from 'pwc';
class CustomElement extends HTMLElement {
  @reactive
  accessor #count = 0;

  handlClick() {
    this.#count ++;
    nextTick(() => {
      console.log('count 已更新');
    });
  }
}
</script>
```


