const fs = require('fs')
const path = require('path')
const t = require('@babel/types')
const { paramCase } = require('param-case')
const babelParser = require('@babel/parser')
const traverse = require('@babel/traverse')
const generator = require('@babel/generator').default

const SUFFIX_QUEUE = ['jsx', 'tsx', 'js', 'ts']
const ANTD_NODE_MODULES = path.join(process.cwd(), 'node_modules')
/* eslint-disable */
const REGX = /require\(["\w\./\\]+\)/g;

function antdViteImportPlugin() {
    return {
        name: 'antd-vite-import-plugin',
        transform(code, file) {
            if (!(/(node_modules)/).test(file) && SUFFIX_QUEUE.includes(file.split('.').slice(-1)[0])) {
                const ast = babelParser.parse(code, {
                    sourceType: "module",
                });
                if (file.includes('main.ts')) {
                    traverse.default(ast, {
                        Program(path) {
                            path.node.body.unshift(t.importDeclaration(
                                [],
                                t.stringLiteral('ant-design-vue/es/style/index.less')
                            ))
                        }
                    })
                }
                const modifyImports = [];
                traverse.default(ast, {
                    ImportDeclaration(importPath) {
                        if (importPath.node.source.value === 'ant-design-vue') {
                            importPath.node.specifiers.forEach((specifier) => {
                                const name = paramCase(specifier.imported.name);
                                const jsSource = t.stringLiteral(`${importPath.node.source.value}/es/${name}`);
                                modifyImports.push(t.importDeclaration([t.importDefaultSpecifier(specifier.local)], jsSource));
                                const cssPath = `${importPath.node.source.value}/es/${name}/style/index.less`;
                                try {
                                    fs.accessSync(path.join(ANTD_NODE_MODULES, cssPath));
                                    const cssSource = t.stringLiteral(cssPath);
                                    modifyImports.push(t.importDeclaration([], cssSource));
                                } catch (err) {
                                    const cssContent = fs.readFileSync(path.join(ANTD_NODE_MODULES, `${importPath.node.source.value}/es/${name}/style/css.js`), 'utf8');
                                    const requireMathQueue = cssContent.match(REGX);
                                    if (Array.isArray(requireMathQueue)) {
                                        requireMathQueue.forEach((item) => {
                                            if (item.split) {
                                                const p = item.split('"')[1];
                                                if (p) {
                                                    const cssSource = t.stringLiteral(`${importPath.node.source.value}/es/${p.replace(/\.\.\//g, '').replace(/\/css/, '/index.less')}`);
                                                    modifyImports.push(t.importDeclaration([], cssSource));
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                            importPath.replaceWithMultiple(modifyImports);
                        }
                    }
                });
                if (modifyImports.length > 0) {
                    return {
                        code: generator(ast).code,
                        map: this.getCombinedSourcemap && this.getCombinedSourcemap(),
                    }
                }
            }
            return {
                code,
                map: null
            };
        }
    }
}
exports.__esModule = true
module.exports = antdViteImportPlugin;
antdViteImportPlugin['default'] = antdViteImportPlugin;