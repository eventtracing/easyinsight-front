# `@/ndsc-vue3/utils/lib`

> 前端通用工具包

## Usage

```
import { Request, CustomAxiosRequestConfig } from '@/ndsc-vue3/utils/lib'
```

## Features

### request.ts

```ts
import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from 'axios'
declare module 'vue/types/vue' {
  interface Vue {
    axios: AxiosStatic
  }
}
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  useToken?: boolean
  handleError?: boolean
  returnCode?: boolean
  requestMark?: string
  supportCancel?: boolean
  routeChangeCancel?: boolean
}
/**
 * axios 请求封装
 */
export declare class Request {
  pendingRequest: {
    name: string
    cancel: Function
    routeChangeCancel: boolean
  }[]
  instance: AxiosInstance
  private baseURL
  private addTokenFunc
  private loginFunc
  private errorHandleFunc
  constructor(
    options: CustomAxiosRequestConfig & {
      baseURL: string
      addTokenFunc: (config: CustomAxiosRequestConfig) => void
      loginFunc: () => void
      errorHandleFunc?: (err: any) => void
    }
  )
  /**
   * 请求完成或取消时在pendingRequest队列中清除
   * @param config 请求config
   */
  private clearRequest
  /**
   * ajax 请求
   * @param options 请求配置
   */
  ajax(options: CustomAxiosRequestConfig): Promise<any>
  /**
   * get 请求
   * @param url 请求路径
   * @param options 请求配置
   */
  get(url: string, options?: CustomAxiosRequestConfig): Promise<any>
  /**
   * delete 请求
   * @param url 请求路径
   * @param options 请求配置
   */
  delete(url: string, options?: CustomAxiosRequestConfig): Promise<any>
  /**
   * post 请求
   * @param url 请求路径
   * @param data 请求携带的 body 数据
   * @param options 请求配置
   */
  post(
    url: string,
    data?: Record<string, any>,
    options?: CustomAxiosRequestConfig
  ): Promise<any>
  /**
   * put 请求
   * @param url 请求路径
   * @param data 请求携带的 body 数据
   * @param options 请求配置
   */
  put(
    url: string,
    data?: Record<string, any>,
    options?: CustomAxiosRequestConfig
  ): Promise<any>
  /**
   * 文件下载
   * @param url 下载地址
   * @param options 请求配置
   * @param fileName 下载文件名（非必填，一般为请求响应头指定）
   */
  download(
    url: string,
    options?: {
      baseURL?: string
      method?: 'get' | 'post'
      params?: Record<string, any>
      data?: Record<string, any>
    },
    fileName?: string
  ): Promise<void>
}
```

### instance.ts

通过 `js API` 和 回调函数的方式快捷创建弹窗、抽屉实例，消灭 `visible`

```ts
import Vue, { VueConstructor } from 'vue'
export declare type InstanceConfig = {
  onOk?: Function
  onCancel?: Function
  parentContext: any
  manualClose?: boolean
} & Record<string, any>
/**
 * 创建 vue 实例（modal or drawer）
 * @param vueConstructor Vue 组件构造器
 * @param config 构造配置及组件的 props
 */
export declare function createInstance(
  vueConstructor: VueConstructor<Vue>,
  config?: InstanceConfig
): {
  destroy: () => void
}
```

### TableMixin

```vue
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class TableMixin extends Vue {
  loading = true
  total = 0
  current = 1
  pageSizeOptions = ['25', '50', '100']
  pageSize = 25

  // 表分页信息
  get pagination() {
    return {
      total: this.total,
      current: this.current,
      pageSize: this.pageSize,
      pageSizeOptions: this.pageSizeOptions,
      showQuickJumper: true,
      showSizeChanger: true,
      hideOnSinglePage: this.total <= Number(this.pageSizeOptions[0]),
      showTotal: (total: number) => `共 ${total} 条记录`
    }
  }
}
</script>
```

### url.ts

```ts
/**
 * 判断 url 是否是绝对路径
 * @param url url 字符串
 */
export declare function isAbsoluteURL(url: string): boolean
/**
 * 返回基础路径或拼接后的路径
 * @param baseURL 基础路径
 * @param relativeURL 相对路径
 */
export declare function combineURLs(
  baseURL: string,
  relativeURL: string
): string
/**
 * 获取url的query参数
 * @param name 参数名
 * @param url url 字符串
 */
export declare function getQueryString(name: string, url: string): string
```

### loadJs.ts

```ts
/**
 * 动态引入 js
 * @param scriptUrl 脚本 url
 */
export declare function loadJs(scriptUrl: string): void
```

### common.ts

```ts
/**
 * 返回去除对象中的某些属性后的新对象
 * @param obj 目标对象
 * @param fields 忽略的属性数组
 */
export declare function omit<T, K extends string[]>(
  obj: T,
  fields: K
): Pick<
  T,
  {
    [P in keyof T]: P extends K ? never : P
  }[keyof T]
>
/**
 * 判断值是否为 undefined 或者 null
 * @param v 输入值
 */
export declare function isUndef(v: any): boolean
/**
 * 判断值是否为正整数
 * @param v 值
 */
export declare function isPositiveInteger(v: number): boolean
/**
 * 判断值是否为不小于 0 的整数
 * @param v 值
 */
export declare function isNoLessThanZeroInteger(v: number): boolean
/**
 * 时间戳转时间格式
 * @param time 时间戳，毫秒
 */
export declare function getTimeStringFromTimestamp(time?: number): string
```

### validator.ts

```ts
/**
 * 校验规则
 */
/**
 * 大于0的整数
 */
export declare const greaterThan0Validator: {
  message: string
  pattern: RegExp
  validator: (_rule: any, value: any, callback: Function) => any
}
/**
 * 不小于0的整数
 */
export declare const noLessThan0Validator: {
  message: string
  pattern: RegExp
  validator: (_rule: any, value: any, callback: Function) => any
}
/**
 * 以字母开头
 */
export declare const beginWithLetterValidator: {
  message: string
  pattern: RegExp
  validator: (_rule: any, value: any, callback: Function) => void
}
/**
 * 字段包含字母、数字、_
 */
export declare const letterValidator: {
  message: string
  pattern: RegExp
  validator: (_rule: any, value: any, callback: Function) => any
}
/**
 * 字段包含中英文、数字、_ 和 -
 */
export declare const nameValidator: {
  message: string
  pattern: RegExp
  validator: (_rule: any, value: any, callback: Function) => any
}
```
