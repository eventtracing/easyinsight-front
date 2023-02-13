const { copyFile } = require('../../../scripts/lerna/util.js')
const path = require('path')

copyFile(
  path.resolve(__dirname, '../lib/utils/ThemeMixin.vue'),
  path.resolve(__dirname, '../dist/ThemeMixin.vue')
)
