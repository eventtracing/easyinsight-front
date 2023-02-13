import AntDesign from './ant-design/index'
import BasicComponents from '@/ndsc-vue3/basic-components/lib'
import '@/ndsc-vue3/basic-components/lib/style/index.less'
import Preview from '@/components/baseInstall/m-image-preivew/index.js'
import Icons from './ant-design/icons'
import JsonViewer from 'vue3-json-viewer'

export default function Register(Vue) {
  Vue.use(AntDesign)
  Vue.use(Preview)
  Vue.use(BasicComponents)
  Vue.use(Icons)
  Vue.use(JsonViewer)
  /**
   * 使用 require.context 批量注册组件注意点
    1. 组件需指定 name 属性， 如：
     <script lang="ts">
        @Component({
          name: 'u-layout' // component.options.name = 'u-layout'
        })
        export default class ULayout extends Vue {}
      </script>
    2. 注册时使用 component.options.name，component.name 默认是class名称，打包后会被压缩，名称会变化
   */
  // UI组件

  const commonContext = require.context('./common', true, /\.vue$/)

  commonContext.keys().forEach((key) => {
    const component = commonContext(key).default
    Vue.component(component.name, component)
  }) // 布局组件

  const layoutContext = require.context('./layout', false, /\.vue$/)

  layoutContext.keys().forEach((key) => {
    const component = layoutContext(key).default
    Vue.component(component.name, component)
  }) // 业务组件

  const specificContext = require.context('./specific', false, /\.vue$/)

  specificContext.keys().forEach((key) => {
    const component = specificContext(key).default
    Vue.component(component.name, component)
  })
}
