<template v-if="formState.id">
  <a-form
    :model="formState"
    class="small-12"
    :colon="false"
    :wrapper-col="{ span: 16 }"
    ref="formRef"
    :label-col="{
      style: {
        textAlign: 'right !important',
        width: '100px',
      },
    }"
  >
    <div class="g-pl-12">
      <a-form-item
        style="width: 50%; display: inline-flex"
        label="元素类型"
        name="objSubType"
      >
        <span v-if="isPreview">{{ elementType[formState.objSubType] }}</span>
        <a-select
          v-else
          allowClear
          v-model:value="formState.objSubType"
          placeholder="请选择元素类型"
          @change="changeValues"
          style="width: 300px"
          :options="elementOptions"
        />
      </a-form-item>
      <a-form-item label="标签">
        <ObjTagSelect :tags="tags" ref="tagSelect" />
      </a-form-item>
    </div>
  </a-form>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import { elementType } from "./const";
import ObjTagSelect from "./ObjTagSelect.vue";
import Bus from "@/bus";

export default defineComponent({
  name: "TagSettingForm",
  components: { ObjTagSelect },
  props: ["formData", "isPreview"],
  computed: {
    formRef() {
      return this.$refs.formRef;
    },
  },
  beforeCreate() {
    // 监听变化
    Bus.$on("tagSelectChange", (tags) => {
      this.tags = tags;
      this.changeValues();
    });
  },
  beforeUnmount() {
    Bus.$off("tagSelectChange");
  },
  data() {
    const _formState: {
      id?: number;
      objSubType?: string;
      bizGroup?: string;
      analyseCid?: boolean;
    } = {};

    const columns = [
      {
        key: "cid",
        title: "cid",
        dataIndex: "cid",
        width: 100,
        customRender: ({
          index,
          record,
          text,
        }: {
          index: number;
          record: any;
          text: string;
        }) => {
          if (this.isPreview) return text;

          return (
            <a-input
              key={index}
              value={record.cid}
              placeholder="请输入 cid"
              onChange={(ev) =>
                this.handleChange("cid", index, ev.target.value)
              }
            />
          );
        },
      },
      {
        key: "name",
        title: "中文名称",
        dataIndex: "name",
        width: 100,
        customRender: ({
          index,
          record,
          text,
        }: {
          index: number;
          record: any;
          text: string;
        }) => {
          if (this.isPreview) return text;

          return (
            <a-input
              key={index}
              value={record.name}
              placeholder="请输入中文名称"
              onChange={(ev) =>
                this.handleChange("name", index, ev.target.value)
              }
            />
          );
        },
      },
    ];

    // 非预览模式下，显示操作列
    if (!this.isPreview) {
      columns.push({
        key: "action",
        title: "操作",
        dataIndex: "action",
        width: 100,
        customRender: ({ index }: { index: number }) => {
          return (
            <u-text-button on-click={this.handleDelete.bind(this, index)}>
              删除
            </u-text-button>
          );
        },
      });
    }

    return {
      formState: this.formData,
      columns,
      objectOptions: [],
      elementOptions: Object.keys(elementType).map((key) => ({
        label: elementType[key],
        value: key,
      })),
      dataSource: this.formData.cidTagInfos,
      index: 0,
      tags: this.formData.tags.map((item) => ({
        key: item.id,
        value: item.name,
      })),
      pagination: {
        defaultPageSize: 50,
        hideOnSinglePage: true,
      },
      elementType,
    };
  },

  methods: {
    terminalChange() {},
    handleAdd() {
      const newData = [...this.dataSource];

      this.index++;

      newData.push({ index: this.index });

      this.dataSource = newData;
    },
    handleDelete(index) {
      const newData = [...this.dataSource];

      this.index++;

      newData.splice(index, 1);

      this.dataSource = newData;
      this.changeValues();
    },
    handleChange(key, index, val) {
      const newData = [...this.dataSource];

      newData[index][key] = val;

      this.dataSource = newData;
      this.changeValues();
    },
    handleCheck(ev) {
      // 取消勾选时，清空
      !ev.target.checked && (this.dataSource = []);
      this.changeValues();
    },
    changeValues() {
      const data = {
        ...this.formState,
        tags: this.tags,
        cidTagInfos: this.dataSource
          .filter((item) => item.cid && item.name)
          .map(({ cid, name }) => ({ cid, name })),
      };

      // 触发更新
      Bus.$emit("tagFormChange", data);
    },
    validate() {
      return this.formRef.validateFields();
    },
  },
});
</script>
