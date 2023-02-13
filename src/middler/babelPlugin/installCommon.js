const { declare } = require('@babel/helper-plugin-utils')

module.exports = declare(function (api) {
  api.assertVersion('^7.0.0')
  return {
    name: 'babel-plugin-replace-import-meta',
    visitor: {
      ImportDeclaration(path) {
        const { source } = path.node
        if (source.value === './components/register-vite') {
          source.value = './components/register'
        }
      }
    }
  }
})
