---
sidebar_position: 4
---

# 响应式更新

PWC 组件将外部输入和自身状态作为自身的属性。其中，响应式属性是当其发生更新时，会触发相关组件视图更新的属性。

在 PWC 中，我们提供了 `reactive` 装饰器，配合 [accessor](https://github.com/tc39/proposal-decorators) 使用，即可将属性设置为响应式。

示例如下：

```js
import { reactive } from 'pwc';

class CustomComponent extends HTMLElement {
  @reactive
  accessor count = 0; // count 被设置为响应式属性
}
```

## 私有属性

私有属性是指组件内部所管理的组件状态，其值只由组件本身所决定。用户无法在组件外修改私有属性的值。在 PWC 中，[以 # 为前缀](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) 的组件属性标识为该组件的私有属性。

### 设置为响应式

设置为响应式的私有属性发生更新时，与之相关的组件视图包括子组件视图都会随之更新。

在下述例子中，组件 `ParentComponent` 中的私有属性 `#count` 为响应式属性。当通过点击按钮使其发生变化时，以其作为来源的 `ChildComponent` 中的视图会随之发生变化。

```html title="./src/parentComponent.pwc"
<template>
  <div>
    <button @click="{{this.onClick}}">Click</button>
    <child-component count="{{this.#count}}"></child-component>
  </div>
</template>
<script>
  import { reactive, customElement } from 'pwc';
  import ChildComponent from './childComponent.pwc';

  @customElement('parent-component')
  class ParentComponent extends HTMLElement {
    @reactive
    accessor #count = 0; // 将 #count 设置为响应式属性

    onClick() {
      this.#count++;
    }
  }
</script>
```

```html title="./src/childComponent.pwc"
<template>
  <span>{{this.count}}</span>
</template>
<script>
  import { customElement } from 'pwc';

  @customElement('child-componnet')
  class ChildComponent extends HTMLElement {
    count = 0; // count 为 child-component 接收的来自于外部数据的公共属性
  }
</script>
```

### 深响应

在 PWC 中，私有属性的响应式为深响应。当属性为数组 或 `Plain Object` 类型时，在该属性上的任何修改都会被检测到:

```js
class CustomComponent extends HTMLElement {
  @reactive
  accessor #data = {};

  @reactive
  accessor #items = [];

  // 运行 handle 函数时，#data 和 #items 的变化都会被检测到
  handle() {
    this.#data.name = 'Tom';
    this.#items.push('Tom');
  }
}
```

## 公共属性

公共属性是指组件可接收的、从外部传入的属性，是父子组件通信的重要途径。对于一个组件来说，其公共属性应当是只读的，其值只由外部环境所决定。公共属性与节点的 Attributes 形成发射关系。

### 设置为响应式

设置为响应式的公共属性发生更新时，与之相关的组件视图包括子组件视图都会随之更新。

在下述例子中，组件 `ChildComponent` 中的公共属性 `count` 为响应式属性。当在 `index.js` 中通过设置 `el.count = 1` 修改其值时，组件 `ChildComponent` 会发生更新。

```html title="./src/childComponent.pwc"
<template>
  <span>{{this.count}}</span>
</template>
<script>
  import { reactive, customElement } from 'pwc';

  @customElement('child-componnet')
  class ChildComponent extends HTMLElement {
    @reactive
    accessor count = 0; // 将公共属性 count 设置为响应式
  }
</script>
```

```js title="./src/index.js"
import './childComponent.pwc';

const el = document.createElement('child-component');
document.body.appendChild(el);
el.count = 1; // 设置 count 属性
```

### 浅响应

不同于私有属性的深度响应，公共属性的响应为浅响应。当且仅当属性被重新赋值时，才会被检测到。

```js
// el 是一个 pwc 组件实例
el.count = 1; // 直接赋值，会被检测到
el.data.name = 'Tom'; // 深层修改，不会被检测到
```

当然，在一个更新周期内，任何一个被检测到的响应发生时，由于会重新获取所有视图相关属性的值，其他未被检测到的属性也会被更新到视图上。

### 公共属性名称限制

正如前面所说，公共属性是组件将外部输入作为自身属性的，而一个 HTML 节点本身存在若干属性，因此在自定义公共属性时，应当注意避免取名冲突。

例如：[Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) 中的 `className` 表示其节点的类名，在自定义组件时，应当避免创建同名公共属性。

## 什么属性应该被设置为响应式

在开发时可能会遇到困惑，不知道组件的什么属性应当设置为响应式，这时可根据以下两条准则进行设置：

1. 影响当前组件渲染的私有属性
2. 影响当前组件渲染的公共属性

在开发时可能会遇到已经被设置为响应式的公共属性其来源数据已经被设置为响应式，这种情况下当数据发生变更时，只会触发一次视图更新，因此无需担心。

## 视图更新

### 如何更新

在 PWC 中，任何一个响应式属性发生变化时，都会触发组件的 `_requestUpdate` 方法，该方法会把当前组件推入到更新队列中。更新并不会立即执行，而是下一个 `tick` 才触发视图更新。也就是说同一个 PWC 组件的视图更新会合并在一个 `tick` 中。

在 PWC 中，视图是以点对点形式更新的，即一个属性的变化只会影响与其相关的视图，而不是整个组件。

// TODO 补充流程图

### nextTick

如果用户需要监听视图更新，那么可以使用 `nextTick` 方法。

```html
<template>
  <p>{{#count}}</p>
  <button @click="{{handlClick}}">click</button>
</template>

<script>
  import { reactive, nextTick } from 'pwc';
  class CustomElement extends HTMLElement {
    @reactive
    accessor #count = 0;

    handlClick() {
      this.#count++;
      nextTick(() => {
        console.log('count 已更新');
      });
    }
  }
</script>
```
