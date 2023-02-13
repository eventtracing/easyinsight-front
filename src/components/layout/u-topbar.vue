<template>
  <div>
    <top-bar
      ref="topbar"
      :navigations="navigations"
      :starAppList="starAppList"
      :product-list="appList"
      :userName="user.userName"
      :product="app && app.name"
      @edit="handleEdit"
      @switchProduct="switchApp"
      @logout="logout"
    >
      <template #logo="">
        <img src="@/assets/logo.svg" alt="" />
      </template>
      <template #leftExtra>
        <a-dropdown
          :trigger="['click']"
          :align="align"
          overlayClassName="m-cluster-dropdown"
          :getPopupContainer="getPopupContainer"
          class="g-ml-8"
        >
          <a class="c-help__center" @click="(e) => e.preventDefault()">
            配置中心
            <CaretUpOutlined
              style="font-size: 10px; margin-left: 2px"
              v-if="visible"
            />
            <CaretDownOutlined
              style="font-size: 10px; margin-left: 2px"
              v-else
            />
          </a>
          <template #overlay>
            <a-menu theme="dark" class="m-cluster-menu">
              <a-menu-item :key="manage.id" v-for="manage in manageLists">
                <router-link :to="manage.to">{{ manage.name }}</router-link>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </top-bar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { TopBar } from "./topbar/index";
import { User, AppDto } from "@/types/app.type";
import loginService from "@/services/login.service";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  name: "u-topbar",
  components: {
    TopBar,
    CaretUpOutlined,
    CaretDownOutlined,
  },
  setup() {
    return {
      visible: false,
    };
  },
  computed: {
    manageLists() {
      return this.menuLists
        .filter((menu) => menu.code === 3 || menu.code === 4 || menu.code === 5)
        .map((v) => {
          const menu = this.navMap.get(v.code) || {};

          return { to: menu.to, name: v.menuName, id: v.code };
        });
    },

    align() {
      return {
        offset: [0, 0],
      };
    },

    navigations() {
      return [
        {
          key: "tracker",
          category: "埋点管理中心",
          order: 1,
          name: "埋点管理",
          iconName: "icon-tracker",
          url: "/tracker",
        },
        {
          key: "test",
          category: "埋点管理中心",
          order: 1,
          name: "埋点测试",
          iconName: "icon-test",
          url: "/test",
        },
      ];
    },

    topbar() {
      const topbar: typeof TopBar = this.$refs.topbar;
      return topbar;
    },

    user() {
      const user: User = this.$store.state.user;
      return user;
    },

    app() {
      const app: AppDto = this.$store.state.app;
      return app;
    },

    appList() {
      const appList: AppDto[] = this.$store.state.appList;
      return appList;
    },
  },

  data() {
    const _starAppList = ["tracker"];
    return {
      starAppList: _starAppList,
    };
  },

  created() {
    const starAppList = localStorage.getItem("starAppList");

    if (starAppList) {
      try {
        const arr = JSON.parse(starAppList);

        if (arr instanceof Array) {
          this.starAppList = arr;
        }
      } catch (e) {}
    }
  },

  methods: {
    handleEdit(starList: string[]) {
      this.starAppList = starList;
      localStorage.setItem("starAppList", JSON.stringify(starList));
      this.topbar && this.topbar.exitEditMode();
    },

    // TODO: 产品切换时体验优化
    switchApp(item: AppDto) {
      const { id } = item;

      if (this.app.id === id) {
        return;
      }

      const url = window.location.origin + `?appId=${id}`;
      window.location.replace(url);
    },

    logout() {
      loginService.logOut();
    },

    getPopupContainer() {
      return document.body;
    },
  },
});
</script>

<style scoped="true" lang="less">
.c-help__center {
  color: rgba(255, 255, 255, 0.72);
  margin-right: 10px;
  &:hover {
    color: #fff;
  }
}
</style>
