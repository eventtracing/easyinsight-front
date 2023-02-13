declare module "@vue/runtime-core" {
  interface Vue {
    $hasData: (data: any) => boolean;
    $get: (
      obj: Record<string, unknown>,
      arr: string[] | string,
      defaultValue: any
    ) => any;
  }
}

// 扩展vue
export const vueProto = () => {};
