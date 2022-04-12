---
sidebar_position: 1
---

# attribute 反射

`attribute` 反射指的是，开发者可以将组件的属性和 `attribute` 产生映射关系， `attribute` 的变更**可能**会**影响**组件属性的值。

举一个开发过程中常见的例子：

[`HTMLInputElement`](https://developer.mozilla.org/zh-TW/docs/Web/API/HTMLInputElement) 的 `checked` 属性和 `input` 标签上名为 `checked` 的 `attribute` 就存在反射关系。

```html
<input type="checkbox" checked />

<script>
  const inputEl = document.getElementsByTagName('input')[0];
  console.log(inputEl.checked); // true
</script>
```

当 `input` 元素上名为 `checked` 的 `attribute` 被移除时，`inputEl.checked` 的值就变为了 `false`：

```html
<input type="checkbox" checked />

<script>
  const inputEl = document.getElementsByTagName('input')[0];
  console.log(inputEl.checked); // true
  inputEl.removeAttribute('checked');
  console.log(inputEl.checked); // false
</script>
```

## `attribute(string)` 装饰器 🔧

为了能够让开发者快速实现上述的能力，PWC 提供了 `attribute` 装饰器。

:::tip 使用指南

- 被反射的 `property` 自身被直接修改之后，与 `attribute` 的**反射关系就会消失**
- 被反射的 `property` 被修改后，不会影响到对应 `attribute` 的值
- 与 `attribute` 有反射关系的组件属性必须是**公有属性**

:::

### 简单示例

**组件代码：**

```js
import { reactive } from 'pwc';

class CustomElement extends HTMLElement {
  @attribute('attr-item-title')
  accessor itemTitle = 'default title';
}
```

**使用组件：**

```jsx
// customEl.itemTitle 返回值为 default title
// customEl.getAttribute('attr-item-title') 返回值为 null
<custom-element></custom-element>

// customEl.itemTitle 返回值为 custom title
// customEl.getAttribute('attr-item-title') 返回值为 custom title
<custom-element attr-item-title="custom title"></custom-element>
```


### 布尔类型的 `attribute`

- 布尔类型的 `attribute` 对应的 `property` 初始值必须为 `false` ，详见文档：https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute
- 布尔类型的 `attribute` 一旦被设置之后，其对应的 `property` 值均会返回 `true`
- `property` 被修改后，`property` 的值为 `Boolean(value)`

### 其它类型的 `attribute`

- `property` 获取到的值均为 `attribute` 对应的值（注意：`attribute value` 均会被序列化成字符串类型）

### 图解反射流程

`attribute` 和 `property` 的具体反射逻辑如下图所示：

<a target="_blank" href="https://img.alicdn.com/imgextra/i3/O1CN01ge2ehT21BmDWLW9JF_!!6000000006947-2-tps-2774-1622.png"><img src='https://img.alicdn.com/imgextra/i3/O1CN01ge2ehT21BmDWLW9JF_!!6000000006947-2-tps-2774-1622.png' /></a>



## 什么时候需要用到 attribute 反射？🙈

由于 PWC 提供了[响应式 `property` 的能力](../base/reactive) 所以大部分场景下，开发者都不需要使用到 `attribute` 反射。但如下场景可以考虑使用该能力：

- 在非 PWC 体系使用组件时，不得不通过 `attribute` 给组件**传递布尔或字符串类型的数据**
- 希望在 Chrome DevTools 上审查元素时可以显示对应属性的值
