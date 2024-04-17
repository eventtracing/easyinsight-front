import { createApp } from "vue";
import Preview from "./index.vue";
import Iconfont from "../../common/m-icon-font/index.vue";

function genSingleton() {
  const PreviewContructor = createApp(Preview);
  PreviewContructor.component(Iconfont.name, Iconfont);
  const el = document.createElement("div");
  document.body.appendChild(el);
  return PreviewContructor.mount(el);
}

export default {
  install(Vue) {
    function PreviewEntity(options) {
      let instance = genSingleton();
      Object.assign(instance._.props, options);
      instance.show(true);
      instance.$watch("visible", (n) => {
        if (!n) {
          document.body.removeChild(instance.$el.parentNode);
          instance = null;
        }
      });
    }

    Vue.config.globalProperties.$preview = PreviewEntity;
  },
};
