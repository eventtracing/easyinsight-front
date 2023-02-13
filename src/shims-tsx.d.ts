import { VNode } from 'vue'

declare module '*.svg' {
  const content: any
  export default content
}

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }

  interface Window {
    DATracker: any
    Quill: any
    mozRequestAnimationFrame: any
    oRequestAnimationFrame: any
    msRequestAnimationFrame: any
  }

  interface Promise {
    allSettled: any
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // 统一错误处理
    $handleError(e: Error, type?: string): void
    // 弹窗、抽屉统一解决方案
    $createInstance(
      vueConstructor: any,
      props: Omit<InstanceConfig, 'parentContext'> & Record<string, any>
    ): { destroy: () => void }
    $confirm(options: any): unknown
    $message: {
      success(str: string): unknown
      error(str: string): unknown
    }
    $warning(options: any): unknown
    $getPopupContainer(node: HTMLElement): HTMLElement
    $navToNewTab(to: _RouteLocationBase): void
    $filterOption(input: any, option: any): void
    getQueryParams: any
    setQueryParams: any
    checkAuth(code: number | number[]): boolean
    menuLists: any
    $preview(options: unknown): unknown
    $get(object: Record<string, any>, path: string, defaultValue: any): any
  }
}
