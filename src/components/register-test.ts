import { config } from '@vue/test-utils'
import AntDesign from './ant-design/index'
import BasicComponents from '@/ndsc-vue3/basic-components/lib'
import '@/ndsc-vue3/basic-components/lib/style/index.less'
import Preview from '@/components/baseInstall/m-image-preivew/index.js'
import Icons from './ant-design/icons'
import JsonViewer from 'vue3-json-viewer'
import Register from './common'
import Layout from './layout'
import Specific from './specific'
import { RouterLink } from 'vue-router'
import { Menu, Form, Select, Radio } from 'ant-design-vue'

const RadioGroup = Radio.Group
const MenuItem = Menu.Item
const FormItem = Form.Item
const SelectOptions = Select.Option
const Install = {
  use(component) {
    this.component(component.name, component)
  },
  component(name, component) {
    config.global.components[name] = component
  },
  directive(name, directive) {
    config.global.directives[name] = directive
  },
  config: {
    globalProperties: {}
  }
}

AntDesign(Install)
Preview.install(Install)
BasicComponents.install(Install)
Icons.install(Install)
JsonViewer.install(Install)
Register.install(Install)
Layout.install(Install)
Specific.install(Install)
Install.use(RouterLink)
Install.use(MenuItem)
Install.use(FormItem)
Install.use(RadioGroup)
Install.directive('auth', {
  mounted() {
    return true
  }
})

// @ts-ignore
window.matchMedia = function () {
  return {
    addListener() {
      return undefined
    },
    removeListener() {
      return undefined
    }
  }
}
config.global.mocks.$get = function () {
  return 'get'
}
config.global.components[SelectOptions.displayName] = SelectOptions
