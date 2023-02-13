// @ts-nocheck
/**
 * 2020-12-23
 * safari 浏览器不支持使用正则表达式字面量书写的零度后行断言（?<= 和 ?<!）
 * 解决方案：
 * 方案一：使用调用RegExp对象的构造函数的方式书写
 * 方案二：使用非捕获分组等其他方式改写
 */

const clear = (el) => {
  if (el._inputHandler) {
    el.removeEventListener("input", el._inputHandler, true);
  }
  if (el._blurHandler) {
    el.removeEventListener("blur", el._blurHandler);
  }
  delete el._inputHandler;
  delete el._blurHandler;
};

export default {
  mounted(el, { value = {} as any }) {
    const negative = !!value.negative;
    const decimal = value.decimal
      ? typeof value.decimal === "number"
        ? value.decimal
        : true
      : false;
    el._inputHandler = function inputHandler(e) {
      let hasDecimal = false;
      e.target.value = e.target.value
        .replace(/[^0-9-.]/g, "")
        .replace(/(.+)-|(\D+)\./g, "$1")
        .replace(/^(-?0)[^.]+/g, "$1")
        .replace(/\./g, () => {
          // 只保留第一个小数点
          if (hasDecimal) {
            return "";
          } else {
            hasDecimal = true;
            return ".";
          }
        });

      if (!negative) {
        e.target.value = e.target.value.replace(/-/g, "");
      }

      if (!decimal) {
        e.target.value = e.target.value.replace(/\./g, "");
      } else if (typeof decimal === "number") {
        e.target.value = e.target.value.replace(
          new RegExp(`^([-0-9]+\\.\\d{${decimal}}).$`, "g"),
          "$1"
        );
      }
    };

    el._blurHandler = function blurHandler(e) {
      e.target.value = e.target.value.replace(/\.$/, ""); // 去除末尾的.
      e.target.value = e.target.value.replace(/^-(?=($|\D))/, ""); // 去除开头无效的-
    };

    el.addEventListener("input", el._inputHandler, true);
    el.addEventListener("blur", el._blurHandler);
  },
  unmounted(el) {
    clear(el);
  },
};
