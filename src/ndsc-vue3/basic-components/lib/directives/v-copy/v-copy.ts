// @ts-nocheck
import { copy } from "../../utils/clipboard";
import { message } from "ant-design-vue";

const clear = (el) => {
  if (el._clickHanlder) {
    el.removeEventListener("click", el._clickHanlder);
  }
  delete el._clickHanlder;
};

const bind = (el, value) => {
  el._clickHanlder = function clickHandler() {
    const disabled = el.getAttribute("disabled");
    if (disabled !== null) return;

    if (value) {
      const success = copy(value);
      if (success) {
        message.success("复制成功！");
      }
    }
  };
  el.addEventListener("click", el._clickHanlder);
};

export default {
  mounted(el, binding) {
    clear(el);
    bind(el, binding?.value);
  },
  updated(el, { value, oldValue } = {} as any) {
    if (value === oldValue) return;

    clear(el);
    bind(el, value);
  },
  unmounted(el) {
    clear(el);
  },
};
