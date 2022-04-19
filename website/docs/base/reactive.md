---
sidebar_position: 0
---

# 响应式更新

响应式更新是指当某些属性发生变化时，与之相关的视图会随之更新，而不需要用户手动操作 DOM。响应式更新是增强 Web Components 的重要方向之一，该功能可以大大降低使用 Web Components 开发组件的成本，提高开发效率。

在 PWC 中，响应式属性需要包裹 `reactive` 装饰器并配合 `accessor` 访问器：

```js
class CustomElement extends HTMLElement {
  @reactive
  accessor data = {};   // data 的更新会触发视图更新

  @reactive
  accessor #privateData = {}; // #privateData 的更新会触发视图更新
}
```

为了提升效率，PWC 构建器会自动为 `.pwc` 文件中参与视图更新的属性增加 `@reactive accessor`。

## 监听数据

我们提供了两种方案来监听数据：[Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 和 [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)。

| 方案                  | 监听效果 | 性能 | 兼容性 |
| --------------------- | -------- | ---- | ------ |
| Proxy                 | 好       | 好   | 一般   |
| Object.defineProperty | 一般     | 一般 | 好     |

`Proxy` 相比于 `Object.defineProperty` 监听效果好，性能好，但是在浏览器兼容性上，不支持 IOS 9，用户可根据需要选择监听方案。

[Proxy 兼容性](https://caniuse.com/proxy)：

![](https://img.alicdn.com/imgextra/i3/O1CN01bH2nN11HTfMgxDYLK_!!6000000000759-0-tps-1374-588.jpg)

在监听效果上，两者存在区别：

1. 使用 `Object.defineProperty` 方案时，不能监听对象的新增属性。

```js
class CustomElement extends HTMLElement {
  @reactive
  accessor #data = {};

  handleChange() {
    this.#data.count = 0; // 使用 Object.defineProperty 时，不会触发更新
  }
}
```

2. 使用 `Object.defineProperty` 方案时，对象属性的直接赋值会导致监听功能丢失。

```js
class CustomElement extends HTMLElement {
  @reactive
  accessor #data = {
    someObject: {
      count: 0
    }
  };

  handleChange() {
    const newObject = {
      count: 0
    };
    this.#data.someObject = newObject;  // 使用 Object.defineProperty 时， someObject 上的响应式会丢失
  }
}
```

// TODO 增加方案选择配置的例子

## 更新流程

![flow](https://img.alicdn.com/imgextra/i3/O1CN01XBI2yI1UswDxSEXvH_!!6000000002574-2-tps-786-420.png)

更新是异步的。当一个响应式属性发生变更时，会在更新任务列表中塞入当前组件的更新任务。若某个组件发生多次更新时，只会保留一个更新任务。

在下一次 `tick` 中，会批量执行任务列表中的更新任务，即完成组件视图的更新。

## 定点更新

在 PWC 中，没有 Virtual DOM，也没有 VDOM Diff 更新算法，我们采用效率更高的点对点更新。

![diff](https://img.alicdn.com/imgextra/i1/O1CN01eiouCX29Chx4antxE_!!6000000008032-2-tps-758-720.png)

模板被分为两个部分：静态模板和数据。静态模板是保持不变的，只有数据会发生变化并触发视图的更新。

视图中每一个填充了数据的位置被认为是一个动态点位，在数据更新后，会通过比对这些动态点位对应的数据，如果数据发生了变化，则该点位会进行更新。

## APIs

### nextTick

```js
function nextTick(callback?: () => void): Promise<void>
```

如前文所介绍，在 PWC 中，从数据更新到视图更新的过程是异步的。在最近一次视图更新后，`nextTick` 就会被执行。用户可以通过传入一个回调函数或等待 `nextTick` 返回的 `Promise` 执行完成来监听视图更新。

例子：

```html
<template>
  <div @click={{this.handleClick}}>{{this.#count}}</div>
</template>


<script>

import { reactive, nextTick } from 'pwc';

export class CustomElement extends HTMLElement {
  @reactive
  accessor #count = 0;

  handleClick() {
    this.#count++;
    console.log('数据已更新，视图未更新');
    nextTick(() => {
      console.log('视图已更新');
    });
  }
}
</script>
```

### toRaw

```js
function toRaw<T>(proxy: T): T
```

在 `Proxy` 方案中，复杂类型的响应式属性会被转变为 `Proxy` 对象，如果想要得到原始属性，可以通过 `toRaw` 方法。

例子：

```html
<template>
  <div @click={{this.handleClick}}>{{this.#data.count}}</div>
</template>


<script>

import { reactive, toRaw } from 'pwc';

class CustomElement extends HTMLElement {
  @reactive
  accessor #data = {
    count: 0
  };

  handleClick() {
    console.log(this.#data); // proxy 对象
    const originCount = toRaw(this.#data);
    console.log(this.#data); // { count: 0 }
  }
}
</script>
```
