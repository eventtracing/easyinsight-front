<template>
  <a-modal
    width="620px"
    :title="modalTitle"
    :visible="showModal"
    @cancel="showModal = false"
    @ok="sureMember"
  >
    <template v-if="showBatchAdd">
      <div>
        <p>
          每行一条数据（回车换行），两列间通过空格分隔。支持粘贴多行文本添加。
        </p>
        <a-textarea
          class="g-mb-16"
          :rows="4"
          v-model="batchUserText"
          placeholder="示例：甄美丽 zhenkeai@163.com"
        />
      </div>
    </template>
    <template v-else>
      <a-form
        :model="formState"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        ref="formRef"
      >
        <div
          class="flex-ac"
          v-for="(member, index) in memberLists"
          :key="member.uuid"
        >
          <a-form-item label="成员" :name="`name${member.uuid}`">
            <a-input
              placeholder="请输入成员姓名"
              @change="(e) => (member.userName = e.target.value)"
              v-model:value="formState[`name${member.uuid}`]"
            />
          </a-form-item>
          <a-form-item
            label="邮箱账号"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 16 }"
            required
            :name="`email${member.uuid}`"
          >
            <a-input
              placeholder="请输入成员邮箱"
              type="email"
              @change="(e) => (member.email = e.target.value)"
              style="width: 250px"
              :name="'email' + member.uuid"
              v-model:value="formState[`email${member.uuid}`]"
            />
          </a-form-item>
          <icon-font
            type="icon-remove"
            class="m-icon__font g-ml-8"
            @click="removeMember(index)"
            v-if="memberLists.length > 1"
          />
        </div>
      </a-form>
    </template>
    <div class="flex-ac" dir="rtl" v-if="!isEdit">
      <span class="text-link" @click="showBatchAdd = false" v-if="showBatchAdd">
        返回
      </span>
      <template v-else>
        <span class="text-link g-ml-4" @click="showBatchAdd = true">
          批量添加
        </span>
        <span class="text-link" @click="addMemeber">添加</span>
      </template>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { v4 as uuidv4 } from "uuid";
import { addUser, editUser } from "@/services/authority.service";
import { UserDto } from "@/types/authority.type";
interface MemberDto extends UserDto {
  uuid: string;
  roles: any;
}
export default defineComponent({
  name: "OptionMember",
  props: {
    status: {
      type: String,
      default: "add",
      required: false,
    },
    member: {
      type: Object,
      default: () => {},
      required: false,
    },
    visible: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    modalTitle() {
      return (this.status === "add" ? "新增" : "编辑") + "成员";
    },

    isEdit() {
      return this.status === "edit";
    },

    showModal: {
      get() {
        return this.visible;
      },

      set(value) {
        this.$emit("update:visible", value);
      },
    },

    formRef() {
      return this.$refs.formRef;
    },
  },

  data() {
    const _form = null;
    const _batchUserText = "";
    const _showBatchAdd = false;
    const _memberTemplate: MemberDto = {
      userName: "",
      email: "",
      apps: [],
      roles: null,
      userId: null,
      createTime: "",
      uuid: uuidv4(),
    };
    const _memberLists: MemberDto[] = [_memberTemplate]; // 添加成员项

    // 添加成员项
    return {
      form: _form,
      batchUserText: _batchUserText,
      showBatchAdd: _showBatchAdd,
      memberTemplate: _memberTemplate,
      memberLists: _memberLists,
      rules: {},
      formState: {},
    };
  },
  methods: {
    // 添加成员项
    addMemeber() {
      this.memberLists.push({ ...this.memberTemplate, uuid: uuidv4() });
    },

    // 删除成员项
    removeMember(index) {
      this.memberLists.splice(index, 1);
    },

    // 单个添加
    sureSingleMember() {
      this.$refs.formRef.validateFields().then(() => {
        const users = this.memberLists.map((v) => ({
          userName: v.userName,
          email: v.email,
        }));
        this.isEdit ? this.editUser(users[0]) : this.addUser(users);
      });
    },

    // 批量添加
    sureBatchMember() {
      const users = this.batchUserText.split("\n").map((v) => {
        const data = v.split(/\s+/);
        return {
          userName: data[0],
          email: data[1],
        };
      });
      if (users.some((v) => !v.email || !v.userName))
        return this.$message.error("请输入正确的格式: 姓名 + 邮箱");
      this.addUser(users);
    },

    addUser(users) {
      addUser({
        users,
        range: 1,
        location: +window.localStorage.domainId,
      }).then(() => {
        this.$message.success("新增成功");
        this.showModal = false;
        this.$emit("getMemberLists");
      });
    },

    editUser(user) {
      editUser({
        roleIds: (this.member.roles || []).map((v) => v.id),
        userId: this.member.userId,
        email: user.email,
        userName: user.userName,
      }).then(() => {
        this.$message.success("编辑成功");
        this.showModal = false;
        this.$emit("getMemberLists");
      });
    },

    // 确定成员
    sureMember() {
      if (this.showBatchAdd) {
        this.sureBatchMember();
      } else {
        this.sureSingleMember();
      }
    },

    resetFields(status) {
      if (!status) {
        this.memberLists = [this.memberTemplate];
        this.$refs.formRef.resetFields();
        this.batchUserText = "";
        this.showBatchAdd = false;
      }
    },

    initMember(member) {
      const key = this.memberTemplate.uuid;
      this.$nextTick(() => {
        this.memberLists[0].userName = member.userName;
        this.memberLists[0].email = member.email;
        this.formState = {
          ["name" + key]: member.userName,
          ["email" + key]: member.email,
        };
      });
    },
  },
  watch: {
    showModal: {
      handler: "resetFields",
    },
    member: {
      handler: "initMember",
    },
    memberLists: {
      handler(memberList) {
        this.formState = {};
        this.rules = memberList.reduce((prev, member) => {
          const uuid = member.uuid;
          const rules = {
            [`name${uuid}`]: [{ message: "请输入名称" }],
            [`email${uuid}`]: [
              { required: true, message: "请输入邮箱账号" },
              {
                message: "请输入正确的邮箱",
                pattern: /^\w+@[a-zA-Z]+.[a-zA-Z]/,
              },
            ],
          };
          this.formState[`name${uuid}`] = member.userName;
          this.formState[`email${uuid}`] = member.email;
          Object.assign(prev, rules);
          return prev;
        }, {});
      },
      immediate: true,
    },
  },
});
</script>

<style lang="less">
.m-icon__font {
  font-size: 16px;
  margin-bottom: 18px;
  cursor: pointer;
  user-select: none;
}
</style>
