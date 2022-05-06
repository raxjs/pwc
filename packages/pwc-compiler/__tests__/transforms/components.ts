export const basicComponent = `
<template>
  <p>{{this.#name}}</p>
</template>
<script>
export default class CustomElement extends HTMLElement {
  #name = '';
}
</script>
`;

export const useCustomElementComponent = `
<template>
  <p>hello</p>
</template>
<script>
import { customElement } from 'pwc';

@customElement('custom-element')
export default class CustomElement extends HTMLElement {}
</script>
`;

export const useReactiveComponent = `
<template>
  <p>hello</p>
</template>
<script>
import { reactive } from 'pwc';

export default class CustomElement extends HTMLElement {
  @reactive
  accessor name = '';
}
</script>
`;

export const useReactiveWithAutoAddReactiveComponent = `
<template>
  <p>{{this.#name}}</p>
</template>
<script>
import { reactive } from 'pwc';
export default class CustomElement extends HTMLElement {
  #name = '';
  @reactive
  accessor data = '';
}
</script>
`;

export const reactiveHasBeenReactiveDecoratedManuallyComponent = `
<template>
  <p>{{this.#name}}</p>
</template>
<script>
import { reactive } from 'pwc';
export default class CustomElement extends HTMLElement {
  @reactive
  accessor #name = '';
}
</script>
`;

