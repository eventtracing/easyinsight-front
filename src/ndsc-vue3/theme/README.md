## 生成多套主题 css

1. `lib/`下开发主题，新增主题文件，一般包括：

- `index.js`入口文件
- `index.less`引入 antd 样式包、自定义变量`var.less`、`common.less`公共样式包
- `common.less`定义 css 变量提供复用
- `var.less`自定义样式变量

2. `webpack.config.js`中`entry`增加主题类型入口。

3. `yarn build`生成多套 css，并拷贝到 docs 目录下，供文档站点使用

4. 设置版本

5. `nenpm publish`发布

## 引入

1. 安装
   `yarn add @/ndsc-vue3/theme`

2. `vue.config.js`中配置

```js
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  ...,
  configureWebpack: config => {}
}
```
