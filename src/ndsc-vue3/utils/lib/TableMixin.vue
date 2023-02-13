<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TableMixin",
  computed: {
    pagination() {
      return {
        total: this.total,
        current: this.current,
        pageSize: this.pageSize,
        pageSizeOptions: this.pageSizeOptions,
        showQuickJumper: true,
        showSizeChanger: true,
        hideOnSinglePage: this.total <= Number(this.pageSizeOptions[0]),
        showTotal: (total: number) => `共 ${total} 条记录`,
      };
    },
  },

  data() {
    const _total = 0;
    const _current = 1;
    const _pageSizeOptions = ["25", "50", "100"];
    const _pageSize = 25;

    return {
      loading: false,
      total: _total,
      current: _current,
      pageSizeOptions: _pageSizeOptions,
      pageSize: _pageSize,
    };
  },
});
</script>
