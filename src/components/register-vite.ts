import AntDesign from "./ant-design/index";
import BasicComponents from "@/ndsc-vue3/basic-components/lib";
import "@/ndsc-vue3/basic-components/lib/style/index.less";
import Preview from "@/components/baseInstall/m-image-preivew/index.js";
import { Form } from "ant-design-vue";
import JsonViewer from "vue3-json-viewer";
// @ts-ignore
const commonContext = import.meta.globEager("./common/*.vue");
// @ts-ignore
const drawer = import.meta.globEager("./common/m-drawer-footer/*.vue");
// @ts-ignore
const select = import.meta.globEager("./common/m-filter-select/*.vue");
// @ts-ignore
const font = import.meta.globEager("./common/m-icon-font/*.vue");
// @ts-ignore
const table = import.meta.globEager("./common/m-rowselect-table/*.vue");
// @ts-ignore
const layoutContext = import.meta.globEager("./layout/*.vue");
// @ts-ignore
const specificContext = import.meta.globEager("./specific/*.vue");
export default function (Vue) {
  Vue.use(AntDesign);
  Vue.use(Form);
  Vue.use(Preview);
  // 全局注册封装的基础组件和指令
  Vue.use(BasicComponents);
  Vue.use(JsonViewer);

  try {
    // UI组件
    for (const path in commonContext) {
      const { default: component } = commonContext[path];
      Vue.component(component.name, component);
    }

    for (const path in drawer) {
      const { default: component } = drawer[path];
      Vue.component(component.name, component);
    }

    for (const path in select) {
      const { default: component } = select[path];
      Vue.component(component.name, component);
    }

    for (const path in font) {
      const { default: component } = font[path];
      Vue.component(component.name, component);
    }

    for (const path in table) {
      const { default: component } = table[path];
      Vue.component(component.name, component);
    }

    // // 布局组件
    for (const path in layoutContext) {
      const { default: component } = layoutContext[path];
      Vue.component(component.name, component);
    }

    // // 业务组件
    for (const path in specificContext) {
      const { default: component } = specificContext[path];
      Vue.component(component.name, component);
    }
  } catch (err) {
    // catch err
  }
}
