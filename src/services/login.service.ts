import request from "@/utils/request";
import { User, AppDto } from "@/types/app.type";
import store from "../store/index";

interface LoginStatus {
  logon: boolean; // 是否登录
  localToken: string;
  user: User;
  domainId: number;
  app: AppDto;
}

class LoginService {
  // 检测登录接口，登录成功后返回用户信息
  checkLoginIn() {
    return request
      .get("/check/login", {
        useToken: false,
      })
      .then((res: LoginStatus) => {
        const { logon, localToken, user, domainId, app } = res || {};
        if (logon) {
          localToken && store.commit("setLocalToken", localToken);
          user && store.commit("setUser", user);
          domainId && store.commit("setDomainId", domainId);
          app && store.commit("setApp", app);
        }
        return logon;
      });
  }

  login() {
    location.href = "/api/login";
  }

  logOut() {
    location.href = "/api/logout";
  }
}

const loginService = new LoginService();

export default loginService;
