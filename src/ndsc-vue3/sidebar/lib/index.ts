// @ts-nocheck
import Sidebar from "./sidebar.vue";
export * from "./interface";

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("sidebar", Sidebar);
}

let GlobalVue = null;

if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = (global as any).Vue;
}

if (GlobalVue) {
  GlobalVue.use({ install });
}

Sidebar.install = install;

export default Sidebar;
