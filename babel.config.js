const installCommon = require('./src/middler/babelPlugin/installCommon.js')

const isPro = process.env.DEPLOY_ENV === 'production' || process.env.DEPLOY_ENV === 'webpack'
const config = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        useBuiltIns: 'usage' // 按需引入polyfill
      }
    ]
  ],
  plugins: [
    '@babel/plugin-syntax-jsx',
    // babel-plugin-import 按需加载ant-design-vue
    [
      'import',
      {
        libraryName: 'ant-design-vue',
        libraryDirectory: 'es',
        style: true // 加载less文件，再通过vue.config.js配置less-loader来定制主题
      }
    ],
    '@babel/plugin-proposal-optional-chaining' // ts可选链语法支持
  ]
}

if (isPro) {
  config.plugins.push(installCommon)
}

module.exports = config
