# easyinsight-web

曙光 Easyinsight 平台 web 项目

跟 [easyinsight-server](https://github.com/eventtracing/easyinsight-server) 配套使用

## Structure
```
  |-- build
      |-- tag.sh 发布脚本（分支合并到master、生成changelog、打tag）
  |-- src
      |-- assets 静态资源目录（logo图片）
      |   |-- iconfont.js (iconfont 图标资源 symbol 代码)
      |-- components 全局组件（具体结构查看文件夹内的 README）
      |-- middler 中间件（具体结构查看文件夹内的 README）
      |-- ndsc-vue3 vue3升级后的公共包
      |-- services 全局service（具体结构查看文件夹内的 README）
      |-- store
      |   |-- index.ts 全局store
      |-- style
      |   |-- index.less 样式导出
      |   |-- scrollbar.less 滚动条样式
      |-- types 全局类型定义 （具体结构查看文件夹内的 README）
      |-- utils 全局工具函数
      |   |-- hooks.ts vue3支持的自定义hooks方式，已经在webpack和vite里都自定义了别名(hooks/*)
      |   |-- cookie.ts 通用获取cookie方式
      |   |-- common.ts 通用工具函数
      |   |-- request.ts 请求封装
      |-- views 页面（具体结构查看文件夹内的 README）
      |   |-- home 主模块
      |   |   |-- ...
      |   |-- Home.vue home模块入口
      |   |-- 403.vue 403页面
      |   |-- 404.vue 404页面
      |   |-- Nobiz.vue 没有可用项目页面
      |   |-- Layout.vue 页面布局
      |-- App.vue 页面入口
      |-- main.ts 项目入口
      |-- mixin.ts 全局mixin
      |-- router.ts 项目路由
  |-- .dockerignore
  |-- .eslintrc.js eslint配置
  |-- .gitlab-ci.yml Gitlib CI配置，执行lint任务等
  |-- .npmrc npm源配置文件
  |-- babel.config.js babel配置
  |-- commitlint.config.js commitlint配置
  |-- default.yaml topbar配置文件
  |-- Dockerfile docker配置文件
  |-- tsconfig.json typescript配置信息
  |-- vue.config.js vue相关配置
```

## Init Environment

You can install `nvm` to manage different version node, and then install `yarn`.

```bash
# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# install lts version node
nvm install --lts

# install yarn
npm install -g yarn
```


## How to start

``` bash
# install dependencies
yarn install

# test 环境开发
yarn start

yarn build
```

## How to commit

git message demo：

```bash
git commit -m "feat: 新增xxx"
```

## How to release

分支合并、更改 version（package.json）、生成 changelog，打 tag，具体见 build 文件夹下 tag.sh 脚本

```bash
  # 1. 将指定分支（默认为 develop）合并到 master 分支
  # 2. 输入上线版本，如 1.0.0
  # 3. 更新 package.json version 字段
  # 4. 更新 changelog
  # 5. commit 更新，打 tag （如：v1.0.0）
  # 6. push 更新
  # 7. develop 分支 rebase

  yarn release
```
