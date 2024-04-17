import { Request, CustomAxiosRequestConfig } from "@/ndsc-vue3/utils/lib";
import loginService from "@/services/login.service";
import store from "@/store/index";

const instance = new Request({
  baseURL: "/api/",
  addTokenFunc: (config: CustomAxiosRequestConfig) => {
    // 将 domainId 和 appId 添加到请求的 url 上
    const domainId = store.state.domainId;
    const app = store.state.app;
    const searchList = [];

    domainId && searchList.push("domainId=" + domainId);
    app?.id && searchList.push("appId=" + app.id);

    if (searchList.length) {
      config.url +=
        (config.url.indexOf("?") === -1 ? "?" : "&") + searchList.join("&");
    }
  },
  loginFunc: () => loginService.login(), // code === -4 时跳转登录操作
});

export default instance;
