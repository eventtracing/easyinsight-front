import { createStore, MutationTree, ActionTree } from 'vuex'
import { User, AppDto, BizConfigDto } from '../types/app.type'
import { getAppList } from '../services/app.service'
import { getQrcodeId } from '../services/requirement.service'
import LiveTestModule from './modules/live-test'

export interface GlobalState {
  localToken: string
  user: User // 当前用户
  domainId: number // 域 id
  app: AppDto // 当前所在产品
  appList: AppDto[] // 用户可选的产品列表
  bizConfig: BizConfigDto // 基础配置信息
  qrcodeId: number // 实时测试保持唯一的连接id
  priorityList: string[]
  navMap: any // 匹配menu
  pageLoading: boolean // 页面遮罩层
  menuLists: any[] // 权限菜单管理
  paramsTabFilter
  wsConnectPath: string // 实时测试ws连接状态
  objectType: { key: string; value: string }[] // 对象类型
}
const state: GlobalState = {
  localToken: null,
  pageLoading: false,
  user: null,
  domainId: null,
  app: null,
  appList: null,
  bizConfig: null,
  qrcodeId: ~~(Math.random() * 100000),
  paramsTabFilter: {},
  menuLists: [],
  navMap: new Map([
    [
      1,
      {
        to: '/tracker/requirement',
        // @ts-ignore
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-8">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-tracker-manage" />
              </svg>
            </i>
          )
        },
        children: [50, 51, 52, 63, 64]
      }
    ],
    [
      2,
      {
        to: '/test/realtime',
        // @ts-ignore
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-8">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-requirement" />
              </svg>
            </i>
          )
        },
        children: [53, 88, 89, 200]
      }
    ],
    [
      // 域管理 -- level 1
      3,
      {
        to: '/authorityManage/domain',
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-yuguanli" />
              </svg>
            </i>
          )
        },
        children: [55, 56, 57]
      }
    ],
    [
      // 产品管理 -- level 1
      4,
      {
        to: '/authorityManage/production',
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-chanpinguanli" />
              </svg>
            </i>
          )
        },
        children: [58, 59, 60, 62]
      }
    ],
    [
      // 平台管理 -- level 1
      5,
      {
        to: '/authorityManage/platform',
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-pingtaiguanli" />
              </svg>
            </i>
          )
        },
        children: [61]
      }
    ],
    [
      50,
      {
        // 需求管理 -- level 2
        to: '/tracker/requirement',
        iconType: 'custom',
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-requirement" />
              </svg>
            </i>
          )
        },
        children: [100, 101, 106]
      }
    ],
    [
      // 对象管理 -- level 2
      51,
      {
        to: '/tracker/object',
        iconType: 'custom',
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-object-manage" />
              </svg>
            </i>
          )
        }
      }
    ],
    [
      // 事件管理 -- level 2
      64,
      {
        to: '/tracker/event/manage',
        iconType: 'custom',
        icon: (h) => {
          return (
            <i style="font-size: 18px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-shijian1" />
              </svg>
            </i>
          )
        }
      }
    ],
    [
      // 元数据管理 -- level 2
      52,
      {
        to: '/tracker/metadata',
        iconType: 'custom',
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-metadata-manage" />
              </svg>
            </i>
          )
        },
        children: [102, 103, 104, 105, 107]
      }
    ],
    [
      // 埋点测试 -- 实时测试 level 2
      53,
      {
        to: '/test/realtime',
        iconType: 'custom',
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-requirement" />
              </svg>
            </i>
          )
        }
      }
    ],
    [
      // 埋点测试 -- 测试记录 level 2
      88,
      {
        to: '/test/record',
        iconType: 'custom',
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-requirement" />
              </svg>
            </i>
          )
        }
      }
    ],
    [
      // 域管理 -- 域信息 -- level 2
      55,
      {
        to: '/authorityManage/domain/detail',
        iconType: 'custom',
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-yuxinxi" />
              </svg>
            </i>
          )
        }
      }
    ],
    [
      // 域管理 -- 成员管理 -- level 2
      56,
      {
        to: '/authorityManage/domain/member',
        iconType: 'custom',
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-chengyuanguanli" />
              </svg>
            </i>
          )
        }
      }
    ],
    [
      // 域管理 -- 产品配置 -- level 2
      57,
      {
        to: '/authorityManage/domain/product',
        iconType: 'custom',
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-chanpinpeizhi" />
              </svg>
            </i>
          )
        }
      }
    ],
    [
      // 产品管理 -- 产品信息 -- level 2
      58,
      {
        to: '/authorityManage/production/info',
        iconType: 'custom',
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-chanpinxinxi" />
              </svg>
            </i>
          )
        }
      }
    ],
    [
      // 产品管理 -- 成员管理 -- level 2
      59,
      {
        to: '/authorityManage/production/member',
        iconType: 'custom',
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-chengyuanguanli" />
              </svg>
            </i>
          )
        }
      }
    ],
    [
      // 产品管理 -- 角色管理 -- level 2
      60,
      {
        to: '/authorityManage/production/manage',
        iconType: 'custom',
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-jiaoseguanli" />
              </svg>
            </i>
          )
        }
      }
    ],
    [
      // 平台管理 -- 域配置 -- level 2
      61,
      {
        to: '/authorityManage/platform/domain',
        iconType: 'custom',
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-yupeizhi" />
              </svg>
            </i>
          )
        }
      }
    ],
    [
      // 平台管理 -- 域配置 -- level 2
      63,
      {
        to: '/tracker/spm',
        iconType: 'custom',
        icon: (h) => {
          return (
            <i style="font-size: 20px" class="g-mt-6">
              <svg class="u-icon" aria-hidden="true">
                <use xlinkHref="#icon-location" />
              </svg>
            </i>
          )
        }
      }
    ],
    [
      // 需求管理 -- level 3
      100,
      {
        to: '/tracker/requirement/list',
        name: '需求管理',
        includeTab: [
          '/tracker/requirement/list',
          '/tracker/requirement/detail'
        ]
      }
    ],
    [
      // 版本管理 -- level 3
      101,
      {
        to: '/tracker/requirement/version'
      }
    ],
    [
      // 元数据管理 -- 参数管理 level3
      102,
      {
        id: 'parameter',
        to: '/tracker/metadata/parameter'
      }
    ],
    [
      // 元数据管理 -- 参数模板 level3
      103,
      {
        id: 'template',
        to: '/tracker/metadata/template'
      }
    ],
    [
      // 元数据管理 -- 事件管理 level3
      104,
      {
        id: 'event',
        to: '/tracker/metadata/event'
      }
    ],
    [
      // 元数据管理 -- 终端管理 level3
      105,
      {
        id: 'terminal',
        to: '/tracker/metadata/terminal'
      }
    ],
    [
      // 元数据管理 -- 规则管理 level3
      107,
      {
        id: 'rule',
        to: '/tracker/metadata/rule'
      }
    ],
    [
      106,
      {
        id: 'task',
        to: '/tracker/requirement/task'
      }
    ]
  ]),
  priorityList: ['P0', 'P1', 'P2'], // 先级集合，存于store，便于扩展
  wsConnectPath: '',
  objectType: []
}
const mutations: MutationTree<GlobalState> = {
  setParamsTabFilter(state, { key, value }) {
    state[key] = value
  },
  setLocalToken(state, token: string) {
    state.localToken = token
  },
  setUser(state, user: User) {
    state.user = user
  },
  setPageLoading(state, pageLoading: boolean) {
    state.pageLoading = pageLoading
  },
  setMenuLists(state, menuLists: any[]) {
    state.menuLists = menuLists
  },
  setDomainId(state, id: number) {
    state.domainId = id
    // 存储访问的项目id
    localStorage.setItem('domainId', String(id))
  },
  setApp(state, app: AppDto) {
    state.app = app
    // 存储访问的项目id
    localStorage.setItem('appId', String(app?.id))
  },
  setAppList(state, appList: AppDto[]) {
    state.appList = appList
  },
  setBizConfig(state, bizConfig: BizConfigDto) {
    state.bizConfig = bizConfig
  },
  setRealTimeTestId(state, qrcodeId) {
    // 设置实时测试ID
    state.qrcodeId = qrcodeId
  },
  changeConnectPath(state, path) {
    state.wsConnectPath = path
  },
  setObjectType(state, data) {
    state.objectType = data
  }
}
const actions: ActionTree<GlobalState, any> = {
  async getAppList({ commit }, { appId }) {
    const appList = (await getAppList()) || []

    commit('setAppList', appList);

    if (appList.length) {
      if (appId) {
        const currentApp = appList.find((v) => String(v.id) === appId)

        currentApp && commit('setApp', currentApp)
      } else {
        const appId = localStorage.getItem('appId')
        let currentApp = appList.find((v) => String(v.id) === appId)

        !currentApp && (currentApp = appList[0])

        commit('setApp', currentApp)
      }
    }

    return appList
  },

  async chageQrCode({ commit }) {
    const appId = localStorage.getItem('appId')
    const qrCodeId = await getQrcodeId(1, appId)

    commit('setRealTimeTestId', qrCodeId)

    return qrCodeId
  },

  async getObjectType({ commit }) {
    const objectType = commit('setObjectType', [
      { key: 'page', value: '页面' },
      { key: 'element', value: '元素' },
      { key: 'popover', value: '浮层' }
    ])

    return objectType
  }
}
export default createStore<GlobalState>({
  state,
  mutations,
  actions,
  modules: {
    liveTest: LiveTestModule
  }
})
