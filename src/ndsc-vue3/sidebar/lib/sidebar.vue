<template>
  <div
    :class="`mm-sidebar FBV FBJB ${
      collapsed ? 'menu-collapsed' : 'sidebar-menu'
    }`"
  >
    <div class="sidebar-top FBV">
      <div class="sidebar-title" v-if="navConfig.project">
        <div class="title FBH FBAC hand" @click="onProjectClick">
          <span class="img FBH">
            <icon-font
              v-if="navConfig.project.iconName"
              :type="navConfig.project.iconName"
              prefix=""
            ></icon-font>
            <VNode :vnodes="logo" v-if="navConfig.project.icon" />
          </span>
          <span class="name fs14">{{ navConfig.project.name }}</span>
        </div>
        <div
          v-if="navConfig.isConfigPage && !this.collapsed"
          class="ml58 mb8 ws-nw subtitle"
        >
          {{ navConfig.config.name }}
        </div>
        <div class="u-divider" />
      </div>

      <ul class="menu-container sub-menu">
        <VNode :vnodes="navVnodes" />
      </ul>
    </div>

    <div class="sidebar-bottom">
      <slot
        name="bottomExtra"
        :collapsed="collapsed"
        :isConfigPage="!!navConfig.isConfigPage"
      ></slot>
      <div
        class="menu-item config hand"
        v-if="
          navConfig.config && !navConfig.config.hide && !navConfig.isConfigPage
        "
      >
        <a-dropdown
          v-if="collapsed"
          placement="bottomRight"
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          overlayClassName="mm-sidebar-setting mm-sidebar-tooltip"
        >
          <div class="item pl30" @click="onConfigClick">
            <!-- <a-icon type="setting" class="mr14 icon" /> -->
            <span class="name fs14">{{ navConfig.config.name }}</span>
          </div>
          <template #overlay>
            <a-menu @click="onConfigClick">
              <a-menu-item>{{ navConfig.config.name }}</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <div class="item pl30 menu-config" v-else @click="onConfigClick">
          <span class="name fs14">{{ navConfig.config.name }}</span>
        </div>
      </div>
      <div :class="`collapsed-container`" @click="toggleCollapsed">
        <div class="u-divider" />
        <div :class="`icon ${collapsed ? 'collapsed' : ''}`">
          <MenuUnfoldOutlined v-if="collapsed" />
          <MenuFoldOutlined v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { defineComponent, h } from "vue";
import { _RouteLocationBase } from "vue-router";
import { Dropdown, Menu, Divider } from "ant-design-vue";
import { NavListDto, MenuIncludeDto } from "./interface";

import {
  DownOutlined,
  UpOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons-vue";
import VNode from "./VNode";

export default defineComponent({
  name: "SideBar",
  components: {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    VNode,
    DownOutlined,
    UpOutlined,
    Dropdown,
    Menu,
    Divider,
  },
  setup() {
    return {
      popoverDom: null,
    };
  },
  props: {
    navConfig: {},
    defaultCloseIds: {
      default: (): any => [],
    },
    collapsedPosition: {
      default: "bottom",
    },
    inlineCollapsed: {
      default: false,
    },
  },

  data() {
    const _currentPath = "";
    const _collapsed = this.inlineCollapsed;
    const _currentList: string[] = [];
    const _openKeys: string[] = [];

    return {
      currentPath: _currentPath,
      collapsed: _collapsed,
      currentList: _currentList,
      openKeys: _openKeys,
      navVnodes: null,
      logo: null,
    };
  },
  created() {
    this.getMenu();
  },
  methods: {
    getLogo() {
      const icon = this.navConfig.project.icon;
      let dom;

      if (typeof icon === "string") {
        dom = this.$slots[icon];
      } else if (typeof icon === "function") {
        dom = icon(h);
      } else dom = icon;
      return dom;
    },
    getCommonEl(item: NavListDto, deep: number) {
      let iconDom;
      switch (item.iconType) {
        case "svgIcon":
          iconDom = (
            <svgicon
              name={item.icon}
              width="1em"
              height="1em"
              color={this.getColor(item.id)}
              class="nav-icon"
            ></svgicon>
          );
          break;
        case "custom":
          if (typeof item.icon === "string") {
            iconDom = this.$slots[item.icon];
          } else if (typeof item.icon === "function") {
            iconDom = item.icon(h);
          }
          break;
        default:
          break;
      }

      let commonClass = "";

      if (this.collapsed) {
        commonClass = "FBJC";

        if (this.currentList.indexOf(item.id) > -1) {
          commonClass += " menu-item-selected";
        }
      }

      const commonDom = (
        <div
          class={`FBH FBAC hand item ${commonClass}`}
          style={{
            paddingLeft: this.collapsed ? 0 : deep * 30 + "px",
            width: "100%",
            height: "100%",
          }}
        >
          {item.icon ? (
            <span class={`item-icon ${this.collapsed ? "" : "mr14"} fs14`}>
              <i class="FBH FBAC">{iconDom}</i>
            </span>
          ) : (
            ""
          )}
          <span class="name fs14">{item.name}</span>
        </div>
      );

      if (!this.collapsed || deep !== 1) return commonDom;

      if (item.children?.length) {
        const slots = {
          overlay: () => (
            <Menu>
              <Menu.ItemGroup title={item.name} />
              <Divider />
              {this.getPopoverContent(item.children)}
            </Menu>
          ),
        };
        return (
          <div style="width: 100%; height: '100%'">
            <Dropdown
              v-slots={slots}
              placement="bottomRight"
              getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
              overlayClassName="mm-sidebar-dropdown"
              style="width: 100%; height: 100%; display: flex; align-items: center;"
            >
              {commonDom}
            </Dropdown>
          </div>
        );
      } else {
        const otherSlots = {
          overlay: () => (
            <Menu>
              <Menu.ItemGroup title={item.name} />
            </Menu>
          ),
        };
        return (
          <Dropdown
            v-slots={otherSlots}
            placement="bottomRight"
            getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
            overlayClassName="mm-sidebar-tooltip"
          >
            {commonDom}
          </Dropdown>
        );
      }
    },
    getPopoverContent(list: NavListDto[]) {
      return list.map((item) => {
        if (item.children?.length) {
          return (
            <Menu.SubMenu key={item.id} title={item.name}>
              {this.getPopoverContent(item.children)}
            </Menu.SubMenu>
          );
        } else {
          return (
            <Menu.Item>
              <router-link to={item.to}>
                <div
                  class="item-wrapper no-user-select"
                  onClick={() => this.onItemNavClick(item)}
                >
                  {item.name}
                </div>
              </router-link>
            </Menu.Item>
          );
        }
      });
    },
    getMenuNewList(list: NavListDto[], deep: number) {
      const domList = list.map((item) => {
        if (item.children?.length && !item.hide) {
          const isOpen = this.openKeys.indexOf(item.id) > -1;
          return (
            <li class="" key={item.id}>
              <div
                class={`menu-item FBH FBAC ${this.collapsed ? "" : "pr12"}`}
                onClick={() => {
                  if (!this.collapsed) {
                    if (isOpen) {
                      this.openKeys = this.openKeys.filter(
                        (dd) => dd !== item.id
                      );
                    } else {
                      this.openKeys.push(item.id);
                    }

                    this.navVnodes = this.getMenuNewList(
                      this.navConfig.menu,
                      1
                    );
                  }
                }}
              >
                {this.getCommonEl(item, deep)}
                {this.collapsed ? null : isOpen ? (
                  <DownOutlined />
                ) : (
                  <UpOutlined />
                )}
              </div>
              {this.openKeys.indexOf(item.id) > -1 && !this.collapsed && (
                <ul class="sub-menu">
                  {this.getMenuNewList(item.children, deep + 1)}
                </ul>
              )}
            </li>
          );
        } else if (!item.hide) {
          return (
            <li key={item.id}>
              <router-link
                class={`menu-item FBH FBAC hand ${
                  this.currentList.indexOf(item.id) > -1
                    ? "menu-item-selected"
                    : ""
                }`}
                to={item.to}
              >
                <div
                  class="item-wrapper"
                  onClick={() => this.onItemNavClick(item)}
                >
                  {this.getCommonEl(item, deep)}
                </div>
              </router-link>
            </li>
          );
        }

        return null;
      });

      return domList;
    },
    onProjectClick() {
      const { to } = this.navConfig.project;
      this.$emit("onProjectClick");

      if (to) {
        this.$router.push(to).catch(() => {});
      } else {
        this.$router.push("/").catch(() => {});
      }
    },
    getAllOpenKeys(tree) {
      tree.forEach((item) => {
        if (
          item.children?.length &&
          this.defaultCloseIds.indexOf(item.id) === -1
        ) {
          this.openKeys.push(item.id);
          this.getAllOpenKeys(item.children);
        }
      });
    },
    onConfigClick() {
      window.open(this.navConfig.config.to);
    },
    getMenu() {
      this.getAllOpenKeys(this.navConfig.menu);
      const path = this.$route.path;
      this.currentList = this.getCurrentMenuKey(path);
      const leafArr = this.getLeafParent(this.navConfig.menu);
      const currentLeaf = leafArr.find((item: NavListDto) =>
        path.startsWith(item.to)
      );

      if (currentLeaf && currentLeaf.parent) {
        this.openKeys.push(...currentLeaf.parent);
        this.openKeys = Array.from(new Set(this.openKeys));
      }
    },
    getLeafParent(list: NavListDto[], parent?: any) {
      const arr: any = [];
      list.forEach((item: any) => {
        if (parent) {
          item.parent = [parent.id, ...(parent.parent || [])];
        }

        if (item.children?.length) {
          arr.push(...this.getLeafParent(item.children, item));
        } else {
          arr.push(item);
        }
      });
      return arr;
    },
    getColor(id: string) {
      return this.currentList.indexOf(id) > -1 && this.collapsed
        ? "#103ffa"
        : "currentColor";
    },
    getChildMenuFromArray(arr: NavListDto[]) {
      const keyArr: MenuIncludeDto[] = [];

      arr.forEach((item: NavListDto) => {
        if (item.children?.length) {
          keyArr.push(...this.getChildMenuFromArray(item.children));
        } else {
          keyArr.push({
            id: item.id,
            tab: [item.to, ...(item.includeTab || [])],
          });
        }
      });

      return keyArr;
    },
    getFirstMenuFromArray(menu: NavListDto[], deep?: number) {
      const newArr: MenuIncludeDto[] = [];
      menu.forEach((item) => {
        if (item.children?.length && deep) {
          newArr.push({
            id: item.id,
            tab: [],
          });
        }
      });
      newArr.forEach((item) => {
        const currentItem = menu.find((dd) => dd.id === item.id);
        this.getLeafTab(currentItem.children, item);
      });
      return newArr;
    },
    getLeafTab(arr: NavListDto[], current: MenuIncludeDto) {
      arr.forEach((dd) => {
        if (dd.children?.length) {
          this.getLeafTab(dd.children, current);
        } else {
          current.tab.push(dd.to, ...(dd.includeTab || []));
        }
      });
    },
    getCurrentMenuKey(path: string) {
      const arr = this.getChildMenuFromArray(this.navConfig.menu);
      const firstLevelArr = this.getFirstMenuFromArray(this.navConfig.menu, 1);
      const currentMenu = arr.find(
        (item) => item.tab.findIndex((dd) => path.startsWith(dd)) > -1
      );

      const firstLevelCurrentMenu = firstLevelArr.find(
        (item) => item.tab.findIndex((dd: string) => path.startsWith(dd)) > -1
      );

      const list = [
        currentMenu && currentMenu.id,
        firstLevelCurrentMenu && firstLevelCurrentMenu.id,
      ];

      return list;
    },
    onItemNavClick(item: NavListDto) {
      if (item.to === this.currentPath) return;

      this.$emit("onMenuItemClick", item);
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
      this.getMenu();
      this.navVnodes = this.getMenuNewList(this.navConfig.menu, 1);
      this.$emit("collapsedChange", this.collapsed);
    },
    onUrlChange(to: _RouteLocationBase) {
      this.currentPath = (to && to.path) || "";
      this.getMenu();
      this.navVnodes = this.getMenuNewList(this.navConfig.menu, 1);
    },
    updateNavList() {
      this.getMenu();
      this.logo = this.getLogo();
      this.navVnodes = this.getMenuNewList(this.navConfig.menu, 1);
    },
    setCurrent(value: string) {
      this.currentList = this.getCurrentMenuKey(value) as string[];
    },
  },
  watch: {
    $route: {
      handler: "onUrlChange",
      immediate: true,
      deep: true,
    },
    navConfig: {
      handler: "updateNavList",
      immediate: true,
    },
    currentPath: {
      handler: "setCurrent",
    },
  },
});
</script>

<style lang="less">
@import "./sidebar.less";
// @import './flexbox.css';

.mm-sidebar {
  .ant-divider-horizontal {
    margin: 4px 0;
  }
}
</style>
