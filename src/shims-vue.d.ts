/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;

  export default component;
};

declare module 'vue3-json-view' {
  import JsonView from 'vue3-json-view'

  export default JsonView;
};

declare module 'hooks/*' {
  export default (...args) => any;
};