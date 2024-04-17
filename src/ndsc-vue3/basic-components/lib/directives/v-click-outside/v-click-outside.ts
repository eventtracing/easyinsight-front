// @ts-nocheck
const clear = (el) => {
  if (el._clickOutsideHandler) {
    document.removeEventListener("click", el._clickOutsideHandler);
  }
  delete el._clickOutsideHandler;
};

const bind = (el, value) => {
  el._clickOutsideHandler = function clickOutsideHandle(e) {
    if (el.contains(e.target)) return false;

    if (value && typeof value === "function") {
      value(e);
    }
  };
  setTimeout(() => {
    document.addEventListener("click", el._clickOutsideHandler);
  });
};

export default {
  mounted(el, { value } = {} as any) {
    clear(el);
    bind(el, value);
  },
  update(el, { value, oldValue } = {} as any) {
    if (value === oldValue) return;

    clear(el);
    bind(el, value);
  },
  unmounted(el) {
    clear(el);
  },
};
