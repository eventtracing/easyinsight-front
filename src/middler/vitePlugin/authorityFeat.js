// const babelParser = require('@babel/parser')
// const traverse = require('@babel/traverse').default
// const generator = require('@babel/generator').default

function authorityFeat() {
  return {
    name: 'antd-vite-authority-feat-plugin',
    transform(code) {
      return {
        code
      }
    }
  }
}
module.exports = authorityFeat
authorityFeat.default = authorityFeat
