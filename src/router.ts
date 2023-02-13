import { createRouter, createWebHistory } from "vue-router";
import request from "@/utils/request";
import { isEmpty, assign } from "lodash";
import homeRoutes from "./views/home/router";
import store, { GlobalState } from "./store/index";
import { PVInfoMap } from "./pv";
import { trackPage } from "./track";

const Page403 = () => import("./views/403.vue");
const Page404 = () => import("./views/404.vue");
const PageNoBiz = () => import("./views/NoBiz.vue");

const DEFAULT_PATH = "/authorityManage/domain/product";

const menuLists = store.state.menuLists;

homeRoutes[0].children.push(
  {
    path: "/nobiz",
    name: "PageNoBiz",
    component: PageNoBiz,
  },
  {
    path: "/403",
    name: "Page403",
    component: Page403,
  }
);

const routes = [
  ...homeRoutes,
  {
    path: "/404",
    name: "Page404",
    component: Page404,
  },
  {
    // 此处需放于路由最底部
    path: "/(:match)*",
    component: Page404,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const errorPaths = ["/nobiz", "/403", "/404"];

router.beforeEach((to, from, next) => {
  if (isEmpty(history.state.current)) {
    assign(history.state, { current: from.fullPath });
  }

  const toFullPath = to.fullPath;
  const fromFullPath = from.fullPath;

  if (toFullPath === fromFullPath) return;

  next();
});

let hasApp = true;

router.beforeEach(async ({ path, query }, from, next) => {
  const { appId } = query;

  // 路由切换时取消上个页面需要取消的请求
  request.pendingRequest.forEach((r) => {
    r.routeChangeCancel && r.cancel();
  });

  if (errorPaths.includes(path)) return next();

  const { appList, app } = store.state as GlobalState;

  if (!appList?.length && hasApp) {
    hasApp = false;

    return next({ path: DEFAULT_PATH, query });
  }

  if (!appId && app?.id) {
    return next({
      path: path,
      query: {
        ...query,
        appId: app?.id?.toString(),
      },
    });
  }

  const option = appList.find((v) => v.id.toString() === appId);

  if (!option) {
    return next({
      path: "/403",
      query: { ...query, appId },
    });
  }

  next();
});

let checkAuth = true;

router.beforeEach(({ meta, query, path }, from, next) => {
  const currentMenu = menuLists.some((menu) => menu.code === meta.type);
  const { appId, ...reset } = query;

  if (!currentMenu && checkAuth) {
    checkAuth = false;

    path !== "/403" && (checkAuth = true);

    appId && (reset.appId = appId);

    return next({
      path: appId ? "/403" : DEFAULT_PATH,
      query: reset,
    });
  }

  checkAuth = true;

  next();
});

let wsProxy = true;
router.beforeEach((to, from, next) => {
  if (from && from.name === "realtimeDetail" && to.name === "realtimeLists") {
    const wsConnectPath = store.state.wsConnectPath;
    if (wsConnectPath) {
      wsProxy = true;
      return next(false);
    }
  }
  if (to.name !== "realtimeLists") {
    wsProxy = true;
    return next();
  }

  const wsConnectPath = store.state.wsConnectPath;
  if (wsConnectPath && wsProxy) {
    const [path, query] = wsConnectPath.split("?");
    const wsQuery = {};

    for (const b of new URLSearchParams(query).entries()) {
      wsQuery[b[0]] = b[1];
    }

    wsProxy = false;

    return next({
      path,
      query: wsQuery,
    });
  }
  wsProxy = true;
  next();
});

router.beforeResolve((to, from, next) => {
  const { id, query, data } = PVInfoMap[to.path] || {};

  // 是否需要埋点
  if (id) {
    // 是否有路由参数
    if (query && Object.keys(query).length) {
      const isMatch = (route) => {
        if (!route) {
          return false;
        }
        return Object.keys(query).every((key) => {
          return query[key] === route.query[key];
        });
      };
      // 避免重复上报
      if (isMatch(to) && !isMatch(from)) {
        trackPage(id, data || {});
      }
    } else {
      // 避免重复上报
      if (from?.path !== to.path) {
        trackPage(id, data || {});
      }
    }
  }

  next();
});

export default router;
