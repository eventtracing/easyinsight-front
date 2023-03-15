/* eslint-disable */
import { createApp } from "vue";
import App from "./App.vue";
import mixin from "./mixin";
import store from "./store"; // 全局注册组件
import register from "./components/register"; // 引入全局样式

import loginService from "@/services/login.service";
import { getAuthorMenu } from "@/services/app.service";
import { getQueryString, loadJs } from "@/ndsc-vue3/utils/lib";
import { message } from "ant-design-vue";
import { get } from "lodash";

import "./ndsc-vue3/style/lib/index";
import "./ndsc-vue3/style/lib/ant-design/form.less";
import "./ndsc-vue3/style/lib/ant-design/table.less";
import "./style/index.less";
import "./style/animation.less";

// 引入字体
import "./assets/iconfont.js";

let app;

// vue模板支持可选链 https://github.com/vuejs/vue/issues/8861
loadJs("//at.alicdn.com/t/font_2900968_6k08wc5si1p.js");

(async () => {
  /**
   * 1. 登录
   * 2. 获取配置，设置埋点
   * 3. new Vue
   */
  try {
    const isLogin = await loginService.checkLoginIn();

    if (!isLogin) {
      loginService.login();
      return;
    }

    // 第一次进入页面获取产品列表以及确认当前所在产品
    const id = getQueryString("appId", window.location.href);

    await store.dispatch("getAppList", { appId: id });

    const { email } = store.state.user;

    await store.dispatch("getObjectType");

    getAuthorMenu(email).then(async (menuLists) => {
      store.commit("setMenuLists", menuLists);

      const { default: router } = await import("./router");

      function getFlatArray(menu) {
        return menu.reduce((prev, next) => {
          prev.push(next);
          prev.push(...getFlatArray(next.children || []));
          return prev;
        }, []);
      }

      const featureAuth = getFlatArray(menuLists).filter(
        (v) => v.menuType === 1
      );

      app = createApp(App).use(router).use(store);
      register(app);

      app.directive("auth", {
        mounted(el, binding, vnode) {
          const { value } = binding;

          if (featureAuth.every((feat) => feat.code !== value)) {
            const { el: elm } = vnode;
            elm.classList.add("m-text--disabled");
            (vnode.props || (vnode.props = {})).disabled = true;
          }
        },
      });
      app.mixin({
        methods: {
          checkAuth(value: number[]) {
            value = Array.isArray(value) ? value : [value]; // 校验是否是通过该权限
            return featureAuth.every((feat) => !value.includes(feat.code));
          },
        },
      });

      app.config.globalProperties.$get = get;
      app.mixin(mixin);

      router.isReady().then(() => {
        app.mount("#app");
      });
    });
  } catch (err) {
    message.error(err?.message || err);
  }
})();
