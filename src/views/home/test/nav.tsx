import { NavListDto, NavConfigDto } from '@/ndsc-vue3/sidebar/lib'
const navList: NavListDto[] = [
  {
    id: 'realtime',
    name: '实时测试',
    to: '/test/realtime',
    iconType: 'custom',
    icon: (h) => {
      return <u-icon-font type="requirement" style="font-size: 16px" />
    }
  },
  {
    id: 'recordList',
    name: '测试记录',
    to: '/test/record',
    iconType: 'custom',
    icon: (h) => {
      return <u-icon-font type="requirement" style="font-size: 16px" />
    }
  },
  {
    id: 'requirement',
    name: '需求测试',
    to: '/test/requirement',
    iconType: 'custom',
    icon: (h) => {
      return <u-icon-font type="object-manage" style="font-size: 16px" />
    }
  }
]
export const navConfig: NavConfigDto = {
  project: {
    name: '埋点测试',
    to: '/test/realtime',
    icon: (h) => {
      return <u-icon-font type="tracker-manage" />
    }
  },
  menu: navList
}
