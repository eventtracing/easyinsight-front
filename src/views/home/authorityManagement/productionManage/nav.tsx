import { NavListDto, NavConfigDto } from '@/ndsc-vue3/sidebar/lib'
const navList: NavListDto[] = [
  {
    id: 'info',
    name: '产品信息',
    to: '/authorityManage/production/info',
    iconType: 'custom',
    icon: (h) => {
      return <u-icon-font type="requirement" style="font-size: 16px" />
    }
  },
  {
    id: 'member',
    name: '成员管理',
    to: '/authorityManage/production/member',
    iconType: 'custom',
    icon: (h) => {
      return <u-icon-font type="object-manage" style="font-size: 16px" />
    }
  },
  {
    id: 'manage',
    name: '角色管理',
    to: '/authorityManage/production/manage',
    iconType: 'custom',
    icon: (h) => {
      return <u-icon-font type="requirement" style="font-size: 16px" />
    }
  }
]
export default defineComponent({})
