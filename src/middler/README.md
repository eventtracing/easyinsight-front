# middler文件夹需知
> middler文件夹是给打包编译时做自动转换处理的文件包

## 前言
背景条件是目前项目开发打包工具迁移到了vite，但是生产环境考虑到线上稳定性还是依旧沿用了webpack打包编译方式

## babelPlugin
由于vite的全局注册API与webpack具有差异，故分别编写了一份注册文件，installCommon.js在打包编译的时候根据当前打包软件来区别使用哪个注册文件

## vitePlugin
由于vite已经放弃了es5的转译功能，支持的浏览器是es6及其以上的版本，所以vite舍弃掉了babel，然后这里写的自定义的vitePlugin，用来模拟babel的转译

#### antDesignVueImport
作用: 将ant-design-vue按需加载

#### injectAction
作用: 由于ant-design-vue1.x存在浏览器esm兼容问题，所以自定义插件来做处理，现在升级到2.x可以不再使用


## 结束
其余的文件暂时没有用到，可以忽略