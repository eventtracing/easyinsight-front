# 侧边栏

符合交互、视觉规范的 Sidebar 组件 `@/ndsc-vue3/sidebar`

应用场景：项目级菜单导航栏

用法：
:::demo

```html
<template>
  <div class="main" style="display: flex; height: 300px">
    <mm-sidebar
      v-if="Sidebar"
      :navConfig="navConfig"
      @onMenuItemClick="onMenuItemClick"
    >
      <template slot="homeSlotIcon">
        <a-icon type="highlight" />
      </template>
    </mm-sidebar>
    <div class="content"></div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        navConfig: {
          project: {
            // 从接口获取，详见下方文档
            iconName: 'xxx',
            name: '指标系统'
          },
          menu: [
            {
              id: 'overview',
              name: 'API管理列表',
              to: '/test',
              // 自定义slot
              iconType: 'custom',
              icon: 'homeSlotIcon',
              children: [
                {
                  id: 'one',
                  name: '导航一',
                  to: '/test/one',
                  children: [
                    {
                      id: 'one11',
                      name: '导航一二',
                      to: '/test/three',
                      includeTab: ['/test/four']
                    }
                  ]
                }
              ]
            },
            {
              id: 'dict',
              name: '指标字典',
              to: '/dict',
              iconType: 'custom',
              icon: 'homeSlotIcon'
              // 函数形式的
              // icon: h => {
              //   return <a-icon type="profile" />
              // }
            }
          ],
          isConfigPage: false,
          config: {
            hide: false,
            to: '/dict',
            name: '业务设置'
          }
        }
      }
    },
    methods: {
      onMenuItemClick(item) {}
    }
  }
</script>
```

:::

## 属性

| 字段            | 类型                          | 说明               | 默认值 | 是否必须 |
| --------------- | ----------------------------- | ------------------ | ------ | -------- |
| navConfig       | [NavConfigDto](#NavConfigDto) | 菜单数据           | -      | 是       |
| defaultCloseIds | string[]                      | 默认缩起的子菜单   | []     | 否       |
| inlineCollapsed | boolean                       | 初始展开缩起的状态 | false  | 否       |

## 事件

| 事件名称        | 说明                     | 参数            |
| --------------- | ------------------------ | --------------- |
| onMenuItemClick | 点击 MenuItem 调用此函数 | function(item) |
| collapsedChange | 展开缩起按钮被点击的回调函数 | function(isCollapsed: boolean) |

## 接口

### <div id="NavConfigDto">NavConfigDto</div>

菜单数据
参数 | 类型 | 说明 | 默认值 | 是否必须 |
--- | --- | --- | --- | --- |
project | [ProjectDto](#ProjectDto) | 产品信息 | - | 否 |
menu | [NavListDto[]](#NavListDto) | 菜单列表 | [] | 是 |
isConfigPage | boolean | 是否在业务设置页模块 | false | 否 |
config | [ConfigDto](#ConfigDto) | 底部业务设置 | - | 否 |

### <div id="ProjectDto">ProjectDto</div>

产品信息
参数 | 类型 | 说明 | 默认值 | 是否必须 |
--- | --- | --- | --- | --- |
iconName | string | 产品 logo 的 icon type，跟顶部的导航栏保持一致，详见下方获取方式 | - | 否 |
icon | string、function | 自定义（slot 和函数返回） | - | 否 |
name | string | 产品名 | - | 是 |
to | string | 跳转的路径，默认是 '/' | - | 否 |

> 注意：在选择产品 logo 有两种方式：

```js
{
  navigationList: [
    ...{
      headTitle: '指标系统',
      iconName: 'data-index' // 对应产品的iconName
    }
  ]
}
```

#### 2. **icon：**

自定义方式，导航栏改了，项目内部也需要改

1. 自定义 slot

```js
project: {
  icon: 'projectLogo',
  name: '指标系统'
},
```

```html
<sidebar :navConfig="navList4" @onMenuItemClick="onMenuItemClick">
  <template slot="projectLogo">
    <a-icon type="form" />
  </template>
</sidebar>
```

2. 自定义函数

```js
project: {
  icon: h => <a-icon type="plus-square" />,
  name: '指标系统'
},
```

### <div id="NavListDto">NavListDto</div>

菜单列表
参数 | 类型 | 说明 | 默认值 | 是否必须 |
--- | --- | --- | --- | --- |
id | string | 菜单 key 的取值 | - | 是 |
name | string | 菜单的名称 | - | 是 |
to | string | 菜单的路由 | - | 是 |
hide | boolean | 菜单是否隐藏（权限相关） | - | 否 |
includeTab | string[] | 在页面层级较深、路由不是以菜单`to`开头的情况下，设置路由归属，使菜单高亮 | - | [] |
iconType | svgIcon、custom | icon 支持 svgIcon，自定义（slot 和函数返回）两种方式 | - | 如果有 icon，必须 |
icon | string、function | icon type 或者自定义（slot 和函数返回） | - | 如果有 icon，必须 |
children | NavListDto[] | 子菜单 | - | 否 |

### 菜单 icon 接入方式

1. 自定义 slot

```js
{
  id: 'overview',
  name: 'API管理列表',
  to: '/test',
  iconType: 'custom', // 自定义
  icon: 'homeSlotIcon', // template的slot
}
```

```html
<sidebar :navConfig="navList1" @onMenuItemClick="onMenuItemClick">
  <template slot="homeSlotIcon">
    <a-icon type="highlight" />
  </template>
</sidebar>
```

2. 自定义函数

```js
{
  id: 'overview',
  name: 'API管理列表',
  to: '/test',
  iconType: 'custom',
  icon: h => {
    return <a-icon type="profile" />
  }
}
```

3. 使用内嵌的 svgIcon，只需要传 svgIcon 的 type 即可

```js
{
  id: 'overview',
  name: 'API管理列表',
  to: '/test',
  iconType: 'svgIcon',
  icon: 'nav_summary',
}
```

注意：需在业务里引用对应的 svg

```js
import '@/assets/nav_summary'
```

nav_summary.ts 文件内容:

```js
import icon from 'vue-svgicon'
icon.register({
  nav_summary: {
    width: 20,
    height: 20,
    viewBox: '0 0 20 20',
    data:
      '<path pid="0" d="M10 3a8 8 0 015.29 14.001H4.71A8 8 0 0110 3zM7.522 8.685L9.03 13.15a1 1 0 101.603-.926L7.522 8.685zm-3.859.573l-.258.966 1.932.518.258-.966-1.932-.518zm12.674 0l-1.932.518.258.966 1.932-.518-.258-.966zM6.023 5.88l-.707.707L6.73 8.001l.707-.707-1.414-1.415zm7.985 0l-1.414 1.415.707.707 1.414-1.415-.707-.707zM10.5 4.534h-1v2h1v-2z" _fill="#666" fill-rule="evenodd"/>'
  }
})
```

### <div id="ConfigDto">ConfigDto</div>

底部业务设置
参数 | 类型 | 说明 | 默认值 | 是否必须 |
--- | --- | --- | --- | --- |
hide | boolean | 是否显示底部业务设置 | - | 否 |
to | string | 新开窗口跳转的地址 | - | 否 |
name | string | 名称 | - | 否 |

## Changelog

### 2.3.5

`2021.07.06`

- 🐞 fix: 初始菜单高亮（使用 `this.$route.path` 代替 `location.pathname`）

### 2.3.3

`2021.05.25`

- 💄 `ProjectDto` 增加 `to`属性，支持自定义跳转路径

### 2.3.2

`2021.04.16`

- 🐞 业务设置缩起时支持跳转

### 2.3.1

`2021.04.15`

- 🐞 样式优化

### 2.3.0

`2021.04.12`

- 💄 增加`collapsedChange`事件，监听展开缩起的变化

### 2.2.7

`2021.03.22`

- 🐞 修复样式问题：项目配置icon颜色不生效

### 2.2.4, 2.2.5, 2.2.6

`2021.03.16`

- 🐞 修复样式问题

### 2.2.3

`2021.02.26`

- 💄 子菜单跳转由组件内部控制，同时支持右键打开三种方式（新标签、新窗口、隐身）
  影响：子产品无需在子菜单被点击时做路由跳转了
