const { copyFile } = require('../../../scripts/lerna/util.js')
const path = require('path')
const rootPath = path.resolve(__dirname, '../../../')
const publicPath = path.resolve(rootPath, './docs/.vuepress/public')
const fs = require('fs')

const files = fs.readdirSync(path.resolve(__dirname, '../dist'))
files.forEach((e) => {
  if (e.indexOf('.css') > -1) {
    copyFile(path.resolve(__dirname, '../dist/' + e), path.resolve(publicPath, e))
  }
})
