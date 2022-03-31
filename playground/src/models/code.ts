const initPWCCode =
`export default class CustomComponent extends HTMLElement {
  @reactive
  accessor title = 'pwc';

  get template() {
    return compile(\`<h1 style="color: red;">{{ \${this.title} }}</h1>\`)
  }
}
`;

const initReactCode =
`import React from "react";

export default function FileTest () {
  return (<h1 style={{ background: "red", color: "#fff" }}>This is a test</h1>);
}`;

export default {
  // 定义 model 的初始 state
  state: {
    value: initPWCCode,
    componentIndex: 0,
  },

  // 定义改变该模型状态的纯函数
  reducers: {
    update(prevState, payload) {
      return {
        ...prevState,
        ...payload,
      };
    },
  },

  // 定义处理该模型副作用的函数
  effects: (dispatch) => ({
    setActiveCode(value, rootState) {
      dispatch.code.update({
        value,
        componentIndex: rootState.code.componentIndex + 1,
      });
    },
  }),
};
