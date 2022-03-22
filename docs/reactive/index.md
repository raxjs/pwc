# 响应式更新

## 声明响应式属性

```js
import { reactive } from 'pwc';

class CustomElement extends HTMLElement {
  @reactive
  accessor name = 'Jack';

  get template() {
    return <div>
  }
}
```

## 用法

## 原理

## Proxy 和 Object.defineProperty
