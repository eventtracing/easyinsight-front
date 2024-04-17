import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import qs from "qs";
import { omit, isUndef } from "./common";
import { message } from "ant-design-vue";

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  useToken?: boolean; // 是否携带product和clusterId参数，默认为true
  handleError?: boolean; // 是否统一拦截处理错误信息，默认为true，默认会message弹窗提示错误，同时会reject出err，因此每个请求需要主动catch捕捉下
  returnCode?: boolean; // 是否需要错误码，默认为false(默认resolve(result)),用于自定义处理特殊code
  requestMark?: string; // 请求标识, 用于取消请求
  supportCancel?: boolean; // 是否取消上一次重复或类似请求（请求标识相同），默认false
  routeChangeCancel?: boolean; // 路由切换时是否取消pending的请求，默认false
}

// axios实例默认配置
const DEFAULT_CONFIG = {
  baseURL: "/",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
};

// 请求默认config
const DEFAULT_OPTIONS = {
  method: "get",
  useToken: true,
  handleError: true,
  returnCode: false,
  supportCancel: false,
  routeChangeCancel: false,
};

const cutomKeys = [
  "useToken",
  "handleError",
  "returnCode",
  "requestMark",
  "supportCancel",
  "routeChangeCancel",
  "addTokenFunc",
  "errorHandleFunc",
];

/**
 * 文件下载（接收二进制流），仅限 get 请求
 * @param url 下载地址（后端指定文件名）或 blob 地址（fileName 指定文件名）
 * @param _blank 是否新开窗口下载
 * @param fileName 文件名
 */
function downloadHelper(url: string, fileName: string, _blank = false) {
  if (_blank) {
    window.open(url);
  } else {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName || "download.txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    });
  }
}

/**
 * axios 请求封装
 */
export class Request {
  public pendingRequest: {
    name: string; // 请求标识
    cancel: (...arg: any[]) => any; // 请求取消函数
    routeChangeCancel: boolean; // 路由切换时是否取消请求
  }[] = [];

  public instance: AxiosInstance = null;
  private baseURL = "/";
  private addTokenFunc: (config: CustomAxiosRequestConfig) => void = null;
  private loginFunc: () => void = null;
  private errorHandleFunc: (err: any) => void = null;

  constructor(
    options: CustomAxiosRequestConfig & {
      baseURL: string;
      addTokenFunc: (config: CustomAxiosRequestConfig) => void;
      loginFunc: () => void;
      errorHandleFunc?: (err: any) => void;
    }
  ) {
    this.baseURL = options.baseURL || "/";
    this.addTokenFunc = options.addTokenFunc;
    this.loginFunc = options.loginFunc;
    this.errorHandleFunc =
      options.errorHandleFunc || ((err) => message.error(err.message));
    const instanceConfig = omit(options, cutomKeys);
    this.instance = axios.create(
      Object.assign({}, DEFAULT_CONFIG, instanceConfig)
    );

    /**
     * 请求响应拦截
     */
    this.instance.interceptors.response.use(
      async (response: AxiosResponse): Promise<AxiosResponse<any>> => {
        this.clearRequest(response.config as CustomAxiosRequestConfig);
        if (response.status === 200 && response.data) {
          const { code } = response.data;

          if (code === -3) {
            return Promise.reject(new Error("权限不足"));
          } else if (code === -4) {
            // 跳转登录页面
            this.loginFunc();
            return new Promise(() => {});
          }
        } else {
          return Promise.reject(new Error("网络错误"));
        }

        return response;
      },
      (error) => {
        if (error?.response) {
          this.clearRequest(
            error?.response?.config as CustomAxiosRequestConfig
          );
        }

        // 主动取消请求不抛错
        if (axios.isCancel(error)) return new Promise(() => {});

        return Promise.reject(error);
      }
    );
  }

  /**
   * 请求完成或取消时在pendingRequest队列中清除
   * @param config 请求config
   */
  private clearRequest(config: CustomAxiosRequestConfig) {
    const markIndex = this.pendingRequest.findIndex(
      (r) => r.name === config.requestMark
    );
    markIndex > -1 && this.pendingRequest.splice(markIndex, 1);
  }

  /**
   * ajax 请求
   * @param options 请求配置
   */
  public ajax(options: CustomAxiosRequestConfig) {
    if (!options.paramsSerializer) {
      options.paramsSerializer = (params: any) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      };
    }
    const requestConfig = Object.assign({}, DEFAULT_OPTIONS, options);
    // todo: 请求标识，请求方法和不带参数的url相同的请求看做相同请求，根据业务自行调整
    const requestMark = `${requestConfig.method}-${
      requestConfig.url.split("?")[0]
    }`;
    requestConfig.requestMark = requestMark;
    // 是否取消上次重复或类似的请求
    if (requestConfig.supportCancel) {
      const markIndex = this.pendingRequest.findIndex(
        (r) => r.name === requestMark
      );
      if (markIndex > -1) {
        this.pendingRequest[markIndex].cancel(); // 取消上个重复请求
        this.pendingRequest.splice(markIndex, 1); // 删除请求标识
      }
    }
    // 将当前请求加入pendingRequest队列中
    const source = axios.CancelToken.source();
    requestConfig.cancelToken = source.token;
    this.pendingRequest.push({
      name: requestMark,
      cancel: source.cancel,
      routeChangeCancel: requestConfig.routeChangeCancel,
    });

    // 添加全局参数
    if (requestConfig.useToken) {
      this.addTokenFunc(requestConfig);
    }

    return this.instance(requestConfig)
      .then((res) => {
        const { code, msg } = res.data;
        // 返回code
        if (requestConfig.returnCode) {
          return res.data;
        }
        // 默认只返回result
        if (code === 0 || code === 200) {
          // code === 200兼容bdms相关接口
          return res.data.result;
        }
        return Promise.reject(new Error(msg || "服务器异常"));
      })
      .catch((err) => {
        // 全局错误处理
        if (requestConfig.handleError) {
          this.errorHandleFunc(err);
        }
        return Promise.reject(err); // 业务自定义处理错误
      });
  }

  /**
   * get 请求
   * @param url 请求路径
   * @param options 请求配置
   */
  public get(url: string, options: CustomAxiosRequestConfig = {}) {
    options = Object.assign({}, options, {
      url,
      method: "get",
    });
    return this.ajax(options);
  }

  /**
   * delete 请求
   * @param url 请求路径
   * @param options 请求配置
   */
  public delete(url: string, options: CustomAxiosRequestConfig = {}) {
    options = Object.assign({}, options, {
      url,
      method: "delete",
    });
    return this.ajax(options);
  }

  /**
   * post 请求
   * @param url 请求路径
   * @param data 请求携带的 body 数据
   * @param options 请求配置
   */
  public post(
    url: string,
    data: Record<string, any> = {},
    options: CustomAxiosRequestConfig = {}
  ) {
    options = Object.assign({}, options, {
      url,
      method: "post",
      data,
    });
    return this.ajax(options);
  }

  /**
   * put 请求
   * @param url 请求路径
   * @param data 请求携带的 body 数据
   * @param options 请求配置
   */
  public put(
    url: string,
    data: Record<string, any> = {},
    options: CustomAxiosRequestConfig = {}
  ) {
    options = Object.assign({}, options, {
      url,
      method: "put",
      data,
    });
    return this.ajax(options);
  }

  /**
   * 文件下载
   * @param url 下载地址
   * @param options 请求配置
   * @param fileName 下载文件名（非必填，一般为请求响应头指定）
   */
  public download(
    url: string,
    options?: {
      baseURL?: string;
      method?: "get" | "post";
      params?: Record<string, any>;
      data?: Record<string, any>;
    },
    fileName?: string
  ) {
    options = Object.assign({ method: "get" }, options || {});
    let { baseURL, method, params } = options;
    baseURL = isUndef(options.baseURL) ? this.baseURL : options.baseURL;
    if (method === "get") {
      const config = { url: url };
      this.addTokenFunc(config);
      url = config.url;
      url = baseURL + url;
      if (params) {
        const searchList = [];
        searchList.push(qs.stringify(params, { arrayFormat: "repeat" }));
        if (searchList.length) {
          url += (url.indexOf("?") === -1 ? "?" : "&") + searchList.join("&");
        }
      }
      downloadHelper(url, fileName);
    } else {
      const hide = message.loading("正在导出文件...", 0);
      const config: AxiosRequestConfig = {
        baseURL: baseURL,
        url,
        responseType: "blob",
        method: "POST",
        withCredentials: true,
        ...options,
      };
      this.addTokenFunc(config);
      return axios(config)
        .then((res: any) => {
          const blob = new Blob([res.data]);
          const blobURl = window.URL.createObjectURL(blob);
          setTimeout(hide);
          return downloadHelper(blobURl, fileName);
        })
        .catch(() => {
          setTimeout(hide);
        });
    }
  }
}
