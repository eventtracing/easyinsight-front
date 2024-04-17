import { createVNode, render as VueRender } from "vue";
import { omit } from "./common";
import { ConfigProvider } from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";

export type InstanceConfig = {
  onOk?: (...arg: any[]) => any;
  onCancel?: (...arg: any[]) => any;
  parentContext: any;
  manualClose?: boolean; // 是否手动关闭，默认为 false
};

/**
 * 创建 vue 实例（modal or drawer）
 * @param vueConstructor Vue 组件构造器
 * @param config 构造配置及组件的 props
 */
export function createInstance(
  vueConstructor: any,
  config?: InstanceConfig & Record<string, any>,
  store?: any
) {
  const el = document.createElement("div");
  el.className = "m-portal";
  document.body.appendChild(el);
  let instance: any = null;

  const render = () => {
    const currentConfig = {
      onOk: config?.onOk || (() => {}),
      onCancel: config?.onCancel || (() => {}),
      parentContext: config?.parentContext || null,
      manualClose: config?.manualClose || false,
      onHandlerOk: config?.onHandlerOk || (() => {}),
    };

    function onOk(...arg: any[]) {
      currentConfig.onHandlerOk(...arg);
      currentConfig.onOk(...arg);
    }

    const props = omit(config, [
      "onOk",
      "onCancel",
      "parentContext",
      "manualClose",
    ]);
    const vnode = createVNode({
      parent: currentConfig.parentContext,
      components: {
        ConfigProvider,
      },
      render() {
        return createVNode(
          ConfigProvider,
          {
            locale: zhCN,
            autoInsertSpaceInButton: false,
          },
          {
            default: () => {
              return createVNode(vueConstructor, {
                ...props,
                getContainer: el,
                onHandlerClose: this.handleCancel,
                onHandlerOk: this.handleOk,
                ...(config.onOk && { onOk: this.handleOk }),
              });
            },
          }
        );
      },
      methods: {
        destroy() {
          // @ts-ignore
          instance = null;
          el.parentNode && el.parentNode.removeChild(el);
        },
        handleCancel(...args: any[]) {
          currentConfig.onCancel(...args);
          // @ts-ignore
          this.destroy();
        },
        handleOk(...args: any[]) {
          return Promise.resolve(onOk(...args)).then(() => {
            // @ts-ignore
            !currentConfig.manualClose && this.destroy();
          });
        },
      },
    });

    vnode.appContext = currentConfig.parentContext._.appContext;
    return vnode;
  };

  VueRender((instance = render()), el);
  return {
    destroy: () => {},
  };
}
