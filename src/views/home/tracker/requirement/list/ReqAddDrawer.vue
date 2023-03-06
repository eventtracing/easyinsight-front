<template>
  <u-drawer
    :title="title"
    :width="1000"
    :visible="true"
    footer=""
    @handlerClose="handleClose"
    @handleOk="handleOk"
  >
    <transition name="opacitys">
      <div class="flex loading" v-if="loading">
        <a-spin />
      </div>
    </transition>
    <a-form
      :model="formState"
      class="small-12"
      :colon="false"
      labelAlign="left"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      ref="formRef"
      :rules="rules"
    >
      <a-form-item label="需求ID" required name="reqIssueKey" v-if="!isCustome">
        <a-input
          placeholder="请输入需求关键字，比如：OMDSCMAMMUT-325"
          v-model:value="formState['reqIssueKey']"
          :disabled="isEdit"
        />
      </a-form-item>
      <a-form-item label="需求名称" name="name">
        <a-input
          v-if="isCustome"
          placeholder="请输入需求名称"
          v-model:value="formState.name"
        />
        <span v-else>{{ $get(formState, "name", "-") }}</span>
      </a-form-item>
      <a-form-item label="创建人" name="creator">
        <div class="flex-ac">
          <s-user-select
            defaultStyle="width: 340px;"
            class="c-user__select"
            @change="onCreatorSelect"
            @getUserLists="getUserLists"
            v-model:value="formState['creator']"
            v-show="!formState.reporter"
          />
          <span
            v-show="formState.reporter"
            style="display: inline-block; width: 340px"
          >
            {{ $get(formState, "reporter.userName", "-") }}
          </span>
          <a-checkbox
            v-show="!isCustome"
            class="g-ml-16"
            v-model:checked="formState.reporter"
          >
            同步需求报告人
          </a-checkbox>
        </div>
      </a-form-item>
      <a-form-item label="需求优先级" name="priority">
        <a-select
          placeholder="请选择优先级"
          v-model:value="formState.priority"
          v-if="isCustome"
        >
          <a-select-option v-for="p in priorityList" :key="p" :value="p">
            {{ p }}
          </a-select-option>
        </a-select>
        <span v-else>{{ formState.priority }}</span>
      </a-form-item>
      <a-form-item label="描述" name="desc">
        <s-editor @change="changeDesc"></s-editor>
      </a-form-item>
      <a-form-item label="任务">
        <req-task
          :taskList="taskList"
          :from="formState.from"
          :terminalLists="terminalLists"
          :owners="userLists"
          ref="reqTask"
        />
      </a-form-item>
      <div class="c-requirement__researchManageUrl" v-if="!isCustome">
        <a-form-item label="来源需求状态">
          {{ sourceMap[formState.sourceStatus] }}
        </a-form-item>
        <a-form-item label="视图">
          {{ formState.views }}
        </a-form-item>
        <a-form-item label="业务领域">
          {{ formState.businessArea }}
        </a-form-item>
        <a-form-item label="关联团队">
          {{ formState.team }}
        </a-form-item>
      </div>
    </a-form>
  </u-drawer>
</template>

<script lang="ts">
import { defineComponent, nextTick, reactive, ref, watch } from "vue";
import type { PropType } from "vue";
import { RequirementDto, SourceMap } from "@/types/requirement.type";
import { User } from "@/types/common.type";
import {
  addRequirement,
  editRequirement,
  getRequirmentDetail,
} from "@/services/requirement.service";
import { BizConfigDto } from "@/types/app.type";
import ReqTask from "./ReqTask.vue";

export default defineComponent({
  name: "ReqAddDrawer",
  components: { ReqTask },
  setup() {
    return {
      reqTask: ref<any>(),
      taskList: reactive([]),
      sourceMap: SourceMap,
    };
  },
  props: {
    id: {
      type: Number as PropType<number>,
      default: 0,
    },
    terminalLists: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    reqPoolId: {
      type: [Number, String] as PropType<number | string>,
      default: 0,
    },
  },
  computed: {
    bizConfig() {
      const bizConfig: BizConfigDto = this.$store.state.bizConfig;

      return bizConfig;
    },
    user() {
      const user: User = this.$store.state.user;

      return user;
    },
    isEdit() {
      return !!this.id;
    },
    isCustome() {
      return this.formState.from === 2;
    },

    priorityList() {
      const priorityList: string[] = this.$store.state.priorityList;

      return priorityList;
    },

    title() {
      return (this.id ? "编辑" : "添加") + "需求";
    },
  },

  data() {
    const _req: RequirementDto = null;
    const _tasks = [];
    const _creator: User = null;
    const _dataOwner: User[] = null;
    const _syncCreator = false;
    const _confirming = false;

    return {
      req: _req,
      tasks: _tasks,
      creator: _creator,
      dataOwner: _dataOwner,
      syncCreator: _syncCreator,
      confirming: _confirming,
      rules: {},
      loading: false,
      userLists: [],
      formState: {
        from: 2,
        priority: "P1",
        reqIssueKey: "",
        creator: "",
      },
    };
  },

  created() {
    this.rules = {
      creator: [
        {
          required: true,
          message: "此字段为必填字段",
        },
      ],
    };

    watch(
      () => this.isCustome,
      (n) => {
        this.loading = true;

        setTimeout(() => {
          this.loading = false;
        }, 300);

        this.rules.name = n
          ? [{ required: true, message: "请输入需求名称" }]
          : undefined;
      }
    );

    if (this.id) {
      getRequirmentDetail(this.id).then((res) => {
        const { reqInfo, tasks } = res;

        Object.assign(this.formState, reqInfo);
        nextTick().then(() => {
          this.taskList.push(
            ...tasks.map((v) => ({
              ...v,
              owner: v.owner?.email,
              verifier: v.verifier?.email,
            }))
          );
        });
      });
    } else {
      this.rules.reqIssueKey = [
        { required: true, message: "此字段为必填字段" },
      ];
    }

    this.formState.creator = this.user?.email || null;
    this.creator = this.user;
  },

  methods: {
    getUserLists(userLists) {
      this.userLists = userLists;
    },
    onCreatorSelect(v: string, u: User) {
      this.creator = u;
    },
    changeDesc(desc) {
      this.formState.desc = desc;
    },
    // 判断任务
    judgeTaskNameOrTerminal(tasks) {
      return tasks.some((task) => !task.name || !task.terminalId);
    },

    handleOk() {
      if (this.confirming) return Promise.resolve();

      this.confirming = true;
      this.$refs.formRef
        .validateFields()
        .then((values) => {
          const tasks = this.reqTask.dataSource;

          if (this.judgeTaskNameOrTerminal(tasks)) {
            this.confirming = false;
            return this.$message.error("请填写任务名称或者终端");
          }

          const data = {
            reqPoolId: this.reqPoolId,
            requirement: {
              from: values.from,
              ...this.formState,
              creator: this.creator,
            },
            tasks: tasks.map((v) => ({
              ...v,
              owner: this.userLists.find((u) => u.email === v.owner),
              verifier: this.userLists.find((u) => u.email === v.verifier),
              id: v.custom ? undefined : v.id,
              custom: undefined,
            })),
          };

          const promise = this.isEdit
            ? editRequirement(data)
            : addRequirement(data);

          promise
            .then(() => {
              this.$message.success(`${this.isEdit ? "编辑" : "创建"}成功`);
              this.$emit("handlerOk");
            })
            .finally(() => {
              this.confirming = false;
            });
        })
        .catch(() => {
          this.confirming = false;
        });
    },
    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>

<style lang="less" scoped>
.loading {
  position: absolute;
  width: 80%;
  height: 80%;
  background: rgba(255, 255, 255, 0.7);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
