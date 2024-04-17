export * from "./common";
export * from "./instance";
export * from "./loadJs";
export * from "./request";
export * from "./url";
export * from "./validator";

export * from "./vueProto";

export { default as TableMixin } from "./TableMixin.vue";

export function usePagination() {
  const _total = 0;
  const _current = 1;
  const _pageSizeOptions = ["25", "50", "100"];
  const _pageSize = 25;

  return {
    total: _total,
    current: _current,
    pageSize: _pageSize,
    pageSizeOptions: _pageSizeOptions,
    showQuickJumper: true,
    showSizeChanger: true,
    hideOnSinglePage: _total <= Number(_pageSizeOptions[0]),
    showTotal: (total: number) => `共 ${total} 条记录`,
  };
}
