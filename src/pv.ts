interface PVInfoRouteMap {
  [props: string]: {
    id: string;
    data?: Record<string, any>;
    query?: Record<string, string>;
  };
}

export const PVInfoMap: PVInfoRouteMap = {
  "/tracker/requirement/list": {
    id: "page_requirement",
  },
  "/tracker/requirement/version": {
    id: "page_version",
  },
  "/tracker/object/list": {
    id: "page_object",
  },
  "/tracker/metadata/parameter": {
    id: "page_parameter",
  },
  "/tracker/metadata/template": {
    id: "page_template",
  },
  "/tracker/metadata/event": {
    id: "page_event",
  },
  "/tracker/metadata/terminal": {
    id: "page_terminal",
  },
  "/test/realtime": {
    id: "page_realtime",
  },
  "/test/realtime/detail": {
    id: "page_realtime_detail",
  },
  "/authorityManage/production/info": {
    id: "page_product_info",
  },
  "/authorityManage/production/member": {
    id: "page_product_member",
  },
  "/authorityManage/production/manage": {
    id: "page_product_role",
  },
  "/authorityManage/production/notification": {
    id: "page_product_notification",
  },
  "/authorityManage/domain/detail": {
    id: "page_domain_info",
  },
  "/authorityManage/domain/member": {
    id: "page_domain_member",
  },
  "/authorityManage/domain/product": {
    id: "page_domain_product",
  },
  "/authorityManage/platform/domain": {
    id: "page_platform_domain",
  },
  "/tracker/requirement/detail": {
    id: "page_requirement_detail",
  },
};
