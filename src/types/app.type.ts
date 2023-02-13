export interface User {
  email: string;
  userName: string;
}

// 产品信息
export interface AppDto {
  id: number;
  code: string;
  name: string;
  description: string;
  creator: User;
  createTime: number;
  updateTime: number;
}

// 项目配置信息
// TODO: 去除猛犸依赖
export interface BizConfigDto {
  bdmsUrl: string; // mammaut url，用于获取导航栏
  bdmsPermissionUrl: string; // mammut用户项目、权限申请页面url(用于403、nobiz页面)
  overmindUrl: string;
  musicRoutingUrl: string; // 路由平台地址
}

export interface WsDataDto {
  ruleList: any[];
  logData: any;
  oldRuleList: any[];
  oldLOgData: any;
  exceptions: any[];
  expLogList: any[];
  undefinedStatistics: any;
  baseTree: any[];
  taskTree: any[];
  taskName: string;
}

export interface FilterDto {
  key: string | number;
  value: string;
}
