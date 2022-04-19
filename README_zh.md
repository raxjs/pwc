## PWC

渐进式 Web Components 解决方案。

> ⚠️ 仍在开发中，请勿使用。

### 什么是 PWC ？

#### 基础示例

```html
<template>
  <div class="content">Hello world</div>
</template>

<style>
  .content {
  	color: #fff;
  }
</style>

<script>
  export default class extends HTMLElement {}
</script>
```

#### 数据绑定

```html
<template>
  <div class="content">Hello, {{#name}}</div>
</template>

<style>
  .content {
  	color: #fff;
  }
</style>

<script>
  export default class extends HTMLElement {
    #name = 'PWC'
  }
</script>
```
