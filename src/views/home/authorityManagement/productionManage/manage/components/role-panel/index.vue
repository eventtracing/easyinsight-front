<template>
  <div class="fill role-panel-wrapper">
    <div style="margin-bottom: 20px">
      <span class="role-name">{{ detail.roleName || '' }}</span>
      {{ detail.description ? ` : ${detail.description}` : '' }}
    </div>
    <div v-if="detail.id">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="成员">
          <member-tab :roleId="detail.id"></member-tab>
        </a-tab-pane>
        <a-tab-pane key="2" tab="功能权限" force-render="">
          <auth-tab
            :disabled="detail.builtin"
            :builtin="detail.builtin"
            :roleId="detail.id"
            @fetchRoleList="
              () => {
                this.$emit('fetchRoleList')
              }
            "
          ></auth-tab>
        </a-tab-pane>
      </a-tabs>
    </div>
    <a-empty v-else></a-empty>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MemberTab from '../member-tab/index.vue'
import AuthTab from '../auth-tab/index.vue'
export default defineComponent({
  name: 'RolePanel',
  components: {
    'member-tab': MemberTab,
    'auth-tab': AuthTab
  },
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  }
})
</script>

<style scoped="true" lang="less">
.role-panel-wrapper {
  flex: 1;
  padding: 20px;

  .role-name {
    color: #000000;
  }
}
</style>
