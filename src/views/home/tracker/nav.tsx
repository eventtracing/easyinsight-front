import { NavConfigDto } from '@/ndsc-vue3/sidebar/lib'

export const navConfig: Omit<NavConfigDto, 'menu'> = {
  project: {
    name: '埋点管理',
    icon: () => <u-icon-font type="tracker-manage" />
  }
}
