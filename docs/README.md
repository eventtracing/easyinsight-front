# 流量分析平台
流量分析平台是一款针对toC产品的决策平台，该平台目前集成了对象流程流转、基础元数据定义、实时需求测试、产品权限配置四大模块。我们知道针对流量至上的toC产品的埋点管理功能是收集客户行为链路信息随后通过数据挖掘、统计等手段去分析客户潜在的兴趣爱好、操作习惯等行为的至为重要的决策手段，埋点信息的正确与否将直接影响到公司的决策，所以在客户端埋点过程中必须保证与需求完全一致，流量分析平台能够帮助客户端、测试、数据分析等环节点人员能够进一步地提升埋点的可靠性和产能

## 模块
- 需求管理
  - 对象: 平台贯注的重要基础, 由于组件的复用性，所以将组件作为对象并且将其视为埋点的基础，我们采用的超级位置模型SPM就是由对象作为节点串联起来的一条链路
    - 类型
      - 页面
      - 元素
      - 浮层: 浮层比较特殊，浮层不会拥有父对象，因为它可能随时出现在屏幕上
    - 优先级
      - P1
      - P2
      - P3
    - oid: 作为对象的唯一id
    - 名称
    - 描述
    - 标签: 附属属性，与描述类似
    - 图片: 可以拥有多张
    - 终端信息: 对象与终端是强绑定的，是多对多的关系，每个终端下的对象信息可以不相同，RN比较特殊，RN是跨平台的Hybrid技术，所以RN会自动映射成Iphone和Android
    - 全局公参: 所有对象共享的信息, 通常是终端信息
    - 对象标准私参: 对象所拥有的固定参数, 例如oid
    - 业务私参: 对象在不同业务下拥有的不同参数
    - 血缘配置: 除了浮层其他都具备血缘配置，用来串联SPM节点
    - 事件与事件公参: 对象具有事件信息，例如曝光、点击、拖拽等等，每个数据都是提前定义好的元数据，正如全局公参，事件同样拥有相同属性，例如触发开始时间、结束时间等
  - 需求组: 用于聚合需求的一个包概念，无实际用意
    - 需求: 用于包裹埋点任务额一个包概念，来自「研发流程平台」上的数据或者自定义
      - 任务: 任务下包含了对象以及事件，任务是作为发布上线的一个元数据，当任务下所有流程都走到测试通过后方可上线，并且拥有端版本控制，任务是跟着终端走的，每个终端任务会有若干差异
        - SPM节点: 即对象
        - 事件: 埋点信息目前并不局限于对象，有些是隐藏埋点，例如页面曝光、app关闭等不是主动触发情况
  - 流程状态
    - 开始: 需求任务下发
    - 待审核: 任务下发给数据分析人员
    - 已审核: 数据分析人员来分析数据与需求之间的吻合度，是否能够满足信息决策，是的话标记为已审核
    - 已完成: 客户端人员开始接入本次需求埋点，将其标记为已完成
    - 测试完成: 测试人员通过实时测试模块对本次需求进行校验埋点的正确，通过后则会标记为测试完成
- 元数据管理
  - 参数管理
    - 对象业务私参: 对象私有参数，比如进度条拥有播放结束事件
    - 对象标准私参: 对象共有私参，比如曝光
    - 事件公参: 事件共有参数，比如触发开始时间
    - 全局公参: 终端的参数，比如终端名称、终端系统版本
  - 参数模板: 参数模板是将元数据进行打包的一个组合，可以作为一个复用模板给到不同的对象
  - 事件类型: 所有事件都在此先创建，并且可以提供给不同对象使用，作为事件元数据
  - 终端管理: 目前是固化，只能在数据库里curd
- 埋点测试
  - 实时测试: 实时测试是在流程流转为已完成时提供便利的测试手段，将手机客户端通过服务端连接到平台上进行实时查看
    - 规则校验: 校验客户端上报的埋点日志与埋点规则
    - 实时日志: 查看客户端上报日志
      - 树模式: 根据SPM节点为维度进行策略测试，实时日志模式不具备
      - 时序模式: 根据上报日志的时间降序排序，实时日志模式不具备
      - 实时日志: 查看埋点日志
      - 实时日志(旧): 由于历史包袱原因，云音乐数据治理目前还未完成，所以客户端里保留了之前的埋点，需要做兼容处理
      - 错误日志: 用来收集上报错误的日志
- 产品权限配置
  - 产品权限
  - 域名权限
  - 平台权限

## 名词介绍
- 基线版本: 线上的版本
- 端版本: 客户端版本
#### 埋点参数分析
- oid: 对象的唯一id, 通常取的是对象页面路径, 但是由于客户端开发在需求更新之后才进行, 此时路径还未配置, oid此时会取一个唯一的id作为oid使用, 后续会和路径互相映射
- name: 对象名称
- description: 对象描述
- tag: 对象标签
- terminal：终端
- _pageStep: 访问对象的次数
- _elists: 单页面里的对象链路上的元素集合
- _plists: 页面链路集合
