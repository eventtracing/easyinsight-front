const babelParser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

function antdViteImportPlugin() {
  return {
    name: 'antd-vite-modeify-icon-plugin',
    transform(code) {
      if (code.includes('@ant-design')) {
        const ast = babelParser.parse(code, {
          sourceType: 'unambiguous'
        })

        traverse(ast, {
          FunctionDeclaration(path) {
            const declarationPath = path.get('declaration').parentPath
            if (declarationPath.node.id.name === 'withSuffix') {
              const casesPath = declarationPath.get('body.body.0.cases')
              const replaceAst = casesPath[0].node.consequent
              casesPath[3].node.consequent = replaceAst
            }
          }
        })

        return {
          code: generator(ast).code,
          map: null
        }
      }
      return {
        code,
        map: null
      }
    }
  }
}
module.exports = antdViteImportPlugin
antdViteImportPlugin.default = antdViteImportPlugin
