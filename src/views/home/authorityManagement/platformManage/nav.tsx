import { NavListDto, NavConfigDto } from '@/ndsc-vue3/sidebar/lib'
const navList: NavListDto[] = [
  {
    id: 'domain',
    name: '域配置',
    to: '/authorityManage/platform/domain',
    iconType: 'custom',
    icon: (h) => {
      return <u-icon-font type="requirement" style="font-size: 16px" />
    }
  }
]
export default defineComponent({})
