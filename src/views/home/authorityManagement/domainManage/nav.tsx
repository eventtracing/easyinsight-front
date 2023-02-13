import { NavListDto, NavConfigDto } from '@/ndsc-vue3/sidebar/lib'
const navList: NavListDto[] = [
  {
    id: 'domain',
    name: '域信息',
    to: '/authorityManage/domain/detail',
    iconType: 'custom',
    icon: (h) => {
      return <u-icon-font type="requirement" style="font-size: 16px" />
    }
  },
  {
    id: 'member',
    name: '成员管理',
    to: '/authorityManage/domain/member',
    iconType: 'custom',
    icon: (h) => {
      return <u-icon-font type="object-manage" style="font-size: 16px" />
    }
  },
  {
    id: 'product',
    name: '产品配置',
    to: '/authorityManage/domain/product',
    iconType: 'custom',
    icon: (h) => {
      return <u-icon-font type="requirement" style="font-size: 16px" />
    }
  }
]
export default defineComponent({})
