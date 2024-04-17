export function getData(wrapper: any, type = 1): any {
  const vm: any = wrapper.vm

  return type === 1 ? vm._.setupState : vm
}
