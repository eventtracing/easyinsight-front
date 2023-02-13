# `@/ndsc-vue3/style`

> 共享 style

## Usage

```ts
import '@/ndsc-vue3/style'
```

```less
@import '~@/ndsc-vue3/style/lib/var.less';
```

`vue.config.js`

```js
const { getModifyVars } = require('@/ndsc-vue3/style/lib/var')

module.exports = {
  css: {
    loaderOptions: {
      less: {
        modifyVars: getModifyVars(),
        javascriptEnabled: true
      }
    }
  }
  //...其他配置
}
```
