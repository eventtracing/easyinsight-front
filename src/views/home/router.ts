const Home = () => import("./index.vue");

// 需求管理
const Tracker = () => import("./tracker/index.vue");
const RequirementConfig = () => import("./tracker/requirement/index.vue");
const RequirementList = () =>
  import("./tracker/requirement/list/Requirement.vue");
const RequirementTask = () => import("./tracker/requirement/list/index.vue");

// 需求详情页
const RequirementDetail = () =>
  import("./tracker/requirement/detail/index.vue");
const RequirementTaskDetail = () =>
  import(
    "./tracker/requirement/detail/RequireTaskDetail/RequirementTaskDetail.vue"
  );

// 版本管理页
const RequirementVersion = () =>
  import("./tracker/requirement/version/Publish.vue");
const VersionPublish = () =>
  import("./tracker/requirement/version/version-publish/index.vue");
const RequirementRecord = () =>
  import("./tracker/requirement/record/index.vue");

// 对象管理页
const ObjectConfig = () => import("./tracker/object/index.vue");
const ObjectManage = () => import("./tracker/object/list/index.vue");

// 事件管理
const EventManage = () => import("./tracker/event/index.vue");
const EventRecord = () => import("./tracker/event/Record.vue");

// 元数据管理
const MetadataConfig = () => import("./tracker/metadata/index.vue");
const Parameter = () => import("./tracker/metadata/parameter/index.vue");
const ParamTemplate = () => import("./tracker/metadata/template/index.vue");
const Event = () => import("./tracker/metadata/event/index.vue");
const Terminal = () => import("./tracker/metadata/terminal/index.vue");
const Rule = () => import("./tracker/metadata/rule/index.vue");

// 埋点测试
const Test = () => import("./test/index.vue");
const RealtimeLists = () => import("./test/realtime/lists/index.vue");
const Realtime = () => import("./test/realtime/detail/index.vue");
const RealtimeRecord = () => import("./test/realtime/record/index.vue");
const RealtimeDataAudit = () => import("./test/realtime/audit/index.vue");

const AuthorityManage = () => import("./authorityManagement/index.vue");
const DomainManage = () =>
  import("./authorityManagement/domainManage/index.vue");
const DomainManageDetail = () =>
  import("./authorityManagement/domainManage/detail/index.vue");
const DomainManageMember = () =>
  import("./authorityManagement/domainManage/member/index.vue");
const DomainManageProduct = () =>
  import("./authorityManagement/domainManage/product/index.vue"); // 域名管理
const ProductionManage = () =>
  import("./authorityManagement/productionManage/index.vue");
const ProductionManageInfo = () =>
  import("./authorityManagement/productionManage/info/index.vue");

// 域管理
const ProductionManageMember = () =>
  import("./authorityManagement/productionManage/member/index.vue");
const ProductionManageManage = () =>
  import("./authorityManagement/productionManage/manage/index.vue");
const PlatformManage = () =>
  import("./authorityManagement/platformManage/index.vue");
const PlatformManageDomain = () =>
  import("./authorityManagement/platformManage/domain/index.vue");

const homeRoutes = [
  {
    path: "/tracker",
    name: "tracker",
    component: Tracker,
    meta: { type: 1 },
    redirect: "/tracker/requirement/list",
    children: [
      {
        path: "/tracker/requirement",
        name: "requirement",
        component: RequirementConfig,
        redirect: "/tracker/requirement/list",
        children: [
          {
            path: "/tracker/requirement/list",
            name: "requirement-list",
            meta: { type: 1 },
            component: RequirementList,
          },
          {
            path: "/tracker/requirement/task/:id?/:type?",
            name: "requirement-task",
            meta: { type: 1 },
            component: RequirementTask,
          },
          {
            path: "/tracker/requirement/design/:id?",
            name: "RequirementTaskDetail",
            meta: { type: 1 },
            component: RequirementTaskDetail,
          },
          {
            path: "/tracker/requirement/detail",
            name: "requirement-detail",
            meta: { type: 1 },
            component: RequirementDetail,
          },
          {
            path: "/tracker/requirement/version",
            name: "requirement-version",
            meta: { type: 1 },
            component: RequirementVersion,
          },
          {
            path: "/tracker/requirement/version/publish",
            name: "requirement-version-publish",
            meta: { type: 1 },
            component: VersionPublish,
          },
          {
            path: "/tracker/requirement/record",
            name: "requirement-record",
            meta: { type: 1 },
            component: RequirementRecord,
          },
        ],
      },
      {
        path: "/tracker/object",
        name: "object",
        component: ObjectConfig,
        redirect: "/tracker/object/list",
        children: [
          {
            path: "/tracker/object/list",
            name: "object-list",
            meta: { type: 1 },
            component: ObjectManage,
          },
        ],
      },
      {
        path: "/tracker/event/manage",
        name: "TrackerEvent",
        component: EventManage,
        meta: { type: 1 },
      },
      {
        path: "/tracker/event/record",
        name: "TrackerEventRecord",
        component: EventRecord,
        meta: { type: 1 },
      },
      {
        path: "/tracker/metadata",
        name: "metadata",
        component: MetadataConfig,
        redirect: "/tracker/metadata/parameter",
        children: [
          {
            path: "/tracker/metadata/parameter",
            name: "parameter",
            meta: { type: 1 },
            component: Parameter,
          },
          {
            path: "/tracker/metadata/template",
            name: "template",
            meta: { type: 1 },
            component: ParamTemplate,
          },
          {
            path: "/tracker/metadata/event",
            name: "event",
            meta: { type: 1 },
            component: Event,
          },
          {
            path: "/tracker/metadata/terminal",
            name: "terminal",
            meta: { type: 1 },
            component: Terminal,
          },
          {
            path: "/tracker/metadata/rule",
            name: "rule",
            meta: { type: 1 },
            component: Rule,
          },
        ],
      },
    ],
  },
  {
    path: "/test",
    name: "test",
    component: Test,
    redirect: "/test/realtime",
    children: [
      {
        path: "realtime",
        name: "realtimeLists",
        meta: { type: 2 },
        component: RealtimeLists,
      },
      {
        path: "record",
        name: "recordList",
        meta: { type: 2 },
        component: RealtimeRecord,
      },
      {
        path: "realtime/detail",
        name: "realtimeDetail",
        meta: { type: 2 },
        component: Realtime,
      },
      {
        path: "data-audit/:match*",
        name: "dataAudit",
        meta: { type: 2 },
        component: RealtimeDataAudit,
      },
    ],
  },
  {
    path: "/authorityManage/",
    name: "AuthorityManage",
    component: AuthorityManage,
    children: [
      {
        path: "production/",
        name: "ProductionManage",
        component: ProductionManage,
        redirect: "/authorityManage/production/info",
        children: [
          {
            path: "info",
            name: "ProductionManageInfo",
            meta: { type: 4 },
            component: ProductionManageInfo,
          },
          {
            path: "member",
            name: "ProductionManageMember",
            meta: { type: 4 },
            component: ProductionManageMember,
          },
          {
            path: "manage",
            name: "ProductionManageManage",
            meta: { type: 4 },
            component: ProductionManageManage,
          },
        ],
      },
      {
        path: "domain/",
        name: "DomainManage",
        component: DomainManage,
        redirect: "/authorityManage/domain/detail",
        children: [
          {
            path: "detail",
            name: "DomainManageDetail",
            meta: { type: 3 },
            component: DomainManageDetail,
          },
          {
            path: "member",
            name: "DomainManageMember",
            meta: { type: 3 },
            component: DomainManageMember,
          },
          {
            path: "product",
            name: "DomainManageProduct",
            meta: { type: 3 },
            component: DomainManageProduct,
          },
        ],
      },
      {
        path: "platform/",
        name: "PlatFormnManage",
        component: PlatformManage,
        redirect: "/authorityManage/platform/domain",
        children: [
          {
            path: "domain",
            name: "PlatformManageDomain",
            meta: { type: 5 },
            component: PlatformManageDomain,
          },
        ],
      },
    ],
  },
];

const routes: any = [
  {
    path: "",
    name: "home",
    component: Home,
    redirect: "/tracker",
    children: homeRoutes,
  },
];

export default routes;
