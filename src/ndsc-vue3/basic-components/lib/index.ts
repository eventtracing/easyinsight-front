/**
 * 通用型基础组件
 */
import UDrawer from "./components/u-drawer";
import UModal from "./components/u-modal";
import UTextTooltip from "./components/u-text-tooltip";
import UHintTooltip from "./components/u-hint-tooltip";
import UIconFont from "./components/u-icon-font";
import UStatusIcon from "./components/u-status-icon";
import UIconButton from "./components/u-icon-button";
import UTextButton from "./components/u-text-button";
import UCopy from "./components/u-copy";

/**
 * 偏业务型基础组件
 */
import SSyncButton from "./components/s-sync-button";

/**
 * 指令
 */
import VDragSize from "./directives/v-drag-size";
import VInputNumber from "./directives/v-input-number";
import VEllipsisTitle from "./directives/v-ellipsis-title";
import VClickOutside from "./directives/v-click-outside";
import VCopy from "./directives/v-copy";

const components = [
  UDrawer,
  UHintTooltip,
  UIconButton,
  UIconFont,
  UModal,
  UStatusIcon,
  UTextButton,
  UTextTooltip,
  UCopy,
  SSyncButton,
];

const directives = [
  VDragSize,
  VInputNumber,
  VEllipsisTitle,
  VClickOutside,
  VCopy,
];

const install = function (Vue: any) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });

  directives.forEach((directive: any) => {
    Vue.directive(directive.name, directive);
  });
};

export {
  install,
  UDrawer,
  UHintTooltip,
  UIconButton,
  UIconFont,
  UModal,
  UStatusIcon,
  UTextButton,
  UTextTooltip,
  UCopy,
  SSyncButton,
  VDragSize,
  VInputNumber,
  VEllipsisTitle,
  VClickOutside,
  VCopy,
};

export default {
  install,
};
