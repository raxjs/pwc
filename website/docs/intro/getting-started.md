---
sidebar_position: 2
---

# 快速开始

通过本篇文档，你将了解到如何创建一个 PWC 组件工程，以及使用 PWC 组件的多种方式。

## PWC 组件工程

### 创建

可以通过以下指令快速创建 PWC 组件工程。

```bash
$ npm init pwc pwc-demo
```

目录结构如下：

```bash
.
├── build.config.ts
├── tsconfig.json
├── package.json
├── src
│   ├── index.pwc
```

### 安装与启动

```bash
$ npm install && npm start
```

### 开发与预览

> TODO: 待补充 playground

```html title="./src/index.pwc"
<template>
  <div> Hello, {{#name}} !</div>
</template>

<script>
  export default class extends HTMLElement {
    #name = 'PWC'
  }
</script>

<style>
</style>
```

## PWC Playground
> TODO: 待补充


## CDN 引入使用

PWC 虽然提供官方的组件工程供开发者使用，但是同样提供了 cdn 版本，让开发者可以在自己在 HTML 文件中引入使用。当然，这样做 PWC 的核心包就无法享受到[ Tree shaking ](https://en.wikipedia.org/wiki/Tree_shaking)的能力。

|                                          | cdn 链接                                                     | 包体积 （gzip 后）                 |
| ---------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| PWC 核心包 es5 版本                      | https://cdnjs.cloudflare.com/ajax/libs/pwc/1.0.0/pwc.min.js  |  |
| PWC 核心包 es2017 版本                   | https://cdnjs.cloudflare.com/ajax/libs/pwc/1.0.0/pwc.es2017.min.js |  |
| PWC 包含运行时解析模板能力的 es5 版本    | https://cdnjs.cloudflare.com/ajax/libs/pwc/1.0.0/pwc-all.min.js |  |
| PWC 包含运行时解析模板能力的 es2017 版本 | https://cdnjs.cloudflare.com/ajax/libs/pwc/1.0.0/pwc-all.es2017.min.js |  |


PWC 包含运行时解析模板能力的版本相较于核心包多出的能力是可以在运行时解析 `template` 属性传入的 `HTML` 模板字符串，即使用该版本之后开发者可以直接在浏览器中开发 PWC 组件而不需要 `.pwc` 构建流程。


