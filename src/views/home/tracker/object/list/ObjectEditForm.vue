<template>
  <a-form
    :model="formState"
    v-if="editObj"
    class="small-12"
    style="padding-left: 0"
    :colon="false"
    labelAlign="left"
    ref="formRef"
    :rules="rules"
  >
    <BaseInfoForm
      :obj="editObj"
      :isChange="isChange"
      :disabled="isPreview || disabled"
      :operatorChangeType="operatorChangeType"
      :canTypeAndOidEdit="!disabled && canTypeAndOidEdit"
      :hasNoStartStatus="hasNoStartStatus"
      :isDetail="isPreview"
      :partEditAuth="partEditAuth"
      :events="matchEvents"
      :id="id"
      :reqPoolId="reqPoolId"
      :historyId="historyId"
      @consistencyChange="onConsistencyChange"
    />
    <TerminalConfigForm
      :disabled="isPreview || disabled"
      :form="form"
      :events="matchEvents"
      :newObj="editObj"
      :isEdit="!isChange"
      :trackers="editObj.trackers"
      :terminals="terminals"
      :operatorChangeType="operatorChangeType"
      :formState="formState"
      :terminalIds="terminalIds"
      :isDetail="isPreview"
      :isDiff="isDiff"
      v-if="defferMoule > 20"
    />
    <div></div>
    <div class="g-pl-12">
      <a-form-item
        label="其他项配置模式"
        style="width: 1000px"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <div class="flex" style="align-items: center">
          <a-checkbox
            v-model:checked="editObj.consistency"
            :disabled="isPreview || editObj.disabled || disabled || !isDisabled"
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
          :form="form"
          :events="isDiff ? item.events : matchEvents"
          :id="id"
          :obj="editObj"
          :rules="rules"
          :reqPoolId="reqPoolId"
          :type="editObj.type"
          :terminalIds="terminalIds"
          :tracker="item"
          :formState="formState"
          :trackers="editObj.trackers"
          :itemKey="item.uuid"
          :isDiff="isDiff"
          :disabled="isPreview || (!canTerminalEdit(item.status) && disabled)"
        />
      </a-tab-pane>
    </a-tabs>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import BaseInfoForm from "./BaseInfoForm.vue";
import TerminalConfigForm from "./TerminalConfigForm.vue";
import TrackerConfigPane from "./TrackerConfigPane.vue";
import TerminalAddModal from "./TerminalAddModal.vue";
import { EditTempObjDto, ObjDetailDto, ObjTypeEnum } from "@/types/object.type";
import { ReqStatusEnum } from "@/types/requirement.type";
import { EventSimpleDto } from "@/types/event.type";
import {
  getHistoryObjectDetail,
  getByReqPoolIdWithDiff,
  getByReqPoolIdAndHistoryIdWithDiff,
  getChangeDetail,
  updateObject,
  changeObject,
  UpdateBasicsInfo,
  getBaseLineDiff,
} from "@/services/object.service";
import { getEventList } from "@/services/event.service";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";
import { omit } from "@/ndsc-vue3/utils/lib";
import Bus from "@/bus";
import { getTerminalList } from "@/services/terminal.service";
import useFindAndroidAndIPhone from "hooks/Object/useFindAndroidAndIPhone";

export default defineComponent({
  name: "ObjectEditForm",
  components: {
    BaseInfoForm,
    TerminalConfigForm,
    TrackerConfigPane,
  },
  props: {
    reqPoolId: {
      type: [Number, String] as PropType<number | string>,
    },
    id: {},
    record: {},
    operatorChangeType: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    trackerId: {},
    historyId: {
      type: [Number, String] as PropType<number | string>,
    },
    requireId: {},
    isChange: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    isDiff: {
      type: Boolean,
      default: false,
    },
    isBaseDiff: {
      type: Boolean,
      default: false,
    },
    editDiff: {
      // 解决冲突
      type: Boolean,
      default: false,
    },
    partEditAuth: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    terminalIds() {
      return this.editObj.trackers.map((v) => v.terminalId).filter((v) => !!v);
    },

    requireIds() {
      return [
        ...new Set(
          this.editObj.trackers.map((v) => v.requireId).filter((v) => !!v)
        ),
      ];
    },

    hasNoStartStatus() {
      if (this.isChange) return false;

      if (this.editObj && this.editObj.trackers) {
        return this.editObj.trackers.some(
          (t) => t.status !== ReqStatusEnum.START
        );
      }

      return false;
    },
    isDisabled() {
      const list: any = [];

      this.editObj.trackers.forEach((ele) => {
        const option = this.terminals?.find(
          (item) => item.id === ele.terminalId
        );

        if (ele.terminalId && option?.terminalType === "app") {
          list.push(ele);
        }
      });

      return list.length === 2;
    },
    matchEvents() {
      const filterEvents = this.events.filter((v) =>
        v.applicableObjTypes.includes(this.objType)
      );

      return filterEvents;
    },

    formRef() {
      return this.$refs.formRef;
    },

    tabTrackers() {
      if (!this.editObj.trackers.length || !this.terminals.length) return [];

      const trackers = this.editObj.trackers
        .filter((item) => item.terminalId)
        .map((ele) => ({
          ...ele,
          terminalName: this.terminals?.find((e) => e.id === ele.terminalId)
            ?.name,
        }));

      const terminalMap: string[] = ["android", "iphone"];
      let hasCompact = false;

      if (!this.editObj.consistency) return trackers;

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
    const // 是否禁止
      _form = null;
    const _detail: ObjDetailDto = null;
    const _editObj: EditTempObjDto = null;
    const _canTypeAndOidEdit = true;
    const _objType: ObjTypeEnum = ObjTypeEnum.PAGE;
    const _events: EventSimpleDto[] = [];

    return {
      form: _form,
      detail: _detail,
      editObj: _editObj,
      canTypeAndOidEdit: _canTypeAndOidEdit,
      objType: _objType,
      events: _events,
      formState: { changeType: null },
      rules: {},
      terminals: [],
      tagSettingForm: {},
    };
  },

  async created() {
    if (this.isChange) {
      this.detail = await getChangeDetail({
        objId: this.id,
        historyId: this.historyId,
      });
    } else {
      let api = getHistoryObjectDetail;
      const params = {
        objId: this.id,
        reqPoolId: this.reqPoolId,
        ...(this.historyId
          ? {
              historyId: this.historyId || undefined,
            }
          : this.trackerId
          ? {
              trackerId: this.trackerId,
            }
          : {
              reqPoolId: this.reqPoolId,
            }),
      };

      this.isDiff &&
        (api =
          "historyId" in params
            ? getByReqPoolIdAndHistoryIdWithDiff
            : getByReqPoolIdWithDiff);
      this.isBaseDiff && (api = getBaseLineDiff);

      this.detail = await api(params);
    }

    this.moduleRender();
    this.form = this.formRef;

    const {
      type,
      oid,
      name,
      description,
      imgUrls,
      consistency,
      trackers = [],
      tags,
      editOidOrType,
      priority,
      bridgeSubAppId,
      specialType = "normal",
      basicTag = {},
    } = this.detail;
    this.objType = type;
    this.canTypeAndOidEdit = editOidOrType;
    this.isChange && (this.canTypeAndOidEdit = false);

    const resolvedTrackers = trackers.map((item) => {
      const {
        eventParamVersionDiff, // diff的版本
        terminalVersion, // 端版本
        eventParamVersionIdMap, // 事件公参版本Map
        pubParamPackageId, // 全局公参参数包ID,
        pubParamPackageIdDiff,
        terminal, // 终端
        events, // 关联事件
        parentObjects, // 父级
        privateParam, // 私参
        status,
      } = item as any;

      return {
        eventParamVersionDiff,
        terminalVersion,
        pubParamPackageId,
        pubParamPackageIdDiff,
        eventParamVersionIdMap,
        uuid: uuidv4(),
        id: item.id,
        terminalId: terminal.id,
        terminalName: terminal.name,
        requireId: this.reqPoolId,
        eventIds: events.map((v) => v.id),
        parentObjs: parentObjects.map((v) => v.id),
        parentObjsDiff: parentObjects,
        paramBinds: cloneDeep(privateParam || []).map((v) => ({
          ...v,
          uuid: uuidv4(),
        })),
        status: status,
        events,
      };
    });

    const tagValues = tags.map((item) => ({ key: item.id, value: item.name }));

    // 初始化详情
    this.$emit("initDetailData", this.detail);

    this.tagSettingForm = {
      tags: tagValues,
      ...basicTag,
      cidTagInfos: this.detail.cidTagInfos,
      analyseCid: this.detail.analyseCid,
    };

    this.editObj = {
      id: this.id,
      type: type,
      oid: oid,
      name: name,
      description: description,
      imgUrls: imgUrls || [],
      tags: tagValues,
      priority: priority,
      consistency: consistency,
      paramBinds: [],
      parentObjs: [],
      trackers: resolvedTrackers,
      disabled: false,
      bridgeSubAppId,
      specialType,
    };

    if (consistency && resolvedTrackers.length) {
      const paramBinds = resolvedTrackers[0].paramBinds || [];
      this.editObj.parentObjs = cloneDeep(resolvedTrackers[0].parentObjs);
      this.editObj.paramBinds = cloneDeep(
        paramBinds && paramBinds.length
          ? paramBinds
          : resolvedTrackers[1]?.paramBinds || []
      );
    }

    const search = { currentPage: 1, pageSize: 80, search: "" };

    getEventList(search).then((res) => {
      this.events = res.list;
    });

    Bus.$on("objTypeChange", (type) => {
      this.objType = type;
      this.editObj.trackers.forEach((t) => {
        t.eventIds = this.getDefaultEvents(type);
      });
    });

    Bus.$on("tagFormChange", (values) => {
      this.tagSettingForm = values;
    });

    getTerminalList({ ...search, pageSize: 50 }).then((res) => {
      this.terminals = res.list;
    });
  },

  beforeUnmount() {
    Bus.$off("objTypeChange");
    Bus.$off("tagFormChange");
  },

  methods: {
    getDefaultEvents(type: ObjTypeEnum) {
      const events = this.events.filter((v) =>
        v.applicableObjTypes.includes(type)
      );

      return events.filter((v) => v.selectedByDefault).map((v) => v.id);
    },

    /**
     * 端对象是否可编辑，开始状态的端对象可编辑
     */
    canTerminalEdit(status: ReqStatusEnum) {
      if (this.isChange) return true;

      return status === ReqStatusEnum.START;
    },

    onConsistencyChange() {
      const trackers = useFindAndroidAndIPhone(this.editObj.trackers);
      trackers.forEach((v) => {
        v.terminalName = v.name || v.terminalName;
      });

      if (this.editObj.consistency) {
        const { parentObjs, paramBinds } = this.editObj.trackers[0];

        this.editObj.parentObjs = cloneDeep(parentObjs);
        this.editObj.paramBinds = cloneDeep(paramBinds);
      } else {
        if (trackers[1]) {
          trackers[1].parentObjs = (trackers[0].parentObjs || []).slice(0);
          trackers[1].eventIds = (trackers[0].eventIds || []).slice(0);
        }
      }
    },

    onParentObjsChange(v) {
      this.editObj.parentObjs = v;
    },

    handleDataConsistence(arr) {
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
      arr[lastIndex].eventParamsVersionIdMap =
        arr[firstIndex].eventParamsVersionIdMap;

      return arr;
    },
    onEdit(key, action: "add" | "remove") {
      if (action === "remove") {
        const idx = this.editObj.trackers.findIndex((v) => v.uuid === key);

        this.editObj.trackers.splice(idx, 1);
        return;
      }

      this.$createInstance(TerminalAddModal, {
        terminalIds: this.terminalIds,
        onOk: (id, name) => {
          this.editObj.trackers.push({
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
        this.$refs.formRef
          .validateFields()
          .then(() => {
            const temp = omit(cloneDeep(this.editObj), [
              "paramBinds",
              "parentObjs",
              "tags",
              "routePathIds",
              "eventParamsVersionIdMap",
            ]);

            if (this.editObj.consistency) {
              const res = this.handleDataConsistence(temp.trackers);
              temp.trackers = res;
            }

            const { tags, cidTagInfos, analyseCid, bizGroup, objSubType } =
              this.tagSettingForm;

            const data = {
              ...temp,
              resolveConflict: this.editDiff,
              reqPoolId: this.reqPoolId,
              tagIds: tags.map((v) => v.key),
              cidTagInfos,
              basicTag: { bizGroup, objSubType },
              analyseCid,
              historyId: this.historyId,
              trackers: temp.trackers.map((t: any) => {
                const item = omit(t, ["uuid", "terminalName"]);

                return {
                  ...item,
                  eventParamsVersionIdMap: undefined,
                  eventParamVersionIdMap:
                    t.eventParamsVersionIdMap ||
                    temp.trackers[0]?.eventParamsVersionIdMap,
                  paramBinds: item.paramBinds.map((bv) => ({
                    id: bv.id,
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

            const { onlineRecord = false } = this.detail;

            if (onlineRecord) {
              // 如果已上线，只能编辑优先级等四个字段，并且调用的接口也不相同
              this.handlePartSubmit();
              return;
            }

            if (this.isChange) {
              changeObject(data)
                .then(() => {
                  this.$message.success("变更成功");
                  resolve(data);
                })
                .catch((e) => {
                  this.$handleError(e, "变更");
                  reject(new Error(""));
                });
              return;
            }

            updateObject(data)
              .then(() => {
                this.$message.success("编辑成功");
                resolve(data);
                this.$emit("handlerOk");
                this.$emit("refresh");
              })
              .catch((e) => {
                this.$handleError(e, "编辑");
                reject(new Error(""));
              });
          })
          .catch((error) => {
            this.$message.error("请补全信息");
            reject(new Error(error));
          });
      });
    },

    handlePartSubmit() {
      const {
        priority,
        imgUrls,
        description,
        type,
        id,
        name,
        oid,
        specialType,
      } = this.editObj;
      const { tags, cidTagInfos, analyseCid, bizGroup, objSubType } =
        this.tagSettingForm;

      return new Promise((resolve, reject) => {
        UpdateBasicsInfo({
          priority,
          imgUrls,
          description,
          type,
          id,
          name,
          oid,
          reqPoolId: this.reqPoolId,
          specialType,
          tagIds: tags.map((tag) => tag.key),
          basicTag: { bizGroup, objSubType },
          analyseCid,
          cidTagInfos,
        })
          .then(() => {
            this.$message.success("保存成功");
            resolve(this.editObj);
            this.$emit("handlerOk");
            this.$emit("refresh");
          })
          .catch((e) => {
            this.$handleError(e, "保存");
            return reject(new Error(""));
          });
      });
    },

    changeChecked() {
      // 检查所选项里面有没有非app端
      const trackers = this.editObj.trackers;
      const result = trackers?.some((ele) => {
        const option = this.terminals.find(
          (item) => item.id === ele.terminalId
        );

        return ele.terminalId && option?.terminalType === "non_app";
      });

      if ((trackers?.length === 2 && result) || trackers?.length === 1) {
        this.editObj.consistency = false;
        this.onConsistencyChange();
      }
    },
  },
  watch: {
    "editObj.trackers": {
      handler: "changeChecked",
      deep: true,
    },
  },
});
</script>
