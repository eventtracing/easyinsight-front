const fs = require('fs')
const path = require('path')

/**
 * 用于 vue.config.js 获取 less modifyVars 配置
 */
const getModifyVars = function () {
  const css = fs.readFileSync(path.join(__dirname, 'var.less'), 'utf-8')
  const arr = css.match(/(?<=@)[^;]+(?=;)/g)
  const modifyVars = {}
  arr.reduce((pre, cur) => {
    const vars = cur.split(':')
    pre[vars[0].trim()] = vars[1].trim()
    return pre
  }, modifyVars)

  Object.keys(modifyVars).forEach((key) => {
    const value = modifyVars[key]
    if (value.startsWith('@')) {
      const equalKey = value.slice(1)
      modifyVars[key] = modifyVars[equalKey]
    }
  })
  return modifyVars
}

module.exports = {
  getModifyVars
}
