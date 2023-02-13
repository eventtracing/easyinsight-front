<template>
  <a-form
    :model="formState"
    class="small-12"
    style="padding-left: 0"
    :colon="false"
    labelAlign="left"
    :rules="rules"
    ref="formRef"
  >
    <BatchAddBaseInfoForm
      :obj="newObj"
      @consistencyChange="onConsistencyChange"
    />
    <TerminalConfigForm
      :formState="formState"
      :form="$refs.formRef"
      @terminalChange="terminalChange"
      :events="matchEvents"
      :trackers="newObj.trackers"
      :tabTrackers="tabTrackers"
      :newObj="newObj"
      :terminals="terminals"
      :terminalIds="terminalIds"
      :isAdd="true"
      v-if="defferMoule > 20"
    />
    <div class="g-pl-12">
      <a-form-item
        label="其他项配置模式"
        style="width: 1000px"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <div class="flex" style="align-items: center">
          <a-checkbox
            v-model:checked="newObj.consistency"
            :disabled="!isDisabled"
            @change="onConsistencyChange"
          >
            Android/iPhone一致
          </a-checkbox>
        </div>
      </a-form-item>
    </div>
    <a-tabs type="card">
      <a-tab-pane
        v-for="item in tabTrackers"
        :key="item.uuid"
        :closable="false"
        :tab="item.terminalName"
      >
        <TrackerConfigPane
          :obj="newObj"
          :terminalIds="terminalIds"
          :form="form"
          :events="matchEvents"
          :tracker="item"
          :isAdd="true"
          :reqPoolId="reqPoolId"
          :trackers="newObj.trackers"
        ></TrackerConfigPane>
      </a-tab-pane>
    </a-tabs>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import BatchAddBaseInfoForm from "./BatchAddBaseInfoForm.vue";
import TerminalConfigForm from "./TerminalConfigForm.vue";
import TrackerConfigPane from "./TrackerConfigPane.vue";
import TerminalAddModal from "./TerminalAddModal.vue";
import { CreateTempObjDto, ObjTypeEnum } from "@/types/object.type";
import { ReqStatusEnum } from "@/types/requirement.type";
import { EventSimpleDto } from "@/types/event.type";
import { getTerminalList } from "@/services/terminal.service";
import { addNewObject } from "@/services/object.service";
import { getEventList } from "@/services/event.service";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";
import { omit } from "@/ndsc-vue3/utils/lib";
import useFindAndroidAndIPhone from "hooks/Object/useFindAndroidAndIPhone";

import Bus from "@/bus";
export default defineComponent({
  name: "ObjectAddForm",
  components: {
    BatchAddBaseInfoForm,
    TerminalConfigForm,
    TrackerConfigPane,
  },
  props: {
    requireId: {},
    openTerminal: {
      type: String,
      default: "app",
    },
    openTerminalId: {
      type: Number,
      default: 11,
    },
    reqPoolId: {
      type: [Number, String] as PropType<number | string>,
    },
    parentIds: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    terminalIds() {
      return this.newObj.trackers.map((v) => v.terminalId).filter((v) => !!v);
    },
    isDisabled() {
      const list: any = [];

      this.newObj.trackers.forEach((ele) => {
        const option = this.terminals?.find(
          (item) => item.id === ele.terminalId
        );

        if (ele.terminalId && option.terminalType === "app") {
          list.push(ele);
        }
      });

      return list.length === 2;
    },
    requireIds() {
      return this.newObj.trackers.map((v) => v.requireId).filter((v) => !!v);
    },

    matchEvents() {
      return this.events.filter((v) =>
        v.applicableObjTypes.includes(this.objType)
      );
    },

    formRef() {
      return this.$refs.formRef;
    },

    tabTrackers() {
      const trackers = this.newObj.trackers
        .filter((item) => item.terminalId)
        .map((ele) => ({
          ...ele,
          terminalName: this.terminals?.find((e) => e.id === ele.terminalId)
            ?.name,
        }));

      const terminalMap: string[] = ["android", "iphone"];
      let hasCompact = false;

      if (!this.newObj.consistency) return trackers;

      return trackers.reduce((prev, next) => {
        next.terminalName = next.name || next.terminalName;

        if (terminalMap.includes(next.terminalName.toLowerCase())) {
          next.name = next.terminalName;
          if (hasCompact) return prev;
          next.terminalName = "Android/iPhone";
          prev.push(next);
          hasCompact = true;
        } else {
          prev.push(next);
        }

        return prev;
      }, []);
    },
  },

  data() {
    const _form = null;
    const _selectedTerminalIds: number[] = [];
    const _objType: ObjTypeEnum = ObjTypeEnum.PAGE;
    const _newObj: CreateTempObjDto & { eventParamVersionIdMap?: any } = {
      basics: [
        {
          uuid: uuidv4(),
          type: ObjTypeEnum.PAGE,
          oid: "",
          name: "",
          description: "",
          imgUrls: [],
          tags: [],
          priority: "P1",
          pathMap: [],
          bridgeSubAppId: "",
        },
      ],
      disabled: false,
      consistency: true,
      paramBinds: [],
      parentObjs: [],
      trackers: [],
    };
    const _events: EventSimpleDto[] = [];

    return {
      form: _form,
      objType: _objType,
      newObj: _newObj,
      events: _events,
      formState: {},
      rules: {},
      terminals: [],
      selectedTerminalIds: _selectedTerminalIds,
    };
  },

  async created() {
    const params = { currentPage: 1, pageSize: 80, search: "" };

    this.form = this.formRef;
    this.moduleRender();

    await getEventList(params).then((res) => {
      this.events = res.list;
    });

    this.newObj.parentObjs = this.parentIds;

    getTerminalList({ ...params, pageSize: 50 }).then((res) => {
      this.terminals = res.list;

      this.newObj.trackers = (res.list || []).flatMap((v) => {
        if (v.id !== this.openTerminalId || v.terminalType === "non_app")
          return [];

        const uuid = uuidv4();

        Object.assign(this.formState, {
          [`tracker-req-${uuid}`]: "",
          [`tracker-task-${uuid}`]: "",
        });

        return {
          uuid,
          terminalId: v.id,
          terminalName: v.name,
          requireId: this.requireId,
          taskId: undefined,
          eventIds: this.getDefaultEvents(ObjTypeEnum.PAGE),
          parentObjs: this.parentIds,
          paramBinds: [],
          status: ReqStatusEnum.START,
        };
      });
    });

    Bus.$on("objTypeChange", (type) => {
      this.objType = type;
      this.newObj.trackers.forEach((t) => {
        t.eventIds = this.getDefaultEvents(type);
      });
      this.$refs.formRef.resetFields();
    });
  },

  beforeUnmount() {
    Bus.$off("objTypeChange");
  },

  methods: {
    getDefaultEvents(type: ObjTypeEnum) {
      const events = this.events.filter((v) =>
        v.applicableObjTypes.includes(type)
      );

      return events.filter((v) => v.selectedByDefault).map((v) => v.id);
    },
    terminalChange() {},
    onConsistencyChange() {
      const trackers = useFindAndroidAndIPhone(this.newObj.trackers);

      trackers.forEach((v) => {
        v.terminalName = v.name || v.terminalName;
      });

      if (this.newObj.consistency) {
        const { parentObjs, paramBinds } = this.newObj.trackers[0];

        this.newObj.parentObjs = cloneDeep(parentObjs);
        this.newObj.paramBinds = cloneDeep(paramBinds);
      } else {
        if (trackers[1]) {
          trackers[1].parentObjs = (trackers[0].parentObjs || []).slice(0);
          trackers[1].eventIds = (trackers[0].eventIds || []).slice(0);
        }
      }
    },

    onParentObjsChange(v) {
      this.newObj.parentObjs = v;
    },
    fn(arr) {
      const indexArr = []; // 0  2
      const terminals = this.terminals;

      for (let i = 0; i < arr.length; i++) {
        if (
          terminals.find((ele) => ele.id === arr[i].terminalId).terminalType ===
          "app"
        ) {
          indexArr.push(i);
        }
      }
      const firstIndex = indexArr[0];
      const lastIndex = indexArr[1];

      arr[lastIndex].parentObjs = arr[firstIndex].parentObjs;
      arr[lastIndex].eventIds = arr[firstIndex].eventIds;
      arr[lastIndex].paramBinds = arr[firstIndex].paramBinds;

      return arr;
    },
    onEdit(key, action: "add" | "remove") {
      if (action === "remove") {
        const idx = this.newObj.trackers.findIndex((v) => v.uuid === key);

        this.newObj.trackers.splice(idx, 1);
        return;
      }

      this.$createInstance(TerminalAddModal, {
        terminalIds: this.terminalIds,
        onOk: (id, name) => {
          this.newObj.trackers.push({
            uuid: uuidv4(),
            terminalId: id,
            terminalName: name,
            requireId: undefined,
            taskId: undefined,
            eventIds: this.getDefaultEvents(this.objType),
            parentObjs: [],
            paramBinds: [],
            status: ReqStatusEnum.START,
          });
        },
      });
    },

    handleOk() {
      return new Promise((resolve, reject) => {
        this.$refs.formRef.validateFields().then(() => {
          const temp = omit(cloneDeep(this.newObj), [
            "paramBinds",
            "parentObjs",
            "eventParamsVersionIdMap",
            "disabled",
            "tags",
          ]);

          this.newObj.consistency && (temp.trackers = this.fn(temp.trackers));

          const data = {
            ...temp,
            reqPoolId: this.reqPoolId,
            basics: temp.basics.map((b) => {
              const item = omit(b, ["uuid", "pathMap", "routePathIds"]);

              return { ...item, tagIds: item.tags.map((v) => v.key ?? v.id) };
            }),
            trackers: temp.trackers.map((t) => {
              const item = omit(t, ["uuid", "terminalName"]);
              return {
                ...item,
                eventParamVersionIdMap:
                  item.eventParamVersionIdMap ||
                  temp.trackers[0]?.eventParamsVersionIdMap,
                eventParamsVersionIdMap: undefined,
                paramBinds: item.paramBinds.map((bv) => ({
                  paramId: bv.id,
                  description: bv.description,
                  values: bv.selectedValues,
                  notEmpty: bv.notEmpty,
                  must: bv.must,
                  isEncode: bv.isEncode,
                })),
              };
            }),
          };

          // @ts-ignore
          addNewObject(data)
            .then(() => {
              this.$message.success("添加成功");
              this.$emit("handlerOk");
              resolve(true);
            })
            .catch((e) => {
              this.$handleError(e, "添加");
              reject(new Error(""));
            });
        });
      });
    },
    changeChecked() {
      // 检查所选项里面有没有非app端
      const trackers = this.newObj.trackers;
      const result = trackers.some((ele) => {
        const { terminalId } = ele;
        const option = this.terminals.find((item) => item.id === terminalId);
        const flag = option?.terminalType === "non_app";

        return ele.terminalId && flag;
      });

      if ((trackers?.length === 2 && result) || trackers?.length === 1) {
        this.newObj.consistency = false;
        this.onConsistencyChange();
      }
    },
  },

  watch: {
    "newObj.trackers": {
      handler: "changeChecked",
      deep: true,
    },
  },
});
</script>
